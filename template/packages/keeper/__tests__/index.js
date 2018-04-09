describe('keeper', () => {
  test('true singleton', () => {
    const Plumbus1 = require('../index.js').default;
    const Plumbus2 = require('../INDEX.js').default;

    Plumbus1.set('foo', 'bar');
    expect(Plumbus2.get('foo')).toEqual('bar');
  });
});
