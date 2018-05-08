import { CancelablePromise, defer } from '../index.js';

describe('promise utils', () => {
  test('CancelablePromise', () => {
    expect.assertions(2);
    const examplePromise = new CancelablePromise(resolve => {
      window.setTimeout(() => {
        resolve();
      }, 100);
    });
    examplePromise.then(() => {}).catch(err => {
      expect(examplePromise.isCanceled).toEqual(true);
      expect(err.toString()).equalTo('Promise was canceled');
    });
    examplePromise.cancel();
    expect(examplePromise.isCanceled).toEqual(true);
  });
  test('defer', () => {
    expect.assertions(2);
    const fn = jest.fn();
    const pendingFn = defer(fn);
    pendingFn.finally(() => {
      expect(fn).not.toBeCalled();
      expect(pendingFn.isCanceled).toBe(true);
    });
    pendingFn.cancel();
  });
});
