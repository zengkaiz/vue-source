import {initState} from './state.js'
import { compileToFunctions } from './compiler/index'
import { mountComponent } from './lifecycle'

export function initMixin(Vue) {
    // 给vue的原型上添加一个init方法
    Vue.prototype._init = function(options){
      // vue的内部 $options 就是用户传递的所有参数
      const vm = this;
      vm.$options = options;
      // 初始化状态
      initState(vm);
      // 模板渲染
      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    }
    Vue.prototype.$mount = function (el) {
        const vm = this;
        const opts = vm.$options;
        el = document.querySelector(el)
        // 如果同时会传入template和render 默认会采用render 
        // 如果都没传则使用id=app的模板
      if (!opts.render) {
        // 取出模板，对模板进行编译
        let template = opts.template;
        if (!template && el) {
          template = el.outerHTML;
        }

        const render = compileToFunctions(template);
        opts.render = render;
      }
      // 渲染当前的组件 挂载这个组件
      mountComponent(vm, el)
    }
}  