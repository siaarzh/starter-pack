import { isEqual } from '../index.js';

const values = ['string', 1, false, {}, null, () => {}, undefined, []];

describe('isEqual()', () => {
  test('types do not match', () => {
    for (const [idxA, valA] of values.entries()) {
      for (const [idxB, valB] of values.entries()) {
        if (idxA === idxB) {
          expect(isEqual(valA, valB)).toEqual(true);
        } else {
          expect(isEqual(valA, valB)).toEqual(false);
        }
      }
    }
  });
  test('comparing objects', () => {
    const a = {
      foo: 'bar',
    };
    const b = {
      foo: 'bar',
    };
    expect(isEqual(a, b)).toEqual(true);
  });
  test('comparing arrays', () => {
    expect(isEqual(['foobar'], ['foobar'])).toEqual(true);
    expect(isEqual([{ foo: 'bar' }], [{ foo: 'bar' }])).toEqual(true);
  });
  test('comparing nested objects and arrays', () => {
    const a = {
      string: 'string',
      number: 1,
      boolean: false,
      object: {
        string: 'string',
        number: 2,
      },
      null: null,
      array: [[{ foo: 'bar' }]],
      actions: {
        a: () => {},
        b: () => {},
      },
    };
    const b = {
      string: 'string',
      number: 1,
      boolean: false,
      object: {
        string: 'string',
        number: 2,
      },
      null: null,
      array: [[{ foo: 'bar' }]],
      actions: {
        a: () => {},
        b: () => {},
      },
    };
    expect(isEqual(a, b)).toEqual(true);
  });
});
