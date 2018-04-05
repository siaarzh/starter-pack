import ObjectStateModel from '../index.js';
import { merge } from 'object-state-storage';

describe('object-state-model', () => {
  test('skips default values for keys that already exist in state', () => {
    const model = new ObjectStateModel({
      __type: 'object',
      __value: {
        a: {
          __type: 'string',
          __value: 'a',
        },
        b: {
          __type: 'string',
          __value: 'b',
        },
      },
    });
    expect(model.patchFor({ a: 'foobar' }, {})).toEqual({ b: 'b' });
    expect(model.patchFor({}, { a: 'b' })).toEqual({ a: 'b', b: 'b' });
  });
  test('array element assignment', () => {
    const model = new ObjectStateModel({
      __type: 'object',
      __value: {
        array: {
          __type: 'array',
          __item: {
            __type: 'object',
            __value: {
              a: {
                __type: 'string',
                __value: 'default value',
              },
            },
          },
          __value: [],
        },
      },
    });
    expect(model.patchFor({}, {})).toEqual({ array: [] });
    expect(() => model.patchFor({}, { array: ['some value'] })).toThrow();
    expect(model.patchFor({}, { array: [{}] })).toEqual({ array: [{ a: 'default value' }] });
    expect(() => model.patchFor({}, { array: { 0: 'some value' } })).toThrow();
    expect(model.patchFor({}, { array: { 0: {} } })).toEqual({ array: { 0: { a: 'default value' } } });
    expect(model.patchFor({ array: [] }, { array: { 0: {} } })).toEqual({ array: { 0: { a: 'default value' } } });
    expect(merge({ array: [] }, model.patchFor({}, { array: { 0: {} } }))).toEqual({ array: [{ a: 'default value' }] });
  });
  test('array of arrays', () => {
    const model = new ObjectStateModel({
      __type: 'object',
      __value: {
        nestedArray: {
          __type: 'array',
          __item: {
            __type: 'array',
            __item: {
              __type: 'object',
              __value: {
                foo: {
                  __type: 'string',
                  __value: 'bar',
                },
              },
            },
          },
        },
      },
    });
    expect(model.patchFor({}, { nestedArray: { 0: { 0: {} } } })).toEqual({
      nestedArray: { 0: { 0: { foo: 'bar' } } },
    });
    expect(
      merge({ nestedArray: [[]] }, model.patchFor({ nestedArray: [[]] }, { nestedArray: { 0: { 0: {} } } }))
    ).toEqual({
      nestedArray: [[{ foo: 'bar' }]],
    });
  });
});
