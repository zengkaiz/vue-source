import babel from 'rollup-plugin-babel'
import serve from 'rollup-plugin-serve'

export default {
    input: './src/index.js',
    output: {
        format:'umd',
        file: 'dist/vue.js',     // 打包出vue.js
        name: 'Vue',
        sourcemap:true
    },
    plugins: [
        // 解析ES6 --> ES5
        babel({
            exclude: 'node_modules/**'  // 排除文件的操作
        }),
        // 起个服务
        serve({
            // open: true,
            openPage: '/public/index.html',
            port: 3000,
            contentBase: ''
        })
    ]
}