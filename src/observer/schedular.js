/**
 * 为了避免多次push这种操作多次触发更新
 * @param {Object} watcher 渲染wathcer
 */
import { nextTick} from '../utils/next-tick'
let queue = [];
let has = {};

export function queueWatcher(watcher) {
  const id = watcher.id;
  if (has[id] == null) {
    has[id] = true;
    queue.push(watcher);
    // vue里面的Vue.nextTick = promise / mutationObserver / setImmediate / setTimeout  优雅降级处理
    nextTick(flushSchedularQueue);
    setTimeout(function () {
      
    }, 0);
  }
}


function flushSchedularQueue() {
  queue.forEach((watcher) => watcher.run());
  queue = [];
  has = {};
}
 