import {isObject} from '../utils'
import {arrayMethods} from './array'

class Observer {
    constructor(data){
         // 1.对象就是使用defineProperty实现数据响应式原理, 如果这个数据不是对象或者是null 那就不用监控了。
         // 2. 数组索引进行拦截的话 性能差而且直接更新索引的方式并不多 ？ 所以vue对数组是通过重写数组方法 函数劫持来监控数组本身的方法
         Object.defineProperty(data, '__ob__', {
            enumerable: false, // 不可枚举
            configurable: false,
            value: this
        })
        // data.__ob__ = this
         if(Array.isArray(data)){
            data.__proto__ = arrayMethods
            this.observerArray(data)
         } else {
            this.walk(data) // 可以对数据一步一步处理
         }
        
    }
    walk(data){
        // 对象循环  data: {name:'zack }
        Object.keys(data).forEach(key => {
            defineReactice(data,key,data[key])
        })
    }
    observerArray(data){
        for(let i=0; i<data.length;i++){
            observer(data[i])
        }
    }

}
// vue2的性能 递归重写get和set   vue3里面的proxy解决了这个性能问题
function defineReactice(data, key, value){
    observer(value)     // 传入的值继续是对象的话采用递归
    Object.defineProperty(data,key, {
        get(){
            return value
        },
        set(newValue){
            if(newValue === value){return}
            observer(newValue) // 监控设置新设置的值是否是对象 也得监听
            value = newValue
        }
    })
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