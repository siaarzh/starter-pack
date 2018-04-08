const instanceId = Symbol.for('keeper');

export class Keeper {
  constructor() {
    this._data = {};
  }
  set(key, value) {
    this._data[key] = value;
  }
  get(key) {
    return this._data[key];
  }
}

const globalSymbols = Object.getOwnPropertySymbols(global);
const hasInstance = globalSymbols.indexOf(instanceId) > -1;
if (!hasInstance) {
  global[instanceId] = new Keeper();
}

export default global[instanceId];
