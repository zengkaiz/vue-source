export function patch(oldVnode, vnode) {
    // 递归创建真实节点 替换掉老的节点
    // 1. 判断是更新还是要渲染
    const isRealElement = oldVnode.nodeType
    if (isRealElement) {
        const oldElm = oldVnode // div id="app"
        const parentElm = oldElm.parentNode // body
        let el = createElm(vnode)
        parentElm.insertBefore(el, oldElm.nextSibling)
        parentElm.removeChild(oldElm)
        return el
    }
}
/**
 * 创建节点
 * @param {Object} vnode 节点
 * @returns {type} 真实dom
 */
function createElm(vnode) {
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
 */
function updateProperties(vnode) {
    let newProps = vnode.data || {}
    let el = vnode.el
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