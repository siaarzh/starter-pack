export default (flag, renderer = () => null) => {
  if (flag) {
    return renderer();
  }
  return null;
};
