# API 文档站点

基于 Docusaurus 构建的 API 文档系统。

## 快速开始

### 安装依赖

依赖已经安装完成，如果需要重新安装：

```bash
npm install
```

### 本地开发

启动本地开发服务器：

```bash
npm start
```

这将启动开发服务器并在浏览器中打开 `http://localhost:3000`。大多数更改会实时更新，无需重启服务器。

### 构建

生成生产环境的静态文件：

```bash
npm run build
```

构建后的文件将生成在 `build` 目录中。

### 本地预览构建结果

```bash
npm run serve
```

这将在 `http://localhost:3000` 启动一个服务器，预览构建后的内容。

## 目录结构

```
.
├── blog/                   # 博客文章（Markdown）
├── docs/                   # 文档页面（Markdown）
│   └── intro.md           # 首页文档
├── src/
│   ├── components/        # React 组件
│   ├── css/              # 全局 CSS
│   │   └── custom.css    # 自定义样式
│   └── pages/            # 自定义页面
│       └── index.js      # 首页
├── static/               # 静态资源
│   └── img/             # 图片资源
├── docusaurus.config.js  # Docusaurus 配置
├── sidebars.js          # 侧边栏配置
└── package.json         # 项目依赖
```

## 添加文档

### 创建新文档页面

1. 在 `docs/` 目录下创建新的 Markdown 文件
2. 在文件顶部添加 frontmatter：

```markdown
---
sidebar_position: 2
---

# 文档标题

文档内容...
```

3. 文档会自动添加到侧边栏

### 组织文档结构

在 `sidebars.js` 中自定义侧边栏结构：

```javascript
const sidebars = {
  tutorialSidebar: [
    {
      type: 'category',
      label: 'API 参考',
      items: [
        'api/authentication',
        'api/endpoints',
      ],
    },
  ],
};
```

### 添加博客文章

在 `blog/` 目录下创建新的 Markdown 文件：

```markdown
---
slug: my-post
title: 文章标题
authors: [admin]
tags: [tag1, tag2]
---

文章摘要

<!-- truncate -->

文章正文...
```

## 自定义配置

### 修改网站信息

编辑 `docusaurus.config.js` 文件：

```javascript
const config = {
  title: '你的网站标题',
  tagline: '网站标语',
  url: 'https://your-domain.com',
  // ... 其他配置
};
```

### 自定义主题颜色

编辑 `src/css/custom.css` 文件：

```css
:root {
  --ifm-color-primary: #2e8555;
  /* 修改其他颜色变量 */
}
```

### 添加 Logo

1. 将 logo 文件（SVG 格式）放到 `static/img/` 目录
2. 在 `docusaurus.config.js` 中配置：

```javascript
navbar: {
  logo: {
    alt: 'Logo',
    src: 'img/logo.svg',
  },
}
```

## 部署

### 部署到 GitHub Pages

1. 修改 `docusaurus.config.js` 中的配置：

```javascript
const config = {
  url: 'https://your-username.github.io',
  baseUrl: '/your-repo-name/',
  organizationName: 'your-username',
  projectName: 'your-repo-name',
};
```

2. 运行部署命令：

```bash
npm run deploy
```

### 部署到其他平台

构建后将 `build` 目录部署到：
- Vercel
- Netlify
- AWS S3
- 其他静态网站托管服务

## 常用功能

### 搜索功能

Docusaurus 支持多种搜索方案，推荐使用 Algolia DocSearch（免费）。

### 多语言支持

项目已配置中文作为默认语言。要添加更多语言：

1. 在 `docusaurus.config.js` 中添加语言：

```javascript
i18n: {
  defaultLocale: 'zh-CN',
  locales: ['zh-CN', 'en', 'ja'],
},
```

2. 运行命令生成翻译文件：

```bash
npm run write-translations -- --locale en
```

## 参考资源

- [Docusaurus 官方文档](https://docusaurus.io/)
- [Markdown 语法](https://www.markdownguide.org/)
- [React 文档](https://react.dev/)

## 许可证

ISC
