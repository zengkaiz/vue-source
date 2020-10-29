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

export function proxy(vm, source, key) {
  Object.defineProperty(vm, key, {
    get() {
      return vm[source][key];
    },
    set(newValue) {
      vm[source][key] = newValue;
    },
  });
}

const LIFECYCLE_HOOKS = [
  "beforeCreate",
  "created",
  "beforeMount",
  "mounted",
  "beforeUpdate",
  "updated",
  "beforeDestroy",
  "destroyed",
];


let strats = {}
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})

// 合并生命周期钩子
/**
 * desc 生命周期函数合并方法
 * @param {Function} parentVal 父级生命周期值
 * @param {Function} childVal 子级生命周期值
 * @returns {Array} 生命周期函数合并后的数组
 */
function mergeHook(parentVal, childVal) {
  // 如果有子级 且 有父级 则父级合并子级
  if (childVal) {
    if (parentVal) {
      return parentVal.concat(childVal);
    }
    // 如果没有父级则直接返回数组包裹的子级 这样保证了 最后返回的肯定是一个数组
    else {
      return [childVal];
    }
  }
  // 如果没有子级则直接返回父级
  else {
    return parentVal;
  }
}

export function mergeOptions(parent, child) {
  const options = {};
  // 先合并父里面
  for (let key in parent) {
    mergeField(key);
  }
  for (let key in child) {
    // 如果已经合并过就不需要再合并了
    if (!parent.hasOwnProperty(key)) {
      mergeField(key);
    }
  }
  // 默认的合并策略 （部分属性需要特殊的合并方式）
  function mergeField(key) {
    if (strats[key]) {
      return (options[key] = strats[key](parent[key], child[key]));
    }
    if (typeof parent[key] === "object" && typeof child[key] === "object") {
      options[key] = {
        ...parent[key],
        ...child[key],
      };
    } else if (child[key] == null) {
      options[key] = parent[key];
    } else {
      options[key] = child[key];
    }
  }
  return options;
}