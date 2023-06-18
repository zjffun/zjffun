import '../scss/index.scss';

const faviconEl = document.createElement('link');
const faviconIndex = Math.floor(Math.random() * 2);
faviconEl.rel = 'icon';
faviconEl.href = `./favicon/${faviconIndex}.ico`;
document.head.insertAdjacentElement('beforeend', faviconEl);
