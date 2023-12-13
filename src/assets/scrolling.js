function isUserNearBottom() {
    const windowHeight = window.innerHeight;
    const documentHeight = document.documentElement.scrollHeight;
    const scrollPosition = window.scrollY ||  document.body.scrollTop + (document.documentElement && document.documentElement.scrollTop || 0);
    const threshold = 0.98;
    return scrollPosition > threshold * (documentHeight - windowHeight);
  }
const loadMoreTimeout = 1000;
export { isUserNearBottom , loadMoreTimeout}