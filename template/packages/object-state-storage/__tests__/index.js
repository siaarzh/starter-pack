import ObjectStateStorage from '../index.js';

describe('object-state-storage', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });
  test('onChange handler notifies if execution takes too long', () => {
    const warnMock = jest.spyOn(global.console, 'warn');
    const store = new ObjectStateStorage();
    store.subscribe(function () {
      let start = Date.now();
      let now = start;
      while (now - start < 20) {
        now = Date.now();
      }
    });
    store.setState(() => ({}));
    expect(warnMock).toBeCalled();
  });
  test('async onChange handler doesn\'t cause warning to be displayed', () => {
    expect.assertions(1);
    const warnMock = jest.spyOn(global.console, 'warn');
    const store = new ObjectStateStorage();
    store.subscribe(function () {
      let start = Date.now();
      let now = start;
      while (now - start < 20) {
        now = Date.now();
      }
      Promise.resolve().then(() => {
        expect(warnMock).not.toBeCalled();
      });
    }, true);
    store.setState(() => ({}));
  });
});
