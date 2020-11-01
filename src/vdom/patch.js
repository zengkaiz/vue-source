export function patch(oldVnode, newVnode) {
    // 递归创建真实节点 替换掉老的节点
    // 1. 判断是更新还是要渲染
    const isRealElement = oldVnode.nodeType
    if (isRealElement) {
        const oldElm = oldVnode // div id="app"
        const parentElm = oldElm.parentNode // body
        let el = createElm(newVnode);
        parentElm.insertBefore(el, oldElm.nextSibling)
        parentElm.removeChild(oldElm)
        return el
    } else {
        // dom diff  同层比较 O(n)  不需要跨级比较
        // 两棵树 要先比较树根是否一样，再比较儿子是否一样

        // 标签名不一致， 说明两个不一样的节点
        if (oldVnode.tag !== newVnode.tag) {
            oldVnode.el.parentNode.replaceChild(createElm(newVnode), oldVnode.el)
        }
        // 标签一致，都是文本  tag
        if (!oldVnode.tag) {
            if (oldVnode.text !== newVnode.text) {
                oldVnode.el.textContent = newVnode.text
            }
        }
        // 标签一致且都是标签

        // 需要复用老的节点，替换掉老的属性
        let el = newVnode.el = oldVnode.el
        // 更新属性
        updateProperties(newVnode, oldVnode.data)

        // 对比孩子
        // 老的有孩子，新的没孩子，直接删除
        // 老的没孩子，新的有孩子，直接插入
        let oldChildren = oldVnode.children || []
        let newChildren = newVnode.children || [];

        if (oldChildren.length > 0 && newChildren.length > 0) {
            // diff 核心 两个都有孩子 通过比较老孩子和新孩子 去操作el中的孩子
            updateChildren(el, oldChildren, newChildren)
        } else if (oldChildren.length > 0) {
            el.innerHTML = ''
        } else if (newChildren.length > 0) {
            for (let i = 0; i < newChildren.length; i++){
                let child = newChildren[i]
                el.appendChild(createElm(child))
            }
        }
        return el
    }
}
function isSameVnode(oldVnode, newVnode) {
    return (oldVnode.key === newVnode.key) && (oldVnode.tag === newVnode.tag)
}

function updateChildren(parent, oldChildren, newChildren) {
    // vue2.0 使用双指针的方式对比
    // v-for 要有key key可以标识元素是否发生变化 前后key相同则可以服用这个元素
    let oldStartIndex = 0   // 老的开始索引
    let oldStartVnode = oldChildren[0]  // 老的开始标签
    let oldEndIndex = oldChildren.length - 1    // 老的结尾索引
    let oldEndVnode = oldChildren[oldEndIndex]   // 老的结尾标签

    let newStartIndex = 0;  // 新的开始索引
    let newStartVnode = newChildren[0]; // 新的开始标签
    let newEndIndex = newChildren.length - 1;  // 新的结尾索引
    let newEndVnode = newChildren[newEndIndex]; // 新的结尾标签

    function makeIndexByKey(children) {
      let map = {};
      children.forEach((item, index) => {
        map[item.key] = index;
      });
      return map;
    }
    let map = makeIndexByKey(oldChildren);

    // 方案一： 先开始从头部进行比较
    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
        if (!oldStartVnode) {
            oldStartVnode = oldChildren[++oldEndIndex]
        } else if (!oldEndVnode) {
            oldEndVnode = oldChildren[--oldEndIndex]
            // 判断两个虚拟节点书否一致，用key和type判断
        } else if ((isSameVnode(oldStartVnode, newStartVnode))) {
            // 标签和key一致，但是属性可能不一致
            patch(oldStartVnode, newStartVnode)
            oldStartVnode = oldChildren[++oldStartIndex]
            newStartVnode = newChildren[++newStartIndex]
            // 方案二：如果头部不一致，开始尾部比较，优化向前插入
        } else if (isSameVnode(oldEndVnode, newEndVnode)) {
            patch(oldEndVnode, newEndVnode)
            oldEndVnode = oldChildren[--oldEndIndex]
            newEndVnode = newChildren[--newStartIndex]
            // 方案三 头不一样 尾不一样 头移尾
        } else if (isSameVnode(oldStartVnode, newEndVnode)) {
            patch(oldStartVnode, newEndVnode)
            parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling)   // 具备移动性
            oldStartVnode = oldChildren[++oldStartIndex]
            newEndVnode = newChildren[--newEndIndex]
             // 方案四 头不一样 尾不一样 头移尾
        } else if (isSameVnode(oldEndVnode, newStartVnode)) {
            patch(oldEndVnode, newStartVnode)
            parent.insertBefore(oldEndVnode.el, oldStartVnode.el)   // 具备移动性
            oldEndVnode = oldChildren[--oldEndIndex]
            newStartVnode = newChildren[++newStartIndex]
        } else {
            // 最终方案：乱序对比
            let moveIndex = map[newStartVnode.key]
            // 新元素的情况
            if (moveIndex == undefined) {
                parent.insertBefore(createElm(newStartVnode), oldStartVnode.el)
            } else {
                let moveNode = oldChildren[moveIndex]
                oldChildren[moveIndex] = null   // 占位 删除的话会导致数组塌陷
                // 找到的话插入到老节点的最前面
                patch(moveNode, newStartVnode);
                parent.insertBefore(moveNode.el, oldStartVnode.el); 
            }
            newStartVnode = newChildren[++newStartIndex]
        }
        
    }
    // 说明老的已经循环完了，剩下的新的应该追加
    if (newStartIndex <= newEndIndex) {
        for (let i = newStartIndex; i <= newEndIndex; i++){
            console.log(createElm(newChildren[i]));
            parent.appendChild(createElm(newChildren[i]));
        }
    }
    // 此时新的已经循环完了，剩下的老的是应该删除的。
    if (oldStartIndex <= oldEndIndex) {
        for (let i = oldStartIndex; i <= oldEndIndex; i++){
            let child = oldChildren[i];
            console.log(child);
            if (child != null) {
                parent.removeChild(child.el);
            }
        }
    }
}

/**
 * 创建节点
 * @param {Object} vnode 节点
 * @returns {type} 真实dom
 */
export function createElm(vnode) {
    let { tag, children, key, data, text } = vnode
    if (typeof tag === 'string') {
        vnode.el = document.createElement(tag)
        updateProperties(vnode)
        children.forEach(child => {
            return vnode.el.appendChild(createElm(child));
        })
    } else {
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}
/**
 * 更新属性
 * @param {Object} vnode 节点
 * @param {Object} oldProps 老节点的属性
 */
function updateProperties(vnode, oldProps = {}) {
    let el = vnode.el;
    let newProps = vnode.data || {};
    // 需要比对vnode.data 和 oldProps 的差异
    
    let oldStyle = oldProps.style || {}
    let newStyle = newProps.style || {};
    // 新老节点的样式对比，新节点的没有的样式，需要删掉
    for (let key in oldStyle) {
        if (!newStyle[key]) {
            el.style[key] = ''
        }
    }
    // 新老节点的属性对比，新节点的没有的属性，需要删掉
    for (let key in oldProps) {
        if (!newProps[key]) {
            el.removeAttribute(key)
        }
    }
    // 其他情况直接用新的覆盖掉老的就行
    for (let key in newProps){
        if (key === 'style') {
            for (let styleName in newProps.style) {
                el.style[styleName] = newProps.style[styleName]
            }
        } else if (key === 'class') {
            el.className = newProps.class
        } else {
            el.setAttribute(key, newProps[key]);
        }
    }
}