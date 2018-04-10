export const setState = (context, model, modifier) => {
  if (model) {
    context.session.store.setState(state => {
      if (typeof modifier === 'function') {
        return model.set(state, modifier(state));
      }
      return model.set(state, modifier);
    });
  } else {
    context.session.store.setState(modifier);
  }
};

export const replaceState = (context, model, modifier) => {
  if (model) {
    context.session.store.replaceState(state => {
      if (typeof modifier === 'function') {
        return model.set({}, modifier(state));
      }
      return model.set({}, modifier);
    });
  } else {
    context.session.store.replaceState(modifier);
  }
};
