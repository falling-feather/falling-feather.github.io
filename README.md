# Falling_feather's Blog

> 落入白川的羽的个人博客

🔗 **在线访问**：[https://falling-feather.github.io](https://falling-feather.github.io)

## 简介

这是一个基于 [Hexo](https://hexo.io/) 框架和 [Fluid](https://github.com/fluid-dev/hexo-theme-fluid) 主题构建的个人博客，通过 GitHub Pages 部署。

目前采用**本地生成 + 静态文件直接部署**的方式维护：在本地通过 Hexo 生成静态页面，将生成的 HTML/CSS/JS 文件直接提交到仓库的 `main` 分支，由 GitHub Pages 提供访问服务。

## 项目结构

```
Blog/
├── source/                 # 📝 博客源文件（Markdown 文章、页面等）
│   ├── _posts/             #    文章源文件
│   ├── about/              #    关于页面
│   ├── css/                #    自定义样式
│   └── js/                 #    自定义脚本
├── 2025/, 2026/            # 🌐 生成的文章静态页面（按日期组织）
├── about/, archives/       # 🌐 生成的功能页面
├── categories/, tags/      # 🌐 生成的分类和标签页面
├── css/, js/               # 🌐 生成的全局样式和脚本
├── img/                    # 🖼️ 图片资源
├── _config.yml             # ⚙️ Hexo 主配置
├── _config.fluid.yml       # 🎨 Fluid 主题配置
├── package.json            # 📦 项目依赖声明
└── index.html              # 🏠 网站首页
```

## 本地开发

### 环境要求

- [Node.js](https://nodejs.org/) (推荐 v16+)
- [Git](https://git-scm.com/)

### 安装依赖

```bash
npm install
```

### 本地预览

```bash
npm run preview
```

执行后访问 `http://localhost:4000` 即可在本地预览博客。

### 发布流程

1. 为新文章先确定一个稳定的 ASCII slug，例如 `ximo-ren`。文章标题可以使用中文，但 URL 路径不要直接使用中文标题，避免复制链接时出现百分号编码。
2. 在 `source/_posts/` 中使用 `YYYY-MM-DD-slug.md` 编写源稿，并在 Front Matter 中同步维护这些字段：

   ```yaml
   title: 洗墨人
   date: 2026-06-04 22:30:00
   permalink: /2026/06/04/ximo-ren/
   description: 一句话外部展示摘要
   gitalk_id: story-ximo-ren-2026-06-04
   categories:
     - 故事
   tags:
     - 小说
   ```

3. `description` 用于首页文章卡片、`posts.json` 和搜索/外部展示摘要；不要直接截取正文开头当作展示文案。
4. `gitalk_id` 必须每篇文章唯一，并同步到生成后的文章页 Gitalk 初始化配置中，避免复用其他文章的评论区。
5. 将头图等资源放入 `img/`，必要时同步到 `source/img/`；大图优先转换为 WebP 等适合网页加载的格式。
6. 当前仓库采用静态文件直接部署：发文后需要同步文章页、首页、归档页、分类页、标签页、`posts.json`、`local-search.xml` 等生成产物。
7. 运行 `npm run sync:stats`，再进行本地静态路径检查和线上 GitHub Pages 检查。
8. 提交到 `main` 后，仓库的 post-commit hook 会自动推送；若自动推送失败，再手动执行 `git push origin main`。

## 文章列表

| 日期 | 标题 | 分类 |
|---|---|---|
| 2026-06-04 | 洗墨人 | 故事 |
| 2026-04-05 | 排列的字典序问题题解 | 题解 |
| 2026-02-19 | 魔术计算器 | — |
| 2025-12-23 | 欢迎你们 | 生活 |
| 2025-12-22 | 程序竞赛自用模板集锦 | 算法模板 |

## 配置文件说明

| 文件 | 用途 |
|---|---|
| `_config.yml` | Hexo 核心配置（站点信息、URL、部署设置等） |
| `_config.fluid.yml` | Fluid 主题定制（导航栏、页脚、代码高亮、评论系统等） |
| `package.json` | Node.js 依赖管理 |

## 技术栈

- **框架**：[Hexo](https://hexo.io/) v6.3
- **主题**：[Fluid](https://hexo.fluid-dev.com/) v1.9
- **部署**：GitHub Pages
- **语言**：中文 (zh-CN)

## License

MIT

## 功能特性

- ✨ 樱花飘落效果（可通过导航栏按钮控制）
- 🎨 统一的背景图片（bg1.jpg）
- 💬 Gitalk 评论系统（基于 GitHub Issues）
- 🚀 GitHub Actions 自动部署
- 📱 响应式设计
- ⏱️ 网站运行时间统计

## 作者

落入白川的羽

## 相关链接

- 博客地址：https://falling-feather.github.io
- GitHub 仓库：https://github.com/falling-feather/falling-feather.github.io
