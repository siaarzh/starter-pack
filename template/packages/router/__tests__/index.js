jest.mock('history/createBrowserHistory', () => {
  return () => ({ listen: () => {} });
});
const Router = require('../index.js').default;

const mockData = [
  {
    pagename: 'test-1',
    pathname: '/hello/foobar',
    search: '?foo=bar',
    pattern: '/hello/:world',
    data: {
      props: {
        world: 'foobar',
      },
      query: {
        foo: 'bar',
      },
    },
  },
];

describe('Router', () => {
  test('matches locations and routes', () => {
    const router = new Router();
    for (const mockRoute of mockData) {
      router.add(mockRoute.pagename, mockRoute.pattern, data => {
        expect(data).toEqual(mockRoute.data);
      });
    }
    for (const mockRoute of mockData) {
      router.onLocationChange({ pathname: mockRoute.pathname, search: mockRoute.search });
    }
    expect(() => {
      router.onLocationChange({ pathname: 'blah-blah', search: '' });
    }).toThrow();
    const notFoundHandler = jest.fn();
    router.add('404', '/404', notFoundHandler);
    router.onLocationChange({ pathname: 'blah-blah', search: '' });
    expect(notFoundHandler).toBeCalled();
  });
  test('returns url from provided route pagename and props', () => {
    const router = new Router();
    router.add('foobar', '/:hello/:world/', () => {});
    expect(router.urlFor('foobar', { props: { hello: 'world', world: 'hello' }, query: { foo: 'bar' } })).toEqual(
      '/world/hello?foo=bar'
    );
  });
});
