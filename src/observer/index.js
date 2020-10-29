import { isObject, def } from "../utils/index";
import { arrayMethods } from './array'
import Dep from './dep'

class Observer {
    constructor(data) {
      this.dep = new Dep()  // 给数组用

      // 给每一个监控过的对象新增一个__ob__属性
      // value.__ob__ = this 这种写法有风险
      def(data,"__ob__",this)

      // 1.对象就是使用defineProperty实现数据响应式原理, 如果这个数据不是对象或者是null 那就不用监控了。 这个方法不能兼容ie8及以下，所以vue无法兼容
      // 2. 数组索引进行拦截的话 性能差而且直接更新索引的方式并不多， 所以vue对数组是通过重写数组方法 函数劫持来监控数组本身的方法
      if (Array.isArray(data)) {
        data.__proto__ = arrayMethods;
        this.observerArray(data);
      } else {
        this.walk(data); // 可以对数据一步一步处理
      }
    }
    walk(data){
        // 对象循环  data: {name:'zack }
        Object.keys(data).forEach(key => {
            defineReactice(data,key,data[key])
        })
    }
    observerArray(value){
        for(let i=0; i<value.length;i++){
            observer(value[i]);
        }
    }

}
// vue2的性能问题：递归重写get和set   vue3里面的proxy解决了这个性能问题
function defineReactice(data, key, value) {
    let dep = new Dep() // 给对象用
    // 这里这个value可能是数组也可能是对象，返回的结果是oberver的实例
    let childOb =  observer(value)     // 传入的值继续是对象的话采用递归
    Object.defineProperty(data, key, {
        enumerable: true,
        get() {
            // console.log('取值')
            if(Dep.target){
                dep.depend()    // 如果当前有watcher，意味着我要将watcher存起来
                if (childOb) {  // 数组的依赖收集
                    childOb.dep.depend()
                    // 如果数组中有嵌套数组
                    if (Array.isArray(value)) {
                        dependArray(value)
                    }
                }
            }
            return value    // 每个属性都有自己的watcher
        },
        set(newValue) {
            // console.log("更新数据");
            if(newValue === value){return}
            observer(newValue) // 监控新设置的值是否是对象 也得监听
            value = newValue
            dep.notify()    // 通知依赖的watcher来进行一个更新操作
        }
    })
}
/**
 * 将数组中的每一个都取出来，数据变化后，也去更新视图
 * @param {type} parameter 参数描述
 * @returns {type} 返回值描述
 */
function dependArray(value) {
    for (let i = 0; i < value.length; i++){
        let current = value[i]  
        current.__ob__ && current.__ob__.dep.depend()
        if (Array.isArray(current)) {
            dependArray(current);
        }
    }
}

export function observer(data){
    if(!isObject(data)){
        return
    }
    if(data.__ob__ instanceof Observer){ // 防止对象被重复观测
        return
    }
    //对数据进行defineProperty
    return new Observer(data)
}