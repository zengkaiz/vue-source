const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`   // abc-aa
const qnameCapture = `((?:${ncname}\\:)?${ncname})`     // <aaa:dsds>
const startTagOpen = new RegExp(`^<${qnameCapture}`)    // 标签开头的正则
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)     // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/       // 匹配属性的
const startTagClose = /^\s*(\/?)>/   // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/  // {{}}


export function parseHTML(html) {
    // 树根
    let root
    let currentParent
    let stack = []      // 典型的语法分析 利用栈的结构
    // vue2.0 只能有一个根节点，必须是html元素, 不支持多个根节点，需要做dom diff
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
        // 没有根元素的话，第一个元素就是根元素
        if(!root){
            root = element
        }
        currentParent = element
        stack.push(element)
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
    // 结束标签
    function end(tagName){
        let element = stack.pop()
        if (tagName === element.tag) {
          // 此时标识这个p是属于div的儿子
          currentParent = stack[stack.length - 1];
          if (currentParent) {
            element.parent = currentParent;
            currentParent.children.push(element);
          }
        }
    }

    // 根据html解析成树结构 <div id="app" style="color:red"><span>hello</span></div>
    while(html){    
        let textEnd = html.indexOf('<')
        if(textEnd === 0){
            const startTagMatch = parseStarTag()
            if(startTagMatch){
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }
            const endTagMatch = html.match(endTag)
            if(endTagMatch){
                advance(endTagMatch[0].length)
                end(endTagMatch[1])
                continue;
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
        // 匹配到的标签
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
             if(end){   // 去掉开始标签的 > 号
                advance(end[0].length)
                return match
             }
        }
    }
    console.log(root)
    return root
}