import Model from 'json-model';

const instanceId = Symbol.for('globalPropsModel');

const globalSymbols = Object.getOwnPropertySymbols(global);
const hasInstance = globalSymbols.indexOf(instanceId) > -1;
if (!hasInstance) {
  global[instanceId] = new Model({
    __type: 'object',
    __value: {
      pathname: {
        __type: 'string',
        __value: '/',
      },
    },
  });
}

export default global[instanceId];
