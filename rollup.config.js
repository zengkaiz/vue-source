import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
    // 打包入口
    input: './src/index.js',
    // 打包输出
    output: {
        format:'umd',   // 统一模块规范
        file: 'dist/vue.js',     // 出口路径
        name: 'Vue',    // 打包后全局变量的名字
        sourcemap:true  // es6-es5 开启源码调试，可找到源代码报错位置
    },
    plugins: [
        // 解析ES6 --> ES5
        babel({
            exclude: 'node_modules/**'  // 排除文件的操作
        }),
        // 起个服务
        process.env.ENV === 'development' ? serve({
            // open: true,
            openPage: '/public/index.html', // 默认打开html的路径
            port: 3000,
            contentBase: ''
        }):null
    ]
}