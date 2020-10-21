import {initState} from './state.js'
import { compileToFunctions } from './compiler/index'

export function initMixin(Vue) {
    // 给vue的原型上添加一个init方法
    Vue.prototype._init = function(options){
      // vue的内部 $options 就是用户传递的所有参数
      const vm = this;
      vm.$options = options;
      // 初始化状态
      initState(vm);

      if (vm.$options.el) {
        // 模板渲染
        vm.$mount(vm.$options.el);
      }
    }
    Vue.prototype.$mount = function(el){
        el = document.querySelector(el)

        // 如果同时会传入template和render 默认会采用render 
        // 如果都没传则使用id=app的模板
        const vm = this
        const opts = vm.$options
        
        if(!opts.render){
            let template = opts.template
            if(!template && el){
                template = el.outerHTML
            }

            const render = compileToFunctions(template)
            opts.render = render
        }
    }
}  