import { initMixin } from './init'

function Vue(options) {
    // 先来个初始化的操作
    this._init(options)
}
initMixin(Vue)

export default Vue