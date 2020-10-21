// vue的声明
import { initMixin } from './init'

function Vue(options) {
    // 初始化的操作
    this._init(options)
}
// 通过引入的方式，给vue原型上添加方法
initMixin(Vue)

export default Vue