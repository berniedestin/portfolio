export function performThemeSwipe(nextTheme, sx, sy) {
  const swipe = document.createElement('div');
  swipe.className = 'theme-swipe';
  swipe.style.setProperty('--sx', sx + 'px');
  swipe.style.setProperty('--sy', sy + 'px');
  document.body.appendChild(swipe);
  // eslint-disable-next-line no-unused-expressions
  swipe.offsetWidth; // force reflow before adding class
  swipe.classList.add('go');
  setTimeout(() => {
    document.documentElement.setAttribute('data-theme', nextTheme);
    swipe.style.transition = 'opacity .35s ease';
    swipe.style.opacity = '0';
    setTimeout(() => swipe.remove(), 400);
  }, 280);
}
