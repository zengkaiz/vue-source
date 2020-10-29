import { mergeOptions} from '../utils'

export function initGlobalAPI(Vue) {
    // 整合了全局相关的内容
    Vue.options = {}

    Vue.mixin = function (mixin) {
        this.options = mergeOptions(this.options, mixin)
    }
    // 生命周期的合并策略
    Vue.mixin({
    //   a: 1,
      beforeCreate() {
        console.log("mixin 1");
      },
    });

    Vue.mixin({
        // b:2,
        beforeCreate() {
            console.log("mixin 2");
        }
    })

    console.log(Vue.options)
}