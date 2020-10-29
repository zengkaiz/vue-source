# vue-source 手写 vue2.0 源码

### rollup 的配置

npm install
rollup(打包工具)
@babel/core(babel 核心模块)
@babel/preset-env(babel 将高级语法转换成低级语法)
rollup-plugin-babel （桥梁）
rollup-plugin-serve（实现静态服务）
cross-env（设置环境变量）

### 响应式 observe

1. 对象的数据劫持
2. 数组的劫持

### 模板编译 compiler

1. 解析 html 字符串，将 html 字符串转成 ast 语法树
2. ast 语法树生成最终的 render 函数
3. 通过 render 函数生成虚拟 dom
4. 由虚拟 dom 生成真实 dom

### 生命周期的合并策略 lifecycle

### 对象的依赖收集

### 数组的依赖收集

### 异步更新渲染

同步代码都写完成后去刷新队列触发一次渲染
