**routing-service** is a very simple router. Just add routes and callbacks.

This is a es6 module. No compiled version is provided. Install via `npm install routing-service` or `yarn add routing-service`.

## How to use

E.g. in combination with `session-controller` module

```javascript
import { Session } from 'session-controller';
import routingService from 'routing-service';

// a list of controller imports
import controllers from './controllers';

window.session = new Session(window.document.getElementById('mount-point'), controllers);

routingService
  .add('home', '/', ({ query }) => {
    // do something with query parameters
    // maybe fetch some data
    // assume payload is the result of that operations
    // ...
    window.session.mountController('HomeController', payload);
  })
  .add('resource', '/resource/:resourceId', ({ params }) => {
    // params will look like { resourceId: ... } for matching route
    // ...
    window.session.mountController('ResourceController', payload);
  })
  .add('404', '/404', () => {
    window.session.mountController('NotFoundController', {});
  });

// match first route
routingService.onLocationChange(window.location);
```
