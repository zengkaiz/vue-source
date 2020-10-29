import { initMixin } from './init'
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./render"
import { initGlobalAPI } from "./initGlobalAPI/index";

function Vue(options) {
    this._init(options)
}
// 通过引入的方式，给vue原型上添加方法

initMixin(Vue)  // 增添初始化方法
renderMixin(Vue)    // 增添渲染方法，调用我们的render方法
lifecycleMixin(Vue)     // 增添update方法，将虚拟dom渲染成真实dom

// 初始化全局的API
initGlobalAPI(Vue)
export default Vue