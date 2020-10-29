let callbacks = []
let waiting = false
function flushCallBack() {
    callbacks.forEach((cb) => cb());
    waiting = false;
}
export function nextTick(cb) {
    callbacks.push(cb)
    if (!waiting) {
        setTimeout(() => {
            flushCallBack()
        }, 0);
        waiting = true;
    }
    
}