export default cookieString => {
  return cookieString
    .split('; ')
    .filter(item => {
      return item.length > 0;
    })
    .reduce((result, item) => {
      const cookieItem = item.split('=');
      const nextResult = result;
      nextResult[cookieItem[0]] = cookieItem[1];
      return nextResult;
    }, {});
};
