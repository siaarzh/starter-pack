export class CancelablePromise {
  constructor(executor) {
    this._isCanceled = false;
    if (typeof executor !== 'function') {
      throw new Error('Executor should be a function');
    }
    this._promise = new Promise((resolve, reject) => {
      this._reject = reject;
      return executor(resolve, reject);
    });
    this.cancel = this.cancel.bind(this);
  }
  then(...args) {
    return this._promise.then(...args);
  }
  catch(...args) {
    return this._promise.catch(...args);
  }
  finally(...args) {
    return this._promise.finally(...args);
  }
  cancel() {
    if (this._isCanceled) {
      return;
    }
    this._isCanceled = true;
    this._reject(new Error('Promise was canceled'));
  }
  get isCanceled() {
    return this._isCanceled;
  }
}

export function defer(executor, ...args) {
  const p = new CancelablePromise(resolve => {
    global.setTimeout(resolve, 0);
  });
  p
    .then(() => {
      return executor(...args);
    })
    .catch(err => {
      if (p.isCanceled) {
        return;
      }
      throw err;
    });
  return p;
}
