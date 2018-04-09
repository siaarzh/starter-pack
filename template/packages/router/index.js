import createHistory from 'history/createBrowserHistory';
import { merge } from 'object-state-storage';

// returns an object, representing querystring
export function decomposeQuery(querystring) {
  return querystring
    .slice(1)
    .split('&')
    .reduce((result, item) => {
      const queryItem = item.split('=');
      const nextResult = result;
      const key = decodeURIComponent(queryItem[0]);
      const value = queryItem[1] ? decodeURIComponent(queryItem[1]) : null;
      if (key.length > 0) {
        nextResult[key] = value || key;
      }
      return nextResult;
    }, {});
}

// create a querystring from an object representation
export function composeQuery(query) {
  const keys = Object.keys(query);
  if (keys.length === 0) {
    return '';
  }
  return keys
    .reduce((accum, key) => {
      accum += `${key}=${query[key]}&`;
      return accum;
    }, '?')
    .slice(0, -1);
}

export function decomposePathname(pathname) {
  let uri = decodeURIComponent(pathname);
  if (uri[0] === '/') {
    uri = uri.substr(1);
  }
  if (uri[uri.length - 1] === '/') {
    uri = uri.slice(0, -1);
  }
  return uri.split('/');
}

// if location doesn't match route, undefined is going to be returned
export function getLocationProps(location, pattern) {
  const patternComponents = decomposePathname(pattern);
  const pathComponents = decomposePathname(location.pathname);
  // console.log(patternComponents);
  // console.log(pathComponents);
  const query = decomposeQuery(location.search);
  // test path against pattern
  if (patternComponents.length !== pathComponents.length) {
    return undefined;
  }
  let accum = { props: {}, query };
  for (const [patternComponentIdx, patternComponent] of patternComponents.entries()) {
    if (patternComponent[0] === ':') {
      accum.props[patternComponent.slice(1)] = pathComponents[patternComponentIdx];
    } else if (patternComponent !== pathComponents[patternComponentIdx]) {
      return undefined;
    }
  }
  return accum;
}

export function findRoute(location, routes) {
  for (const route of routes) {
    const data = getLocationProps(location, route.pattern);
    if (data) {
      return { ...route, data };
    }
  }
  return undefined;
}

export default class Router {
  constructor() {
    // routes have to be sorted
    this._routes = [];
    this._history = createHistory();

    this._history.listen((location, action) => {
      // action is one of [PUSH, REPLACE, POP, undefined]
      this.onLocationChange(location, action);
    });
  }
  onLocationChange(location, action) {
    const route = findRoute(location, this._routes);
    const notFoundRoute = findRoute({ pathname: '/404', search: '' }, this._routes);
    if (route) {
      route.onVisit(route.data, action);
    } else if (notFoundRoute) {
      notFoundRoute.onVisit(notFoundRoute.data, action);
    } else {
      throw new Error(`No 404 route handler found (${location.pathname})`);
    }
  }
  add(shorthand, route, onVisit = () => {}) {
    this._routes.push({
      shorthand,
      pattern: route,
      onVisit,
    });
    // chain
    return this;
  }
  urlFor(shorthand, data = { props: {}, query: {} }) {
    data = merge({ props: {}, query: {} }, data);
    const route = this._routes.find(route => {
      return route.shorthand === shorthand;
    });
    if (!route) {
      throw new Error(`No route found for ${shorthand}`);
    }
    const patternComponents = decomposePathname(route.pattern);
    const pathname = patternComponents
      .map(patternComponent => {
        if (patternComponent[0] === ':') {
          return data.props[patternComponent.slice(1)];
        }
        return patternComponent;
      })
      .join('/');
    const querystring = composeQuery(data.query);
    return `/${pathname}${querystring}`;
  }
  clear() {
    this._routes = [];
  }
  historyPush(url) {
    this._history.push(url);
  }
  historyReplace(url) {
    this._history.replace(url);
  }
  historyPushShorthand(shorthand, routeData) {
    this.historyPush(this.urlFor(shorthand, routeData));
  }
  historyReplaceShorthand(shorthand, routeData) {
    this.historyReplace(this.urlFor(shorthand, routeData));
  }
}
