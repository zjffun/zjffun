import '../scss/index.scss';

let currentLangCode = window.localStorage.getItem('langCode');

if (!currentLangCode) {
  [currentLangCode] = navigator.language.split('-');
}

const isZhPage = window.location.pathname.startsWith('/index.zh.html');

if (isZhPage && currentLangCode !== 'zh') {
  window.location.href = `${window.location.origin}/index.html${window.location.search}${window.location.hash}`;
} else if (!isZhPage && currentLangCode === 'zh') {
  window.location.href = `${window.location.origin}/index.zh.html${window.location.search}${window.location.hash}`;
}
