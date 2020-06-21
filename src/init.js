import {initState} from './state.js'
export function initMixin(Vue){
    Vue.prototype._init = function(options){
        // vue的内部 $options 就是用户传递的所有参数
        const vm = this
        vm.$options = options

        initState(vm)
    }
}  