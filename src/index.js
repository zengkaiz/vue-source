import { initMixin } from './init'
import { lifecycleMixin } from "./lifecycle"
import { renderMixin } from "./render"
import { initGlobalAPI } from "./initGlobalAPI/index";

function Vue(options) {
    this._init(options)
}
// 通过引入的方式，给vue原型上添加方法

initMixin(Vue)  // 增添初始化方法
renderMixin(Vue)    // 增添渲染方法，调用我们的render方法
lifecycleMixin(Vue)     // 增添update方法，将虚拟dom渲染成真实dom

// 初始化全局的API
initGlobalAPI(Vue)


// ------------------------------ diff ---------------------------------
// diff: 比较两个树的差异（虚拟dom）把前后的dom节点渲染成虚拟dom，通过虚拟节点比对，找到差异，更新真实dom

import { compileToFunctions } from './compiler/index'
import { createElm, patch } from './vdom/patch'

let vm1 = new Vue({ data: { name: 'zengkaiz' } })
let vm2 = new Vue({ data: { name: "zack" } })

let render1 = compileToFunctions(
    `<ul>
        <li key="A">A</li>
        <li key="B">B</li>
        <li key="C">C</li>
        <li key="D">D</li>
    </ul>`
);
let oldVNode = render1.call(vm1)
let relElement = createElm(oldVNode)
document.body.appendChild(relElement)

let render2 = compileToFunctions(
  `<ul>
        <li key="C">C</li>
        <li key="D">D</li>
        <li key="E">E</li>
        <li key="M">M</li>
    </ul>`
);
let newVNode = render2.call(vm2);
// 没有虚拟dom和diff算法时， 都是直接重新渲染，强制重新更新页面（没有复用老的节点）
setTimeout(() => {
    patch(oldVNode, newVNode); // 虚拟节点之间的比对
}, 1000)












export default Vue