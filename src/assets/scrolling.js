// a function used to check if the user is near the bottom of the page. You can change the timeout before the user can request more movies or the percentage of the page that the user needs to scroll to before the function returns true.
const threshold = 0.95;
const loadMoreTimeout = 1000;
function isUserNearBottom() {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollPosition =
    window.scrollY ||
    document.body.scrollTop +
      ((document.documentElement && document.documentElement.scrollTop) || 0);

  return scrollPosition > threshold * (documentHeight - windowHeight);
}

export { isUserNearBottom, loadMoreTimeout };
