import {parseHTML} from './parser'
import {generate} from './generate'

export function compileToFunctions(template) {
    // 实现代码编译
    let ast = parseHTML(template)

    // 代码生成 核心：字符串拼接
    let code = generate(ast)
}   