export default (() => {
  let timer = 0;
  return (callback: Function, ms: number) => {
    clearTimeout(timer);
    timer = setTimeout(callback, ms);
  };
})();
