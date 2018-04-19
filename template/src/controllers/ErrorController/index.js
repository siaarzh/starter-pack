import { viewPropsModel } from 'components/View';
import Model, { compose } from 'json-model';
import { Controller } from 'session-controller';
import globalPropsModel from 'utils/globalPropsModel';
import RootComponent from 'views/ErrorControllerView';

const model = new Model({
  __type: 'object',
  __value: {
    error: {
      __type: 'string',
    },
    message: {
      __type: 'string',
    },
  },
});

export default class ErrorController extends Controller {
  get name() {
    return 'ErrorController';
  }
  controllerWillMount(data = {}) {
    this.context.controller.model = compose(model, viewPropsModel, globalPropsModel);
    this.context.controller.replaceState(() => data);
    this.view = RootComponent;
  }
  controllerWillUnmount() {}
}
