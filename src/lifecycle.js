import Watcher from './observer/watcher'
import { patch} from './vdom/patch'
export function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
        const vm = this
        vm.$el = patch(vm.$el, vnode);
    }
}


export function mountComponent(vm, el) {
    // render
    const options = vm.$options
    // 真实的dom元素$el 替换el
    vm.$el = el
    // 挂载之前
    callHook(vm, 'beforeMount')
    // 渲染和更新页面方法
    let updateComponent = () => {
      // vm._render() 通过解析好的render方法，返回虚拟dom； vm._update() 通过虚拟dom，返回真实dom
      vm._update(vm._render());
    }
    // 渲染watcher 每个组件都有一个渲染watcher
    new Watcher(vm, updateComponent, () => { }, true); // true 表示是一个渲染watcher
    // 渲染之后
    callHook(vm, 'mounted')
}

export function callHook(vm, hook) {
    const handlers = vm.$options[hook]
    if (handlers) {
        for (let i = 0; i < handlers.length; i++){
            handlers[i].call(vm)
        }
    }
}