import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { template } from 'lodash-es';
import YAML from 'yaml';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const loadYaml = (f) =>
  YAML.parse(readFileSync(path.resolve(__dirname, `publish/i18n/${f}`), 'utf8'));

const i18nMap = {
  'index.html': loadYaml('index.en.yaml'),
  'index.zh.html': loadYaml('index.zh-CN.yaml'),
};

const analytics = readFileSync(
  path.resolve(__dirname, 'publish/common/analytics.html'),
  'utf8',
);

const templateHtml = readFileSync(
  path.resolve(__dirname, 'publish/index.html'),
  'utf8',
).replace(
  /<%=\s*require\(['"]!!raw-loader!\.\/common\/analytics\.html['"]\)\.default\s*%>/,
  analytics,
);

const i18nHtmlPlugin = {
  name: 'i18n-html',
  transformIndexHtml: {
    order: 'pre',
    handler(_html, ctx) {
      const name = ctx.path.replace(/^\//, '').replace(/\?.*$/, '') || 'index.html';
      const data = i18nMap[name];
      if (!data) return _html;
      return template(templateHtml)({
        htmlWebpackPlugin: { options: { zi18n: data } },
      });
    },
  },
};

export default defineConfig({
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
  plugins: [i18nHtmlPlugin],
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
