/**
 * 初始化状态的js
 * @param {type} parameter 参数描述
 * @returns {type} 返回值描述
 */
import { observer } from './observer/index.js'

export function initState(vm){
    const opts = vm.$options
    opts.props && initProps(vm)
    opts.method && initmethod(vm)
    opts.data && initData(vm)
    // computed  watch 等等
}
function initProps(vm){}
function initmethod(vm){}
function initData(vm){
    // 数据响应式原理
    let data = vm.$options.data
    // vm._data 代表检测后的数据
    data = vm._data = typeof data=== 'function' ? data.call(vm) : data;

    observer(data)
}