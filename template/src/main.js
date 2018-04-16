import 'assets/css/global.css';

import controllers from 'controllers';
import Router from 'router';
import { Session } from 'session-controller';

const router = new Router();
global.window.session = new Session(document.getElementById('mount-point'), controllers);
global.window.session.context.urlFor = router.urlFor.bind(router);
global.window.session.context.historyPushPage = router.historyPushPage.bind(router);
router.add('404', '/404', () => {
  global.window.session.mountController('ErrorController', { error: '⚠️ 404', message: 'Page not found' });
});
router.onLocationChange(window.location);
