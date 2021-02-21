(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('.')) :
  typeof define === 'function' && define.amd ? define(['.'], factory) :
  (global = global || self, global.Vue = factory(global._));
}(this, (function (_) { 'use strict';

  _ = _ && Object.prototype.hasOwnProperty.call(_, 'default') ? _['default'] : _;

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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
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
  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }
  var LIFECYCLE_HOOKS = ["beforeCreate", "created", "beforeMount", "mounted", "beforeUpdate", "updated", "beforeDestroy", "destroyed"];
  var strats = {};
  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  }); // 合并生命周期钩子

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
      } // 如果没有父级则直接返回数组包裹的子级 这样保证了 最后返回的肯定是一个数组
      else {
          return [childVal];
        }
    } // 如果没有子级则直接返回父级
    else {
        return parentVal;
      }
  }

  function mergeOptions(parent, child) {
    var options = {}; // 先合并父里面

    for (var key in parent) {
      mergeField(key);
    }

    for (var _key in child) {
      // 如果已经合并过就不需要再合并了
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    } // 默认的合并策略 （部分属性需要特殊的合并方式）


    function mergeField(key) {
      if (strats[key]) {
        return options[key] = strats[key](parent[key], child[key]);
      }

      if (_typeof(parent[key]) === "object" && _typeof(child[key]) === "object") {
        options[key] = _objectSpread2(_objectSpread2({}, parent[key]), child[key]);
      } else if (child[key] == null) {
        options[key] = parent[key];
      } else {
        options[key] = child[key];
      }
    }

    return options;
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

      inserted && ob.observerArray(inserted); // 如果用户调用了数组方法，会通知更新

      console.log("update");
      ob.dep.notify();
      return result;
    };
  });

  var id = 0;

  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);

      this.id = id++;
      this.subs = [];
    }

    _createClass(Dep, [{
      key: "addSub",
      value: function addSub(watcher) {
        this.subs.push(watcher);
      } // 观察者模式--依赖收集

    }, {
      key: "depend",
      value: function depend() {
        // 让watcher 记住我当前的dep，如果watcher没存过dep，那么dep肯定也没存过watcher
        Dep.target.addDep(this); // this.subs.push(Dep.target)
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          return watcher.update();
        });
      }
    }]);

    return Dep;
  }();
  var stack = [];
  function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
  }
  function popTarget() {
    stack.pop();
    Dep.target = stack[stack.length - 1];
  }

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);

      this.dep = new Dep(); // 给数组用
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
    var dep = new Dep(); // 给对象用
    // 这里这个value可能是数组也可能是对象，返回的结果是oberver的实例

    var childOb = observer(value); // 传入的值继续是对象的话采用递归

    Object.defineProperty(data, key, {
      enumerable: true,
      get: function get() {
        // console.log('取值')
        if (Dep.target) {
          dep.depend(); // 如果当前有watcher，意味着我要将watcher存起来

          if (childOb) {
            // 数组的依赖收集
            childOb.dep.depend(); // 如果数组中有嵌套数组

            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }

        return value; // 每个属性都有自己的watcher
      },
      set: function set(newValue) {
        // console.log("更新数据");
        if (newValue === value) {
          return;
        }

        observer(newValue); // 监控新设置的值是否是对象 也得监听

        value = newValue;
        dep.notify(); // 通知依赖的watcher来进行一个更新操作
      }
    });
  }
  /**
   * 将数组中的每一个都取出来，数据变化后，也去更新视图
   * @param {type} parameter 参数描述
   * @returns {type} 返回值描述
   */


  function dependArray(value) {
    for (var i = 0; i < value.length; i++) {
      var current = value[i];
      current.__ob__ && current.__ob__.dep.depend();

      if (Array.isArray(current)) {
        dependArray(current);
      }
    }
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
    // 数据响应式原理
    var data = vm.$options.data; // vm._data 代表检测后的数据

    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 为了让用户更好的使用取值，希望vm.xxx

    for (var key in data) {
      proxy(vm, '_data', key);
    } // 用户改变了数据，驱动视图变化 MVVM 数据变化可以驱动视图变化


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
  /**
   * 拼接子元素
   * @param {Object} el 父元素
   * @returns {String} 子元素字符串
   */

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
    if (node.type === 1) {
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

      return "_v(".concat(tokens.join('+'), ")");
    }
  }
  /**
   * 把属性拼成字符串
   * @param {Array} attrs ast语法树的属性字段
   * @returns {String} 属性字符串
   */


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

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function compileToFunctions(template) {
    // 实现代码编译  ast语法树：用对象描述js语法  虚拟dom： 用对象来描述dom节点
    // 1. 解析html字符串，将html字符串转成ast语法树
    var ast = parseHTML(template);
    console.log("ast语法树:", ast); // 2. 将ast语法树生成最终的render函数 ，就是字符串拼接（模板引擎:所有的模板引擎实现，都需要new Function + with)

    var code = generate(ast);
    code = "with(this){return ".concat(code, "}");
    var render = new Function(code); // 将字符串转换为函数 new Function + with，返回的是是虚拟dom

    console.log("render函数：", render);
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

  var callbacks = [];
  var waiting = false;

  function flushCallBack() {
    callbacks.forEach(function (cb) {
      return cb();
    });
    waiting = false;
  }

  function nextTick(cb) {
    callbacks.push(cb);

    if (!waiting) {
      setTimeout(function () {
        flushCallBack();
      }, 0);
      waiting = true;
    }
  }

  /**
   * 为了避免多次push这种操作多次触发更新
   * @param {Object} watcher 渲染wathcer
   */
  var queue = [];
  var has = {};
  function queueWatcher(watcher) {
    var id = watcher.id;

    if (has[id] == null) {
      has[id] = true;
      queue.push(watcher); // vue里面的Vue.nextTick = promise / mutationObserver / setImmediate / setTimeout  优雅降级处理

      nextTick(flushSchedularQueue);
    }
  }

  function flushSchedularQueue() {
    queue.forEach(function (watcher) {
      return watcher.run();
    });
    queue = [];
    has = {};
  }

  var id$1 = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, callback, options) {
      _classCallCheck(this, Watcher);

      this.vm = vm;
      this.callback = callback;
      this.options = options;
      this.id = id$1++;
      this.depsId = new Set();
      this.deps = [];
      this.getter = exprOrFn; // 将内部传过来的回调函数 放到getter上

      this.get();
    }

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        pushTarget(this); // 把watcher存起来 Dep.target

        this.getter(); // 渲染watcher执行

        popTarget(); // 移除watcher
      }
    }, {
      key: "update",
      value: function update() {
        console.log(this.id);
        queueWatcher(this); // this.get()
      } // watcher里不能放重复的dep，dep里面不能放重复的watcher

    }, {
      key: "addDep",
      value: function addDep(dep) {
        var id = dep.id;

        if (!this.depsId.has(id)) {
          this.depsId.add(id);
          this.deps.push(dep);
          dep.addSub(this);
        }
      }
    }, {
      key: "run",
      value: function run() {
        this.get();
      }
    }]);

    return Watcher;
  }();

  function patch(oldVnode, newVnode) {
    // 递归创建真实节点 替换掉老的节点
    // 1. 判断是更新还是要渲染
    var isRealElement = oldVnode.nodeType;

    if (isRealElement) {
      // 真实元素
      var oldElm = oldVnode; // div id="app"

      var parentElm = oldElm.parentNode; // body

      var el = createElm(newVnode);
      parentElm.insertBefore(el, oldElm.nextSibling);
      parentElm.removeChild(oldElm);
      return el;
    } else {
      // dom diff  同层比较 O(n)  不需要跨级比较
      // 两棵树 要先比较树根是否一样，再比较儿子是否一样
      // 标签名不一致， 说明两个不一样的节点
      if (oldVnode.tag !== newVnode.tag) {
        oldVnode.el.parentNode.replaceChild(createElm(newVnode), oldVnode.el);
      } // 标签一致且文本


      if (!oldVnode.tag) {
        if (oldVnode.text !== newVnode.text) {
          oldVnode.el.textContent = newVnode.text;
        }
      } // 标签一致且都是标签
      // 需要复用老的节点，替换掉老的属性


      var _el = newVnode.el = oldVnode.el; // 对比更新属性


      updateProperties(newVnode, oldVnode.data); // 对比更新孩子
      // 1. 老的有孩子，新的没孩子，直接删除
      // 2. 老的没孩子，新的有孩子，直接插入
      // 3. 都有孩子

      var oldChildren = oldVnode.children || [];
      var newChildren = newVnode.children || [];

      if (oldChildren.length > 0 && newChildren.length > 0) {
        // diff 核心 两个都有孩子 通过比较老孩子和新孩子 去操作el中的孩子
        updateChildren(_el, oldChildren, newChildren);
      } else if (oldChildren.length > 0) {
        _el.innerHTML = '';
      } else if (newChildren.length > 0) {
        for (var i = 0; i < newChildren.length; i++) {
          var child = newChildren[i];

          _el.appendChild(createElm(child));
        }
      }

      return _el;
    }
  }

  function isSameVnode(oldVnode, newVnode) {
    return oldVnode.key === newVnode.key && oldVnode.tag === newVnode.tag;
  }

  function updateChildren(parent, oldChildren, newChildren) {
    // vue2.0 使用双指针的方式对比
    // v-for 要有key key可以标识元素是否发生变化 前后key相同则可以复用这个元素
    var oldStartIndex = 0; // 老的开始索引

    var oldStartVnode = oldChildren[0]; // 老的开始标签

    var oldEndIndex = oldChildren.length - 1; // 老的结尾索引

    var oldEndVnode = oldChildren[oldEndIndex]; // 老的结尾标签

    var newStartIndex = 0; // 新的开始索引

    var newStartVnode = newChildren[0]; // 新的开始标签

    var newEndIndex = newChildren.length - 1; // 新的结尾索引

    var newEndVnode = newChildren[newEndIndex]; // 新的结尾标签

    function makeIndexByKey(children) {
      var map = {};
      children.forEach(function (item, index) {
        map[item.key] = index;
      });
      return map;
    }

    var map = makeIndexByKey(oldChildren);

    while (oldStartIndex <= oldEndIndex && newStartIndex <= newEndIndex) {
      if (!oldStartVnode) {
        oldStartVnode = oldChildren[++oldEndIndex];
      } else if (!oldEndVnode) {
        oldEndVnode = oldChildren[--oldEndIndex]; // 方案一： 先开始从头部进行比较。判断两个虚拟节点书否一致，用key和type判断
      } else if (isSameVnode(oldStartVnode, newStartVnode)) {
        // 标签和key一致，但是属性可能不一致
        patch(oldStartVnode, newStartVnode);
        oldStartVnode = oldChildren[++oldStartIndex];
        newStartVnode = newChildren[++newStartIndex]; // 方案二：如果头部不一致，开始尾部比较，优化向前插入
      } else if (isSameVnode(oldEndVnode, newEndVnode)) {
        patch(oldEndVnode, newEndVnode);
        oldEndVnode = oldChildren[--oldEndIndex];
        newEndVnode = newChildren[--newEndIndex]; // 方案三 头不一样 尾不一样 将头移到尾 新节点的头是老节点的尾
      } else if (isSameVnode(oldStartVnode, newEndVnode)) {
        patch(oldStartVnode, newEndVnode);
        parent.insertBefore(oldStartVnode.el, oldEndVnode.el.nextSibling); // 具备移动性

        oldStartVnode = oldChildren[++oldStartIndex];
        newEndVnode = newChildren[--newEndIndex]; // 方案四 头不一样 尾不一样 头移尾 老节点的头是新节点的头
      } else if (isSameVnode(oldEndVnode, newStartVnode)) {
        patch(oldEndVnode, newStartVnode);
        parent.insertBefore(oldEndVnode.el, oldStartVnode.el); // 具备移动性

        oldEndVnode = oldChildren[--oldEndIndex];
        newStartVnode = newChildren[++newStartIndex];
      } else {
        // 最终方案：乱序对比
        var moveIndex = map[newStartVnode.key]; // 新元素的情况

        if (moveIndex == undefined) {
          parent.insertBefore(createElm(newStartVnode), oldStartVnode.el);
        } else {
          var moveNode = oldChildren[moveIndex];
          oldChildren[moveIndex] = null; // 占位 删除的话会导致数组塌陷
          // 找到的话插入到老节点的最前面

          parent.insertBefore(moveNode.el, oldStartVnode.el);
          patch(moveNode, newStartVnode);
        }

        newStartVnode = newChildren[++newStartIndex];
      }
    } // 说明老的已经循环完了，剩下的新的应该追加


    if (newStartIndex <= newEndIndex) {
      var ele = newChildren[newEndIndex + 1] == null ? null : newChildren[newEndIndex + 1].el;

      for (var i = newStartIndex; i <= newEndIndex; i++) {
        // parent.appendChild(createElm(newChildren[i]));
        parent.insertBefore(createElm(newChildren[i]), ele);
      }
    } // 此时新的已经循环完了，剩下的老的是应该删除的。


    if (oldStartIndex <= oldEndIndex) {
      for (var _i = oldStartIndex; _i <= oldEndIndex; _i++) {
        var child = oldChildren[_i];

        if (child != null) {
          parent.removeChild(child.el);
        }
      }
    }
  }
  /**
   * 创建节点
   * @param {Object} vnode 节点
   * @returns {type} 真实dom
   */


  function createElm(vnode) {
    var tag = vnode.tag,
        children = vnode.children,
        text = vnode.text,
        data = vnode.data,
        key = vnode.key; // 如果tag是string的话 那么当前的这个节点则是元素节点 否则为文本节点

    if (typeof tag == "string") {
      // 创建元素 将虚拟节点和真实节点做一个映射关系 （后面diff时如果元素相同则可以直接复用老元素）
      vnode.el = document.createElement(tag);
      updateProperties(vnode); // 递归调用当前函数 添加子节点

      if (children.length > 0) {
        children.forEach(function (child) {
          vnode.el.append(createElm(child));
        });
      }
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }
  /**
   * 更新属性
   * @param {Object} vnode 节点
   * @param {Object} oldProps 老节点的属性
   */

  function updateProperties(vnode) {
    var oldProps = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var el = vnode.el;
    var newProps = vnode.data || {}; // 需要比对vnode.data 和 oldProps 的差异

    var oldStyle = oldProps.style || {};
    var newStyle = newProps.style || {}; // 新老节点的样式对比，新节点的没有的样式，需要删掉

    for (var key in oldStyle) {
      if (!newStyle[key]) {
        el.style[key] = '';
      }
    } // 新老节点的属性对比，新节点的没有的属性，需要删掉


    for (var _key in oldProps) {
      if (!newProps[_key]) {
        el.removeAttribute(_key);
      }
    } // 其他情况直接用新的覆盖掉老的就行


    for (var _key2 in newProps) {
      if (_key2 === 'style') {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (_key2 === 'class') {
        el.className = newProps["class"];
      } else {
        el.setAttribute(_key2, newProps[_key2]);
      }
    }
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      vm.$el = patch(vm.$el, vnode);
    };
  }
  function mountComponent(vm, el) {
    // render
    var options = vm.$options; // 真实的dom元素$el 替换el

    vm.$el = el; // 挂载之前

    callHook(vm, 'beforeMount'); // 渲染和更新页面方法

    var updateComponent = function updateComponent() {
      // vm._render() 通过解析好的render方法，返回虚拟dom； vm._update() 通过虚拟dom，返回真实dom
      vm._update(vm._render());
    }; // 渲染watcher 每个组件都有一个渲染watcher


    new Watcher(vm, updateComponent, function () {}, true); // true 表示是一个渲染watcher
    // 渲染之后

    callHook(vm, 'mounted');
  }
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];

    if (handlers) {
      for (var i = 0; i < handlers.length; i++) {
        handlers[i].call(vm);
      }
    }
  }

  function initMixin(Vue) {
    // 给vue的原型上添加一个init方法
    Vue.prototype._init = function (options) {
      // vue的内部 $options 就是用户传递的所有参数
      var vm = this; // 将用户传递的和全局的进行一个合并

      vm.$options = mergeOptions(vm.constructor.options, options);
      console.log(vm.$options); // 生命周期:'beforeCreate'

      callHook(vm, "beforeCreate"); // 初始化状态

      initState(vm); // 生命周期:'created'

      callHook(vm, "created"); // 模板渲染

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
      } // 渲染当前的组件 挂载这个组件


      mountComponent(vm, el);
    }; // 用户调用的nextTick


    Vue.prototype.$nextTick = nextTick;
  }

  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var key = data.key;

    if (key) {
      delete data.key;
    }

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vnode(tag, data, key, children, undefined);
  }
  function createTextNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }

  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  } // 1. 将template转换成ast语法树，
  // 2. 生成render方法
  // 3. 生成虚拟dom
  // 4. 生成真实dom

  function renderMixin(Vue) {
    //  _c 创建元素的虚拟节点
    // _v 创建文本的虚拟节点
    // _s JSON.stringify
    Vue.prototype._c = function () {
      return createElement.apply(void 0, arguments);
    };

    Vue.prototype._v = function (text) {
      return createTextNode(text);
    };

    Vue.prototype._s = function (val) {
      return val == null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(vm);
      console.log("虚拟dom:", vnode);
      return vnode;
    };
  }

  function initGlobalAPI(Vue) {
    // 整合了全局相关的内容
    Vue.options = {};

    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
    };
  }

  function Vue(options) {
    this._init(options);
  } // 通过引入的方式，给vue原型上添加方法


  initMixin(Vue); // 增添初始化方法

  renderMixin(Vue); // 增添渲染方法，调用我们的render方法

  lifecycleMixin(Vue); // 增添update方法，将虚拟dom渲染成真实dom

  initGlobalAPI(Vue); // 初始化全局的API
  var vm1 = new Vue({
    data: {
      name: 'zengkaiz'
    }
  });
  var vm2 = new Vue({
    data: {
      name: "zack"
    }
  });
  var render1 = compileToFunctions("<div id=\"a\" c=\"a\" style=\"background: red;color: white\">\n    <li key=\"A\">A</li>\n    <li key=\"B\">B</li>\n    <li key=\"C\">C</li>\n    <li key=\"D\">D</li>\n  </div>");
  var oldVNode = render1.call(vm1);
  console.log('虚拟dom', oldVNode);
  var realElement = createElm(oldVNode);
  document.body.appendChild(realElement);
  var render2 = compileToFunctions("<ul>\n        <li key=\"D\">D</li>\n        <li key=\"B\">B</li>\n        <li key=\"C\">C</li>\n        <li key=\"A\">A</li>\n    </ul>");
  var newVNode = render2.call(vm2); // 没有虚拟dom和diff算法时， 都是直接重新渲染，强制重新更新页面（没有复用老的节点）

  setTimeout(function () {
    patch(oldVNode, newVNode); // 虚拟节点之间的比对
  }, 1000);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
