import { patchModifier } from '../index.js';

describe('patchModifier()', () => {
  describe('types', () => {
    test('valid "string" modifier', () => {
      expect(patchModifier('foobar', { __type: 'string' })).toEqual('foobar');
      expect(patchModifier('foobar', { __type: '*' })).toEqual('foobar');
    });
    test('valid "number" modifier', () => {
      expect(patchModifier(1, { __type: 'number' })).toEqual(1);
      expect(patchModifier(1, { __type: '*' })).toEqual(1);
    });
    test('valid "null" modifier', () => {
      expect(patchModifier(null, { __type: 'null' })).toEqual(null);
      expect(patchModifier(null, { __type: 'string', __nullable: true })).toEqual(null);
      expect(patchModifier(null, { __type: '*' })).toEqual(null);
    });
    test('valid "array" modifier', () => {
      expect(patchModifier([], { __type: 'array' })).toEqual([]);
      expect(patchModifier([], { __type: '*' })).toEqual([]);
    });
    test('valid "boolean" modifier', () => {
      expect(patchModifier(true, { __type: 'boolean' })).toEqual(true);
      expect(patchModifier(true, { __type: '*' })).toEqual(true);
    });
    test('valid "object" modifier', () => {
      expect(patchModifier({ foo: 'bar' }, { __type: 'object', __value: { foo: { __type: 'string' } } })).toEqual({
        foo: 'bar',
      });
      expect(patchModifier({ foo: 'bar' }, { __type: '*' })).toEqual({ foo: 'bar' });
      expect(
        patchModifier(
          { a: { b: 'c' } },
          { __type: 'object', __value: { a: { __type: 'object', __value: { b: { __type: 'string' } } } } }
        )
      ).toEqual({ a: { b: 'c' } });
      expect(() => {
        patchModifier({ a: 'b' }, { __type: 'object', __value: { c: { __type: 'string' } } });
      }).toThrow();
      expect(patchModifier({ a: 'b' }, { __type: 'object', __value: { '*': { __type: 'string' } } })).toEqual({
        a: 'b',
      });
      expect(
        patchModifier(
          { a: 'b', c: 1 },
          { __type: 'object', __value: { '*': { __type: 'string' }, c: { __type: 'number' } } }
        )
      ).toEqual({ a: 'b', c: 1 });
    });
  });
  test('returns default value for "undefined" modifier', () => {
    expect(patchModifier(undefined, { __value: 'anything' })).toEqual('anything');
    expect(patchModifier({}, { __type: 'object', __value: { foo: { __type: 'string', __value: 'bar' } } })).toEqual({
      foo: 'bar',
    });
    expect(
      patchModifier(undefined, { __type: 'object', __value: { foo: { __type: 'string', __value: 'bar' } } })
    ).toEqual({
      foo: 'bar',
    });
  });
  test('modifying array item', () => {
    expect(patchModifier({ 1: 'foobar' }, { __type: 'array', __item: { __type: 'string' } })).toEqual({ 1: 'foobar' });
    expect(
      patchModifier(
        { a: { 1: { b: 'c' } } },
        {
          __type: 'object',
          __value: { a: { __type: 'array', __item: { __type: 'object', __value: { b: { __type: 'string' } } } } },
        }
      )
    ).toEqual({ a: { 1: { b: 'c' } } });
    // extend with default values
    expect(
      patchModifier(
        { 1: { foo: 'bar' } },
        {
          __type: 'array',
          __item: {
            __type: 'object',
            __value: { foo: { __type: 'string' }, extension: { __type: 'string', __value: 'default extension' } },
          },
        }
      )
    ).toEqual({ 1: { foo: 'bar', extension: 'default extension' } });
  });
  test('checks array items defintion', () => {
    expect(() => patchModifier([{}], { __type: 'array', __item: { __type: 'string' } })).toThrow();
  });
});
