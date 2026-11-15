import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { template } from 'lodash-es';
import YAML from 'yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const localeFiles = {
  'index.html': path.resolve(__dirname, 'publish/i18n/index.en.yaml'),
  'index.zh.html': path.resolve(__dirname, 'publish/i18n/index.zh-CN.yaml'),
};
const templateFile = path.resolve(__dirname, 'publish/index.html');
const analyticsFile = path.resolve(__dirname, 'publish/common/analytics.html');
const homepageFiles = new Set([templateFile, analyticsFile, ...Object.values(localeFiles)]);

const i18nHtmlPlugin = {
  name: 'i18n-html',
  configureServer(server) {
    server.watcher.add([...homepageFiles]);
    server.watcher.on('change', (file) => {
      if (homepageFiles.has(file)) server.ws.send({ type: 'full-reload', path: '*' });
    });
  },
  transformIndexHtml: {
    order: 'pre',
    handler(_html, ctx) {
      const name = ctx.path.replace(/^\//, '').replace(/\?.*$/, '') || 'index.html';
      if (!Object.hasOwn(localeFiles, name)) return _html;

      const data = YAML.parse(readFileSync(localeFiles[name], 'utf8'));
      const templateHtml = readFileSync(templateFile, 'utf8').replace(
        /<%=\s*require\(['"]!!raw-loader!\.\/common\/analytics\.html['"]\)\.default\s*%>/,
        () => readFileSync(analyticsFile, 'utf8'),
      );
      return template(templateHtml)({
        htmlWebpackPlugin: { options: { zi18n: data } },
      });
    },
  },
};

// Dev server falls back to the root index.html for directory URLs, so serve
// the static pages under public/ (e.g. /acg/) explicitly.
const publicDirIndexPlugin = {
  name: 'public-dir-index',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const m = req.url && req.url.match(/^(\/acg(?:\/recommend)?)(\/)?(\?.*)?$/);
      if (m) {
        if (!m[2]) {
          res.statusCode = 302;
          res.setHeader('Location', `${m[1]}/${m[3] || ''}`);
          res.end();
          return;
        }
        req.url = `${m[1]}/index.html${m[3] || ''}`;
      }
      next();
    });
  },
};

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  plugins: [publicDirIndexPlugin, i18nHtmlPlugin],
  css: {
    preprocessorOptions: {
      scss: { api: 'modern-compiler' },
    },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        en: path.resolve(__dirname, 'index.html'),
        zh: path.resolve(__dirname, 'index.zh.html'),
      },
    },
  },
});
