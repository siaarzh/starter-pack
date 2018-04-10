export default context => {
  return {
    scrollY: context.store.state.view.scrollY,
  };
};
