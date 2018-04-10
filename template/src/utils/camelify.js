import camelCase from 'lodash/camelCase';
import { isObject } from 'object-state-storage';

const camelify = obj => {
  if (isObject(obj)) {
    const keys = Object.keys(obj);
    return keys.reduce((accum, key) => {
      accum[camelCase(key)] = camelify(obj[key]);
      return accum;
    }, {});
  } else if (Array.isArray(obj)) {
    return obj.map(arrayItem => camelify(arrayItem));
  } else {
    return obj;
  }
};

export default camelify;
