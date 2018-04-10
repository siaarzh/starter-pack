import { Controller, Session } from 'session-controller';

import { Consumer } from 'components-di';
import React from 'react';
import Router from 'router';

let controllers = {};

export function createController(name, view, initialState = {}, actions = {}) {
  return class Kontroller extends Controller {
    get name() {
      return name;
    }
    controllerWillMount() {
      this.context.session.store.replaceState(() => initialState);
      this.actions = actions;
      this.view = view;
    }
    controllerWillUnmount() {}
  };
}

export function addComponent(name, view, initialState = {}, actions = {}) {
  controllers[name] = () => Promise.resolve({ default: createController(name, view, initialState, actions) });
}

export function Playground({ components, actions }) {
  return (
    <div className="box-l">
      <ul>
        {components.map(componentName => {
          return (
            <li key={componentName}>
              <a
                className="link underline inline-block"
                href={actions.urlFor('component', { props: { name: componentName } })}
                onClick={evt => {
                  evt.preventDefault();
                  actions.historyPushShorthand('component', { props: { name: componentName } });
                }}>
                {componentName}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function start() {
  const router = new Router();

  addComponent(
    'playground',
    <Consumer
      mapper={({ context, actions }) => {
        return { components: context.session.store.state.components, actions };
      }}>
      <Playground />
    </Consumer>,
    { components: Object.keys(controllers) },
    {
      urlFor: (context, ...args) => {
        router.urlFor(...args);
      },
      historyPushShorthand: (context, ...args) => {
        router.historyPushShorthand(...args);
      },
    }
  );

  window.session = new Session(document.getElementById('mount-point'), controllers);
  router
    .add('component', '/playground/:name', ({ props }) => {
      window.session.mountController(props.name);
    })
    .add('index', '/playground', () => {
      window.session.mountController('playground');
    })
    .add('404', '/404', () => {
      console.log('no matching route found');
    });
  router.onLocationChange(window.location);
}
