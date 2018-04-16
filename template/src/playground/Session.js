import { Consumer } from 'components-di';
import { LinkTo } from 'components/Link';
import { setModal, viewPropsModel } from 'components/View';
import { compose } from 'json-model';
import React from 'react';
import Router from 'router';
import { Controller, Session } from 'session-controller';

let controllers = {};

export function createController(name, view, initialState = {}, actions = {}) {
  return class Kontroller extends Controller {
    get name() {
      return name;
    }
    controllerWillMount() {
      this.context.controller.model = compose(this.context.controller.model, viewPropsModel);
      this.context.controller.setModal = setModal.bind(null, this.context);
      this.context.controller.replaceState(() => initialState);
      this.actions = actions;
      this.view = view;
    }
    controllerWillUnmount() {}
  };
}

export function addComponent(name, view, initialState = {}, actions = {}) {
  controllers[name] = () => Promise.resolve({ default: createController(name, view, initialState, actions) });
}

export function Playground({ components }) {
  return (
    <div className="box-l">
      <h1 className="m-bottom-l ff-mono regular">{'> PL4YGR0UND 👾'}</h1>
      <ul>
        {components.map(componentName => {
          return (
            <li key={componentName}>
              <LinkTo page="playground-component" data={{ props: { name: componentName } }}>
                {componentName}
              </LinkTo>
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
    { components: Object.keys(controllers) }
  );

  window.session = new Session(document.getElementById('mount-point'), controllers);
  window.session.context.urlFor = router.urlFor.bind(router);
  window.session.context.historyPushPage = router.historyPushPage.bind(router);
  router
    .add('playground-component', '/playground/:name', ({ props }) => {
      window.session.mountController(props.name);
    })
    .add('playground', '/playground', () => {
      window.session.mountController('playground');
    })
    .add('404', '/404', () => {
      console.log('no matching route found');
    });
  router.onLocationChange(window.location);
}
