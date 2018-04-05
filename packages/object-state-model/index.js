import get from 'lodash.get';
import { getJsonType } from 'object-state-storage';

export function patchModifier(modifier, definition, route = [], shouldApplyDefaultValues = () => true) {
  // definition: { __type, __value, __nullable, __item }
  const modifierType = modifier === undefined ? 'undefined' : getJsonType(modifier);
  const definitionValue = definition.__value;
  const definitionType = definition.__type;
  const definitionIsNullable = definition.__nullable;
  const definitionItem = definition.__item;

  if (modifierType === 'undefined') {
    if (shouldApplyDefaultValues(route)) {
      if (definitionType === 'object') {
        return patchModifier({}, definition, route, shouldApplyDefaultValues);
      } else {
        return definitionValue;
      }
    }
  } else if (modifierType === definitionType) {
    if (definitionType === 'object') {
      const accum = {};
      // modifierKeys
      const modifierKeys = new Set(Object.keys(modifier));
      // run through definitionValue keys
      for (const definitionKey of Object.keys(definitionValue)) {
        if (definitionKey !== '*') {
          accum[definitionKey] = patchModifier(
            modifier[definitionKey],
            definitionValue[definitionKey],
            [...route, definitionKey],
            shouldApplyDefaultValues
          );
          modifierKeys.delete(definitionKey);
        }
      }
      if (definitionValue['*'] !== undefined) {
        const modifierKeysCopy = new Set(modifierKeys);
        for (const modifierKey of modifierKeysCopy) {
          accum[modifierKey] = patchModifier(
            modifier[modifierKey],
            definitionValue['*'],
            [...route, modifierKey],
            shouldApplyDefaultValues
          );
          modifierKeys.delete(modifierKey);
        }
      }
      if (modifierKeys.size > 0) {
        throw new Error(`No definition for "${route.join('.')}[${modifierKeys.join(', ')}]"`);
      }
      return accum;
    }
    // just return modifier
    return modifier;
  } else {
    // types do not match
    // check if modifier allows this
    // otherwise throw an error
    if ((modifierType === 'null' && definitionIsNullable === true) || definitionType === '*') {
      return modifier;
    } else if (modifierType === 'object' && definitionType === 'array' && definitionItem !== undefined) {
      const modifierKeys = new Set(Object.keys(modifier));
      const accum = {};
      for (const modifierKey of modifierKeys) {
        accum[modifierKey] = patchModifier(
          modifier[modifierKey],
          definitionItem,
          [...route, modifierKey],
          shouldApplyDefaultValues
        );
      }
      return accum;
    }
    throw new Error(`Types do not match at "${route.join('.')}" (${modifierType} - ${definitionType})`);
  }
}

export function validateDefinition() {}

export default class ObjectStateModel {
  constructor(definition) {
    this._definition = definition;
  }
  patchFor(state = {}, modifier = {}) {
    function shouldApplyDefaultValues(route) {
      return !(state && get(state, route) !== undefined);
    }
    return patchModifier(modifier, this._definition, [], shouldApplyDefaultValues);
  }
}
