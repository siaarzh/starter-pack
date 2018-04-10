import camelify from '../camelify';

describe('camelify', () => {
  it('recursively converts objects to camelcase', () => {
    const eg = {
      a_a: {
        b_b: [{ c_c: { d_d: 'd_d' } }],
      },
    };
    expect(camelify(eg)).toEqual({ aA: { bB: [{ cC: { dD: 'd_d' } }] } });
  });
});
