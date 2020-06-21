let oldArrayMethods = Array.prototype  // 获取原型上的方法
export let arrayMethods = Object.create(oldArrayMethods)    // 创建一个新的对象 可以找到原型上的方法，而且不会影响原数组的方法

let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'sort',
    'reverse',
    'splice'
]

methods.forEach(method => {
    arrayMethods[method] = function(...args){      // 函数劫持 AOP
        // 当调用数组方法时 会先执行我自己改造的逻辑，然后执行数组默认的逻辑
        const ob = this.__ob__
        let result = oldArrayMethods[method].apply(this, args)
        let inserted
        // push unshift splice 都可以新增属性  

        switch(method){
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':
                inserted = args.slice(2)
                break
            default:
                break
        }
        inserted && ob.observerArray(inserted)
        return result
    }
})