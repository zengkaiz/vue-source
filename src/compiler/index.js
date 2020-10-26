import {parseHTML} from './parser'
import {generate} from './generate'


export function compileToFunctions(template) {
    // 实现代码编译  ast语法树：用对象描述js语法  虚拟dom： 用对象来描述dom节点
    // 1. 解析html字符串，将html字符串转成ast语法树
    let ast = parseHTML(template);
    // 2. 将ast语法树生成最终的render函数 ，就是字符串拼接（模板引擎:所有的模板引擎实现，都需要new Function + with)
    let code = generate(ast);
    code = `with(this){return ${code}}`;
    console.log(code);
    let render = new Function(code); // 将字符串转换为函数
    console.log(render);
    return render;
}   


/**
 * desc
 * @param {type} parameter 参数描述
 * @returns {type} 返回值描述
 * 
 * // 第一步： 解析html字符串，将html字符串转成ast语法树 parseHTML
 * <div id='app'>
 *    <p>hello</p>
 * </div>
 * let root = {
 *    tag: 'div',
 *    attrs: [{name:'id',value:'app'}],
 *    parent: null,
 *    type:1,
 *    children: [
 *      {   tag: 'p',
 *          attrs: [],
 *          parent: root,
 *          children: [
 *              {
 *                  text: 'hello',
 *                  type; 3   
 *              }
 *          ]
 *      }
 *    ]
 * }
 * 
 * // 第二步： 将ast语法树生成最终的render函数
 * render(){
 *   return _c('div',{style:{color:'red'}},_v('hello'+_s(name)),_c('span',undefined,''))
 * }
 */