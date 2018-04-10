import { SessionController } from 'session-controller';

const controllers = {
  ExampleController: () => import('./ExampleController'),
};

window.session = new SessionController(document.getElementById('mount-point'), controllers);

window.session.mountController('ExampleController');
window.session.mountController('ExampleController');
