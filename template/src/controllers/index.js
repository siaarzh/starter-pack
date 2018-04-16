import ErrorController from 'controllers/ErrorController';

export default {
  ErrorController: () => {
    return Promise.resolve({ default: ErrorController });
  },
};
