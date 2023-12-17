const threshold = 0.95;
function isUserNearBottom() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollPosition =
    window.scrollY ||
    document.body.scrollTop +
      ((document.documentElement && document.documentElement.scrollTop) || 0);

  return scrollPosition > threshold * (documentHeight - windowHeight);
}
const loadMoreTimeout = 1000;
export { isUserNearBottom, loadMoreTimeout };
