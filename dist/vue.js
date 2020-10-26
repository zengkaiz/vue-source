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

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // abc-aa

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <aaa:dsds>

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >

  function parseHTML(html) {
    // 树根
    var root;
    var currentParent;
    var stack = []; // 典型的语法分析 利用栈的结构
    // vue2.0 只能有一个根节点，必须是html元素, 不支持多个根节点，需要做dom diff

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
      var element = createASTElement(tagName, attrs); // 没有根元素的话，第一个元素就是根元素

      if (!root) {
        root = element;
      }

      currentParent = element;
      stack.push(element);
    } // 文本


    function chars(txt) {
      var text = txt.replace(/\s/g, '');

      if (text) {
        currentParent.children.push({
          text: text,
          type: 3
        });
      }
    } // 结束标签


    function end(tagName) {
      var element = stack.pop();

      if (tagName === element.tag) {
        // 此时标识这个p是属于div的儿子
        currentParent = stack[stack.length - 1];

        if (currentParent) {
          element.parent = currentParent;
          currentParent.children.push(element);
        }
      }
    } // 根据html解析成树结构 <div id="app" style="color:red"><span>hello</span></div>


    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        var startTagMatch = parseStarTag();

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]);
          continue;
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
      // 匹配到的标签

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
          // 去掉开始标签的 > 号
          advance(_end[0].length);
          return match;
        }
      }
    }

    console.log(root);
    return root;
  }

  /**
   * 将ast语法树，再次转换成js的语法
   * @param {type} parameter <div id="app"><span>hello{{msg}}</span></div> 的语法树
   * @returns {type} _c("div", {id: app, {style:{color:'red'}}}, _c("span", undefined, _v('hello'+ _s(msg))))
   *           _c: 创建元素的方法，_v：创建文本的方法 _s： 转字符串方法
   */
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;
  function generate(el) {
    var children = genChildren(el);
    var code = "_c(\"".concat(el.tag, "\",").concat(el.attrs.length ? genProps(el.attrs) : 'undefined').concat(children ? ",".concat(children) : '', ")");
    return code;
  }

  function genChildren(el) {
    var children = el.children;

    if (children && children.length > 0) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(","));
    } else {
      return false;
    }
  }

  function gen(node) {
    if (node.type == 1) {
      return generate(node);
    } else {
      var text = node.text; // 形如 a{{name}}b{{age}}c 转为 _v("a"+_s(name)+"b"+_s(age)+"c")

      var tokens = [];
      var match, index;
      var lastIndex = defaultTagRE.lastIndex = 0;

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].length;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      console.log(tokens);
      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function genProps(attrs) {
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value));
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function compileToFunctions(template) {
    // 实现代码编译  ast语法树：用对象描述js语法  虚拟dom： 用对象来描述dom节点
    // 1. 解析html字符串，将html字符串转成ast语法树
    var ast = parseHTML(template); // 2. 将ast语法树生成最终的render函数 ，就是字符串拼接（模板引擎:所有的模板引擎实现，都需要new Function + with)

    var code = generate(ast);
    code = "with(this){return ".concat(code, "}");
    console.log(code);
    var render = new Function(code); // 将字符串转换为函数

    console.log(render);
    return render;
  }
  /**
   * desc
   * @param {type} parameter 参数描述
   * @returns {type} 返回值描述
   * 
   * // 第一步： 解析html字符串，将html字符串转成ast语法树 parseHTML
   * <div id='app'>
   *    <p>hello</p>
   * </div>
   * let root = {
   *    tag: 'div',
   *    attrs: [{name:'id',value:'app'}],
   *    parent: null,
   *    type:1,
   *    children: [
   *      {   tag: 'p',
   *          attrs: [],
   *          parent: root,
   *          children: [
   *              {
   *                  text: 'hello',
   *                  type; 3   
   *              }
   *          ]
   *      }
   *    ]
   * }
   * 
   * // 第二步： 将ast语法树生成最终的render函数
   * render(){
   *   return _c('div',{style:{color:'red'}},_v('hello'+_s(name)),_c('span',undefined,''))
   * }
   */

  function initMixin(Vue) {
    // 给vue的原型上添加一个init方法
    Vue.prototype._init = function (options) {
      // vue的内部 $options 就是用户传递的所有参数
      var vm = this;
      vm.$options = options; // 初始化状态

      initState(vm); // 模板渲染

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };

    Vue.prototype.$mount = function (el) {
      var vm = this;
      var opts = vm.$options;
      el = document.querySelector(el); // 如果同时会传入template和render 默认会采用render 
      // 如果都没传则使用id=app的模板

      if (!opts.render) {
        // 取出模板，对模板进行编译
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
