export function isObject(obj) {
    if(typeof obj === 'object' && typeof obj !== null){
        return true
    }
}


export function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false, // 不可枚举
      configurable: false,
      value
    });
}