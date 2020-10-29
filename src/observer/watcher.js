import { pushTarget, popTarget } from "./dep";
import { queueWatcher} from './schedular'
let id = 0
class Watcher {
    constructor(vm, exprOrFn, callback, options) {
        this.vm = vm
        this.callback = callback
        this.options = options
        this.id = id++
        this.depsId = new Set()
        this.deps = []
        this.getter = exprOrFn      // 将内部传过来的回调函数 放到getter上
        this.get()
    }
    get() {
        pushTarget(this)    // 把watcher存起来 Dep.target
        this.getter()       // 渲染watcher执行
        popTarget()         // 移除watcher
    }
    update() {
        console.log(this.id)
        queueWatcher(this)
        // this.get()
    }
    // watcher里不能放重复的dep，dep里面不能放重复的watcher
    addDep(dep) {
        let id = dep.id
        if (!this.depsId.has(id)) {
            this.depsId.add(id)
            this.deps.push(dep)
            dep.addSub(this)
        } else {

        }
    }
    run() {
        this.get()
    }
}

export default Watcher