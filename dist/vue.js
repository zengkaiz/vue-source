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
  function def(data, key, value) {
    Object.defineProperty(data, key, {
      enumerable: false,
      // 不可枚举
      configurable: false,
      value: value
    });
  }

  // data.__proto__ = arrayMethods    arrayMethods.__proto__ = oldArrayMethods 原型链查找
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
      var inserted; // push unshift splice 都可以新增属性，新增的属性也要监听

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

      // 给每一个监控过的对象新增一个__ob__属性
      // value.__ob__ = this 这种写法有风险
      def(data, "__ob__", this); // 1.对象就是使用defineProperty实现数据响应式原理, 如果这个数据不是对象或者是null 那就不用监控了。 这个方法不能兼容ie8及以下，所以vue无法兼容
      // 2. 数组索引进行拦截的话 性能差而且直接更新索引的方式并不多， 所以vue对数组是通过重写数组方法 函数劫持来监控数组本身的方法

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
      value: function observerArray(value) {
        for (var i = 0; i < value.length; i++) {
          observer(value[i]);
        }
      }
    }]);

    return Observer;
  }(); // vue2的性能问题：递归重写get和set   vue3里面的proxy解决了这个性能问题


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

        observer(newValue); // 监控新设置的值是否是对象 也得监听

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
    opts.data && initData(vm);
    opts.computed && initComputed();
    opts.watch && initWatch();
  }

  function initProps(vm) {}

  function initmethod(vm) {}

  function initData(vm) {
    console.log(vm.$options.data); // 数据响应式原理

    var data = vm.$options.data; // vm._data 代表检测后的数据

    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 用户改变了数据，驱动视图变化 MVVM 数据变化可以驱动视图变化

    observer(data);
  }

  function initComputed(vm) {}

  function initWatch(vm) {}

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture));
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>"));
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;
  var startTagClose = /^\s*(\/?)>/;
  function parseHTML(html) {
    // 树根
    var root;
    var currentParent;
    var stack = []; // 典型的语法分析 利用栈的结构
    // vue2.0 只能有一个根节点，必须是html元素

    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        attrs: attrs,
        children: [],
        parent: null,
        type: 1 // 1.元素 3.文本

      };
    } // 开始标签  每次解析开始标签都会执行


    function start(tagName, attrs) {
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element;
      stack.push(element);
    } // 结束标签


    function end(tagName) {
      var element = stack.pop();
      var parent = stack[stack.length - 1];

      if (parent) {
        element.parent = parent;
        parent.children.push(element);
      }
    } // 文本


    function chars(txt) {
      var text = txt.replace(/\s/g, '');

      if (text) {
        currentParent.children.push({
          text: text,
          type: 3
        });
      }
    } // 根据html解析成树结构 <div id="app" style="color:red"><span>hello</span></div>


    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        var startTagMatch = parseStarTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
        }
      } // 如果不是0 说明是文本


      var text = void 0;

      if (textEnd > 0) {
        text = html.substring(0, textEnd); // 将文本的内容截取

        chars(text);
      }

      if (text) {
        advance(text.length); // 删除文本内容
      }
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseStarTag() {
      var start = html.match(startTagOpen); // 匹配开始标签

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);

        var _end, attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (_end) {
          advance(_end[0].length);
          return match;
        }
      }
    }

    console.log(root);
    return root;
  }

  function compileToFunctions(template) {
    // 实现代码编译
    var ast = parseHTML(template); // 代码生成 核心：字符串拼接
  }

  function initMixin(Vue) {
    // 给vue的原型上添加一个init方法
    Vue.prototype._init = function (options) {
      // vue的内部 $options 就是用户传递的所有参数
      var vm = this;
      vm.$options = options; // 初始化状态

      initState(vm);

      if (vm.$options.el) {
        // 模板渲染
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      el = document.querySelector(el); // 如果同时会传入template和render 默认会采用render 
      // 如果都没传则使用id=app的模板

      var vm = this;
      var opts = vm.$options;

      if (!opts.render) {
        var template = opts.template;

        if (!template && el) {
          template = el.outerHTML;
        }

        var render = compileToFunctions(template);
        opts.render = render;
      }
    };
  }

  // vue的声明

  function Vue(options) {
    // 初始化的操作
    this._init(options);
  } // 通过引入的方式，给vue原型上添加方法


  initMixin(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
