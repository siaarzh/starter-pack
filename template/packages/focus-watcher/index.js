const TAB = 9;

class FocusWatcher {
  constructor(className = 'with-focus-ring') {
    this.className = className;
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    window.addEventListener('keydown', this.onKeyDown);
  }
  onKeyDown(evt) {
    if (evt.keyCode === TAB) {
      // add something to classList
      document.body.classList.add(this.className);

      window.removeEventListener('keydown', this.onKeyDown);
      window.addEventListener('mousedown', this.onMouseDown);
    }
  }
  onMouseDown() {
    document.body.classList.remove(this.className);

    window.removeEventListener('mousedown', this.onMouseDown);
    window.addEventListener('keydown', this.onKeyDown);
  }
}

const instanceId = Symbol.for('focus-watcher');

const globalSymbols = Object.getOwnPropertySymbols(global);
const hasInstance = globalSymbols.indexOf(instanceId) > -1;
if (!hasInstance) {
  global[instanceId] = new FocusWatcher();
}

export default global[instanceId];
