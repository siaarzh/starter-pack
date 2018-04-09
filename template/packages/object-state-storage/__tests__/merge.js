import { merge } from '../index';

describe('merge', () => {
  test('does not mutate arguments', () => {
    const mutable = { foo: 'bar' };
    const target = { test: mutable };
    const result = merge(target, { test: { foo: 'foo' } });
    expect(target).toEqual({ test: { foo: 'bar' } });
    expect(mutable).toEqual({ foo: 'bar' });
    expect(result).toEqual({ test: { foo: 'foo' } });
  });

  test('assigning empty object keeps target value unchanged', () => {
    const a = { a: { b: 'c' } };
    const b = { a: {} };
    expect(merge(a, b)).toEqual({ a: { b: 'c' } });
  });

  test('keeps unmodified values', () => {
    const a = { a: { b: 'c', d: 'e' } };
    const b = { a: { f: 'g' } };
    expect(merge(a, b)).toEqual({ a: { b: 'c', d: 'e', f: 'g' } });
  });

  test('merge example 1', () => {
    const result = merge({ a: 'b' }, { a: 'c' });
    expect(result).toEqual({ a: 'c' });
  });

  test('merge example 2', () => {
    const result = merge({ a: 'b' }, { b: 'c' });
    expect(result).toEqual({ a: 'b', b: 'c' });
  });

  test('merge example 3', () => {
    const result = merge({ a: { b: 'c' }, e: 'f' }, { a: { b: 'd' } });
    expect(result).toEqual({ a: { b: 'd' }, e: 'f' });
  });

  test('merge example 4', () => {
    const result = merge({ a: [1, 2] }, { a: [3, 4] });
    expect(result).toEqual({ a: [3, 4] });
  });

  test('merge example 5', () => {
    const result = merge({ a: { b: 'c' }, d: 'e', j: 'k' }, { a: { b: { n: 'o' } }, d: 'g', l: 'm' });
    expect(result).toEqual({ a: { b: { n: 'o' } }, d: 'g', j: 'k', l: 'm' });
  });

  test('merge example 6', () => {
    const result = merge({ a: ['b', 'c', 'd'] }, { a: { 0: 'foobar' } });
    expect(result).toEqual({ a: ['foobar', 'c', 'd'] });
  });

  test('merge example 7', () => {
    const result = merge({ a: ['b', 'c', 'd'] }, { a: { 5: 'foobar' } });
    expect(result).toEqual({ a: ['b', 'c', 'd', undefined, undefined, 'foobar'] });
  });

  test('merge example 8', () => {
    const result = merge({ a: [{ b: { c: ['d', 'e'] } }], f: 'f' }, { a: { 0: { b: { c: { 1: 'foobar' } } } }, f: {} });
    expect(result).toEqual({ a: [{ b: { c: ['d', 'foobar'] } }], f: {} });
  });
});
