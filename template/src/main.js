import 'assets/css/global.css';

import controllers from 'controllers';
import Router from 'router';
import { Session } from 'session-controller';

const sessionId = Symbol.for('session');
const routerId = Symbol.for('router');

function getInstance(instanceId, Klass, ...args) {
  const globalSymbols = Object.getOwnPropertySymbols(global);
  const hasInstance = globalSymbols.indexOf(instanceId) > -1;
  if (!hasInstance) {
    global[instanceId] = new Klass(...args);
  }
  return global[instanceId];
}

let mountPoint;
if (process.env.TARGET !== 'node') {
  mountPoint = document.getElementById('mount-point');
}
const router = getInstance(routerId, Router);
const session = getInstance(sessionId, Session, mountPoint, controllers);

session.context.urlFor = router.urlFor.bind(router);
session.context.historyPushPage = router.historyPushPage.bind(router);
router.add('404', '/404', () => {
  session.mountController('ErrorController', { pathname: '/404', error: '⚠️ 404', message: 'Page not found' });
});

if (process.env.TARGET !== 'node') {
  router.onLocationChange(global.window.location);
  // expose session
  global.window.session = session;
}

export default {
  router,
  session,
};
