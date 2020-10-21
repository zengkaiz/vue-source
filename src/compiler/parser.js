const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`
const qnameCapture = `((?:${ncname}\\:)?${ncname})`
const startTagOpen = new RegExp(`^<${qnameCapture}`)
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
const startTagClose = /^\s*(\/?)>/
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/


export function parseHTML(html) {
    // 树根
    let root
    let currentParent
    let stack = []      // 典型的语法分析 利用栈的结构
    // vue2.0 只能有一个根节点，必须是html元素
    function createASTElement(tagName, attrs) {
        return {
            tag: tagName,
            attrs,
            children:[],
            parent: null,
            type: 1     // 1.元素 3.文本
        }
    }
    // 开始标签  每次解析开始标签都会执行
    function start(tagName, attrs){
        let element = createASTElement(tagName, attrs)
        if(!root){
            root = element
        }
        currentParent = element
        stack.push(element)
    }
    // 结束标签
    function end(tagName){
        let element = stack.pop()
        let parent= stack[stack.length - 1]
        if(parent){
            element.parent = parent
            parent.children.push(element)
        }
    }
    // 文本
    function chars(txt){
        let text = txt.replace(/\s/g, '')
        if(text){
            currentParent.children.push({
                text: text,
                type: 3
            })
        }
    }

    // 根据html解析成树结构 <div id="app" style="color:red"><span>hello</span></div>
    while(html){    
        let textEnd = html.indexOf('<')
        if(textEnd === 0){
            const startTagMatch = parseStarTag()
            if(startTagMatch){
                start(startTagMatch.tagName, startTagMatch.attrs)
            }
            const endTagMatch = html.match(endTag)
            if(endTagMatch){
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
            }
        }
        
        // 如果不是0 说明是文本
        let text
        if(textEnd > 0){
            text = html.substring(0, textEnd)   // 将文本的内容截取
            chars(text)
        }
        if(text){
            advance(text.length)        // 删除文本内容
        }
    }
    function advance(n){
        html = html.substring(n)
    }
    function parseStarTag(){
        const start = html.match(startTagOpen) // 匹配开始标签
        if(start){
             const match = {
                 tagName: start[1],
                 attrs: []
             }
             advance(start[0].length)
             let end, attr
             while( !(end = html.match(startTagClose)) && (attr = html.match(attribute))){
                advance(attr[0].length)
                match.attrs.push({name:attr[1], value: attr[3] || attr[4] || attr[5]})
             }
             if(end){
                advance(end[0].length)
                return match
             }
        }
    }
    console.log(root)
    return root
}