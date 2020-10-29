let id = 0
class Dep {
    constructor() {
        this.id = id++
        this.subs = []
    }
    addSub(watcher) {
        this.subs.push(watcher);
    }
    // 观察者模式--依赖收集
    depend() {
      // 让watcher 记住我当前的dep，如果watcher没存过dep，那么dep肯定也没存过watcher
      Dep.target.addDep(this);
      // this.subs.push(Dep.target)
    }
    notify() {
        this.subs.forEach((watcher) => watcher.update());
    }
}

export default Dep


let stack = []
export function pushTarget(watcher) {
    Dep.target = watcher;
    stack.push(watcher);
}

export function popTarget() {
    stack.pop()
    Dep.target = stack[stack.length - 1]
}