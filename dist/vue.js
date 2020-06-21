(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function isObject(obj) {
    if (_typeof(obj) === 'object' && typeof obj !== null) {
      return true;
    }
  }

  var oldArrayMethods = Array.prototype; // 获取原型上的方法

  var arrayMethods = Object.create(oldArrayMethods); // 创建一个新的对象 可以找到原型上的方法，而且不会影响原数组的方法

  var methods = ['push', 'pop', 'shift', 'unshift', 'sort', 'reverse', 'splice'];
  methods.forEach(function (method) {
    arrayMethods[method] = function () {
      // 函数劫持 AOP
      // 当调用数组方法时 会先执行我自己改造的逻辑，然后执行数组默认的逻辑
      var ob = this.__ob__;

      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var result = oldArrayMethods[method].apply(this, args);
      var inserted; // push unshift splice 都可以新增属性  

      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;

        case 'splice':
          inserted = args.slice(2);
          break;
      }

      inserted && ob.observerArray(inserted);
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      // 1.对象就是使用defineProperty实现数据响应式原理, 如果这个数据不是对象或者是null 那就不用监控了。
      // 2. 数组索引进行拦截的话 性能差而且直接更新索引的方式并不多 ？ 所以vue对数组是通过重写数组方法 函数劫持来监控数组本身的方法
      Object.defineProperty(data, '__ob__', {
        enumerable: false,
        // 不可枚举
        configurable: false,
        value: this
      }); // data.__ob__ = this

      if (Array.isArray(data)) {
        data.__proto__ = arrayMethods;
        this.observerArray(data);
      } else {
        this.walk(data); // 可以对数据一步一步处理
      }
    }

    _createClass(Observer, [{
      key: "walk",
      value: function walk(data) {
        // 对象循环  data: {name:'zack }
        Object.keys(data).forEach(function (key) {
          defineReactice(data, key, data[key]);
        });
      }
    }, {
      key: "observerArray",
      value: function observerArray(data) {
        for (var i = 0; i < data.length; i++) {
          observer(data[i]);
        }
      }
    }]);

    return Observer;
  }(); // vue2的性能 递归重写get和set   vue3里面的proxy解决了这个性能问题


  function defineReactice(data, key, value) {
    observer(value); // 传入的值继续是对象的话采用递归

    Object.defineProperty(data, key, {
      get: function get() {
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) {
          return;
        }

        observer(newValue); // 监控设置新设置的值是否是对象 也得监听

        value = newValue;
      }
    });
  }

  function observer(data) {
    if (!isObject(data)) {
      return;
    }

    if (data.__ob__ instanceof Observer) {
      // 防止对象被重复观测
      return;
    } //对数据进行defineProperty


    return new Observer(data);
  }

  /**
   * 初始化状态的js
   * @param {type} parameter 参数描述
   * @returns {type} 返回值描述
   */
  function initState(vm) {
    var opts = vm.$options;
    opts.props && initProps();
    opts.method && initmethod();
    opts.data && initData(vm); // computed  watch 等等
  }

  function initProps(vm) {}

  function initmethod(vm) {}

  function initData(vm) {
    // 数据响应式原理
    var data = vm.$options.data; // vm._data 代表检测后的数据

    data = vm._data = typeof data === 'function' ? data.call(vm) : data;
    observer(data);
  }

  function initMixin(Vue) {
    Vue.prototype._init = function (options) {
      // vue的内部 $options 就是用户传递的所有参数
      var vm = this;
      vm.$options = options;
      initState(vm);
    };
  }

  function Vue(options) {
    // 先来个初始化的操作
    this._init(options);
  }

  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
