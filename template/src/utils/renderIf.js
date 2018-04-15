export default (flag, renderer = () => null) => {
  if (flag) {
    if (typeof renderer === 'function') {
      return renderer();
    }
    return renderer;
  }
  return null;
};
