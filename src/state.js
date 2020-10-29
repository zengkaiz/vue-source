/**
 * 初始化状态的js
 * @param {type} parameter 参数描述
 * @returns {type} 返回值描述
 */
import { observer } from './observer/index.js'
import { proxy } from "./utils";

export function initState(vm){
    const opts = vm.$options
    opts.props && initProps(vm)
    opts.method && initmethod(vm)
    opts.data && initData(vm)
    opts.computed && initComputed(vm);
    opts.watch && initWatch(vm);
}
function initProps(vm){}
function initmethod(vm) { }

function initData(vm) {
    // 数据响应式原理
    let data = vm.$options.data
    // vm._data 代表检测后的数据
    data = vm._data = typeof data === 'function' ? data.call(vm) : data;
    // 为了让用户更好的使用取值，希望vm.xxx
    for (let key in data){
        proxy(vm, '_data', key)
    }
    // 用户改变了数据，驱动视图变化 MVVM 数据变化可以驱动视图变化
    observer(data)
}
function initComputed(vm) { }
function initWatch(vm) {}