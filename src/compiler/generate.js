/**
 * 将ast语法树，再次转换成js的语法
 * @param {type} parameter <div id="app"><span>hello{{msg}}</span></div> 的语法树
 * @returns {type} _c("div", {id: app, {style:{color:'red'}}}, _c("span", undefined, _v('hello'+ _s(msg))))
 *           _c: 创建元素的方法，_v：创建文本的方法 _s： 转字符串方法
 */
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
export function generate(el) {
    let children = genChildren(el)
    let code = `_c("${el.tag}",${
        el.attrs.length?genProps(el.attrs):'undefined'
    }${
        children? `,${children}`:''
    })`
    return code
}
/**
 * 拼接子元素
 * @param {Object} el 父元素
 * @returns {String} 子元素字符串
 */
function genChildren(el) {
    let children = el.children
    if (children && children.length > 0) {
        return `${children.map((c) => gen(c)).join(",")}`;
    } else {
        return false
    }
}
function gen(node) {
    if (node.type === 1) {
        return  generate(node)
    } else {
        let text = node.text    // 形如 a{{name}}b{{age}}c 转为 _v("a"+_s(name)+"b"+_s(age)+"c")
        let tokens = []
        let match, index;
        let lastIndex = defaultTagRE.lastIndex = 0;
        while (match = defaultTagRE.exec(text)) {
            index = match.index
            if (index > lastIndex) {
                tokens.push(JSON.stringify(text.slice(lastIndex, index)))
            }
            tokens.push(`_s(${match[1].trim()})`)
            lastIndex = index + match[0].length
        }
        if (lastIndex < text.length) {
            tokens.push(JSON.stringify(text.slice(lastIndex)))
        }
        console.log(tokens)
        return `_v(${tokens.join('+')})`
    }
}
/**
 * 把属性拼成字符串
 * @param {Array} attrs ast语法树的属性字段
 * @returns {String} 属性字符串
 */
function genProps(attrs) {
    let str = ''
    for (let i = 0; i < attrs.length; i++){
        let attr = attrs[i]
        if (attr.name === 'style') {
            let obj = {}
            attr.value.split(';').forEach(item => {
                let [key, value] = item.split(':')
                obj[key] = value
            })
            attr.value = obj
        }
        str += `${attr.name}:${JSON.stringify(attr.value)},`
    }
    console.log(`{${str.slice(0, -1)}}`);
    return `{${str.slice(0,-1)}}`
}


