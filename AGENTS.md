# ZJFFUN

ZJFFUN 是双语个人主页，收录代码、动漫、读书、音乐和个人项目。网站用 Vite 构建，由 GitHub Pages 部署。推送到 `main` 会触发部署。

## 从哪里改

- 首页结构在 `publish/index.html`，中英文文案分别在 `publish/i18n/index.zh-CN.yaml` 和 `publish/i18n/index.en.yaml`，首页样式在 `src/scss/index.scss`。
- Vite 用同一份模板生成英文的 `/index.html` 和中文的 `/index.zh.html`。更新首页文案时同步检查两个语言文件，构建产物 `dist/` 由 Vite 生成。
- `public/acg/` 和 `public/acg/recommend/` 是独立静态页面。涉及首页的改动通常在共享模板和样式里完成。

## 文案和界面

- 中文沿用「搞事情」的口吻，像在介绍自己做过的小东西。英文沿用 `just for fun` 的轻松语气，可以按英文习惯独立写。
- 工具简介先写清楚能做什么，一般一句话。博客和兴趣项目可以带一点自嘲。产品名、快捷键和实际功能要准确。
- 首页沿用深色、等宽字和青色高亮。代码、动漫、读书、音乐用整块可点的卡片，列表里的入口避免和顶部重复。
- 窄屏把标志和语言切换放在顶部，给正文留出横向空间。检查鼠标悬浮、键盘焦点和减少动态效果下的表现。

## 开发和检查

- 沿用 `pnpm-lock.yaml` 和 `package.json` 声明的 pnpm 版本。用 `pnpm dev` 启动，改完用 `pnpm build` 检查。
- 首页模板和翻译文件保存后会触发开发页面刷新。检查构建后的 `dist/index.html` 和 `dist/index.zh.html`，确认文案和链接进了对应页面。
