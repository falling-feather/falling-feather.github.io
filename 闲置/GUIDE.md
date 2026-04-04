# 博客维护操作指南

> **适用对象**：后续维护者（人或 AI），请在进行任何编辑前通读本文档。

---

## 1. 项目概况

这是一个 **纯静态维护** 的 Hexo + Fluid 博客。虽然仓库保留了 Hexo 配置文件，但日常维护 **不使用 `hexo generate`**，而是直接编辑和管理 HTML 静态文件。

| 项目     | 值                                            |
| -------- | --------------------------------------------- |
| 部署地址 | https://falling-feather.github.io             |
| 仓库     | `falling-feather/falling-feather.github.io` |
| 分支     | `main`（源码 + 静态文件）                   |
| 自动化   | PowerShell 脚本（需 Windows 环境）            |

---

## 2. 核心文件关系

```
posts.json              ← 唯一的文章数据源（所有文章元信息）
    │
    ▼
sync-pages.ps1          ← 读取 posts.json，自动重建索引页面
    │
    ├── archives/index.html          归档总页
    ├── archives/{year}/index.html   各年份归档页
    ├── categories/index.html        分类总页
    ├── categories/{cat}/index.html  各分类详情页
    ├── tags/index.html              标签云页
    └── tags/{tag}/index.html        各标签详情页

index.html              ← 首页文章卡片（需手动维护）
{year}/{mm}/{dd}/{slug}/index.html  ← 文章正文页面（需手动维护）
```

### 自动化覆盖范围

| 页面类型                   | 是否自动化 | 说明                                          |
| -------------------------- | ---------- | --------------------------------------------- |
| 归档页（archives）         | ✅ 自动    | `sync-pages.ps1` 全量重建                   |
| 分类页（categories）       | ✅ 自动    | `sync-pages.ps1` 全量重建                   |
| 标签页（tags）             | ✅ 自动    | `sync-pages.ps1` 全量重建                   |
| 首页文章卡片（index.html） | ❌ 手动    | 需在 `index.html` 中添加/修改卡片 HTML      |
| 文章正文                   | ❌ 手动    | 需创建 `{year}/{mm}/{dd}/{slug}/index.html` |

---

## 3. 发布新文章的完整流程

### 第一步：准备文章正文页面

将文章的 HTML 文件放入正确的目录：

```
{year}/{mm}/{dd}/{文章名}/index.html
```

例如：`2026/02/19/魔术计算器/index.html`

> 可以复制一篇已有文章的 HTML 作为模板，修改其中的标题、正文内容、日期等。

### 第二步：更新 posts.json

在 `posts.json` 数组中 **添加一条新记录**（建议按日期降序排列，最新的在最前面）：

```json
{
  "title": "文章标题",
  "date": "YYYY-MM-DD",
  "url": "/YYYY/MM/DD/%E6%96%87%E7%AB%A0%E5%90%8D/",
  "description": "文章摘要描述",
  "categories": ["分类名"],
  "tags": ["标签1", "标签2"]
}
```

**注意事项**：

- `url` 中的中文部分需要 URL 编码（`encodeURIComponent`）
- `categories` 和 `tags` 都是数组，即使只有一个值也要用 `[]` 包裹
- `date` 格式严格为 `YYYY-MM-DD`

### 第三步：运行同步脚本

```powershell
.\sync-pages.ps1
```

1. 脚本会自动重建所有归档/分类/标签索引页。如果出现新的分类或标签，脚本会自动创建对应的子目录和页面。

2. 文章标题区的“字数 / 预计阅读时间”请额外执行：

```powershell
npm run sync:stats
```

该命令会扫描所有文章页（`YYYY/MM/DD/slug/index.html`），自动补齐标题区统计信息。

### 第四步：更新首页（手动）

编辑根目录的 `index.html`，在文章列表区域添加新的卡片。

卡片位于 `<div id="board">` 内部，每篇文章对应一个 `<div class="row mx-auto">` 块。可复制已有卡片修改以下字段：

- 文章链接 `href`
- 标题文本
- 摘要文本
- 日期
- 分类名和分类链接
- 标签名和标签链接

### 第五步：提交推送

```powershell
.\auto-push.ps1
```

按提示输入提交信息即可推送到 GitHub。

---

## 4. posts.json 字段说明

```json
{
  "title": "魔术计算器",         // 文章标题（纯文本）
  "date": "2026-02-19",          // 发布日期
  "url": "/2026/02/19/...../",   // 文章 URL 路径（中文需 URL 编码）
  "description": "文章摘要...",   // 用于首页卡片等处的描述
  "categories": ["生活"],         // 分类列表（目前每篇文章归属一个分类）
  "tags": ["玩具"]               // 标签列表（可多个）
}
```

---

## 5. 脚本说明

### sync-post-stats.mjs

| 功能 | 说明 |
| ---- | ---- |
| 输入 | 文章 HTML（`YYYY/MM/DD/slug/index.html`） |
| 输出 | 自动补齐标题区“字数”和“预计阅读时间” |
| 触发命令 | `npm run sync:stats` |
| 更新策略 | **仅填充空值**，已有手工数值不覆盖 |
| 字数规则 | 中文字数 + 英文/数字词数 |
| 阅读时长 | 按 120 字/分钟向上取整 |

注意：这个脚本不会修改归档/分类/标签页，只处理文章头图下方的统计信息。

### sync-pages.ps1

| 功能        | 说明                                                                                 |
| ----------- | ------------------------------------------------------------------------------------ |
| 输入        | `posts.json`                                                                       |
| 输出        | 重写 `archives/`、`categories/`、`tags/` 下所有 `index.html`                 |
| 原理        | 从现有 HTML 页面中提取页头页尾模板（`<head>`、导航栏、页脚等），仅替换中间内容区域 |
| 幂等性      | ✅ 可反复运行，结果一致                                                              |
| 新分类/标签 | 自动创建目录和页面（基于现有模板复制）                                               |

### auto-push.ps1

| 功能 | 说明                                                                                  |
| ---- | ------------------------------------------------------------------------------------- |
| 作用 | 检测未提交的更改 → 提示输入 commit message →`git add . && git commit && git push` |
| 使用 | 在所有本地修改完成后运行                                                              |

---

## 6. 目录结构速查

```
Blog/
├── posts.json              ⭐ 文章数据源（编辑此文件添加新文章）
├── sync-pages.ps1          ⭐ 同步脚本（修改 posts.json 后运行）
├── auto-push.ps1           ⭐ 推送脚本（本地确认无误后运行）
├── index.html              ⭐ 首页（新文章需手动添加卡片）
│
├── 2025/                   文章正文页面（2025 年）
├── 2026/                   文章正文页面（2026 年）
├── archives/               归档索引页（自动生成）
├── categories/             分类索引页（自动生成）
├── tags/                   标签索引页（自动生成）
│
├── about/                  关于页面
├── links/                  友链页面
├── css/                    全局样式
├── js/                     全局脚本
├── img/                    图片资源
│
├── source/                 Hexo 源文件（仅保留，日常不使用）
├── _config.yml             Hexo 配置（仅保留）
├── _config.fluid.yml       Fluid 主题配置（仅保留）
├── package.json            依赖声明（仅保留）
│
├── .gitignore              Git 忽略规则
├── README.md               GitHub 项目介绍
├── GUIDE.md                本文档
└── 404.html                404 页面
```

---

## 7. 常见操作速查

| 我想要...                  | 怎么做                                                                                                              |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 发布新文章                 | 见 §3 完整流程                                                                                                     |
| 修改已有文章内容           | 直接编辑 `{year}/{mm}/{dd}/{slug}/index.html`                                                                     |
| 修改文章的分类/标签/日期   | 修改 `posts.json` 中对应条目 → 运行 `.\sync-pages.ps1`                                                         |
| 删除文章                   | 从 `posts.json` 删除条目 → 运行 `.\sync-pages.ps1` → 删除文章目录 → 手动从 `index.html` 移除卡片           |
| 修改首页文章顺序           | 编辑 `index.html` 中卡片的排列顺序                                                                                |
| 修改导航栏/页脚/主题样式   | 每个页面的 HTML 头尾部分包含导航栏和页脚，全局修改需编辑所有页面（或修改 `_config.fluid.yml` 后用 Hexo 重新生成） |
| 添加新的独立页面（如友链） | 创建 `{pagename}/index.html`，可参考 `about/index.html` 的结构                                                  |

---

## 8. 注意事项

1. **PowerShell 版本**：脚本在 PowerShell 5.1（Windows 内置）下测试通过。含中文的 `.ps1` 文件必须保存为 **UTF-8 with BOM** 编码，否则解析会出错。
2. **URL 编码**：`posts.json` 中的 `url` 字段里，中文字符必须使用 `%XX` 编码。可用浏览器控制台执行 `encodeURIComponent("中文")` 来获取编码结果。
3. **sync-pages.ps1 的模板机制**：脚本通过查找 `<div class="col-12 col-md-10 m-auto">` 定位内容区域的起点，通过尾部三层 `</div>` 定位终点。如果修改了页面的 HTML 结构，可能导致脚本无法正确分割模板。
4. **首页不自动同步**：`index.html` 的文章卡片 HTML 结构较复杂（包含图片、摘要、样式类等），目前需要手动维护。
5. **Git 忽略规则**：`node_modules/`、`*.code-workspace`、`db.json` 等已在 `.gitignore` 中排除，不要提交到仓库。
6. **发布前统计检查**：新增/重写文章后，务必执行 `npm run sync:stats`，并检查文章头图下方是否显示“`X 字` + `Y 分钟`”。

### 8.1 代码块渲染与代码挂件（重点）

这套站点的代码块体验由三层共同决定：

1. 文章 HTML 结构（`figure.highlight`）
2. 主题样式（`css/highlight.css` + `css/highlight-dark.css`）
3. 前端脚本挂件注入（`js/plugins.js`）

如果只改其中一层，容易出现“颜色正常但右上角语言角标/复制按钮消失”的问题。

#### 必须遵守的代码块结构

推荐结构（与模板页一致）：

```html
<figure class="highlight cpp">
  <table>
    <tr>
      <td class="gutter">
        <pre><span class="line">1</span><br><span class="line">2</span></pre>
      </td>
      <td class="code">
        <pre><code class="hljs cpp">...高亮后的代码...</code></pre>
      </td>
    </tr>
  </table>
</figure>
```

关键点：

- 左侧行号区（gutter）可以使用 `span.line`。
- 右侧代码区（code）不要给每一行再包 `span.line`。
- 语言类建议使用规范值：`cpp`、`python`、`text`。

#### 为什么会丢失角标和复制按钮

`js/plugins.js` 的 `codeWidget` 在处理 `pre` 时，如果检测到该 `pre` 内有 `span.line`，会直接跳过挂件注入。

因此：

- 若把右侧代码区每一行也包成 `span.line`，就会触发跳过。
- 结果是没有语言角标，也没有复制按钮。

#### 样式层面的约束

- 不要在文章页里硬编码深色/浅色代码块配色（会破坏亮暗主题切换）。
- 代码高亮颜色应完全交给主题样式文件处理：`css/highlight.css`、`css/highlight-dark.css`。
- 文章页只保留必要结构与语义类名，不额外覆盖主题代码块主样式。

#### 发布前回归检查清单

每次改代码块渲染后，至少做以下检查：

1. 亮色模式：代码文字、关键字、注释可读，右上角有语言角标与复制按钮。
2. 暗色模式：同上，不出现“深色背景+深色文字”或“浅色背景+浅色文字”。
3. 长代码块：行号对齐、无横向错位、复制按钮可正常复制。
4. 多语言块：`cpp`、`python`、`text` 的语言标签都能正常显示。
5. 页面脚本：确认页面仍包含 `clipboard` 依赖与 `Fluid.plugins.codeWidget()` 调用。

#### 故障快速排查

当角标/复制按钮消失时，优先按顺序检查：

1. 是否存在 `figure.highlight` 结构。
2. 右侧 `td.code > pre > code` 内是否错误包含 `span.line`。
3. 页面是否加载了 `js/plugins.js` 与 clipboard 依赖。
4. `CONFIG` 中 `copy_btn`、`code_language` 是否为开启状态。
5. 是否写了覆盖主题的文章内联代码块样式。

---

## 9. Git 覆盖式推送指南

### 为什么需要覆盖式推送

仓库早期误提交了 `node_modules/`（数千个文件），虽然后来通过 `git rm --cached` 从索引中移除了，但这些文件仍然残留在 git 历史的每一次提交中，导致：

- 仓库 pack 大小约 **50 MB**，而实际有用内容仅约 **31 MB**（其中 ~28 MB 是 `img/` 背景图）
- `git clone` 时需要下载大量无用数据
- 82 次提交中存在许多重复修复提交（如多次删除 `.deploy_git`），历史意义不大

覆盖式推送通过创建一个**无历史的干净首次提交**，彻底清除所有旧历史中的垃圾数据。

### 影响范围

| 内容                         | 是否受影响  | 说明                                            |
| ---------------------------- | ----------- | ----------------------------------------------- |
| 仓库代码文件                 | ✅ 保持不变 | 只是历史被压缩为一次提交                        |
| GitHub Issues（Gitalk 评论） | ❌ 不受影响 | Issues 独立于 git 历史                          |
| GitHub Pages 部署            | ❌ 不受影响 | 只要 `main` 分支存在且包含正确文件            |
| GitHub 仓库设置              | ❌ 不受影响 | 仓库配置独立于 git 历史                         |
| git 提交历史                 | ✅ 全部丢弃 | 82 次旧提交将不可恢复（本地 reflog 可短期恢复） |

### 需要提交的文件

以下是仓库中**应当提交**的所有文件及目录：

```
提交目录/文件                    说明
─────────────────────────────  ──────────────────────
.gitignore                     Git 忽略规则
README.md                      项目说明
GUIDE.md                       本维护指南
posts.json                     文章数据源
sync-pages.ps1                 同步脚本
auto-push.ps1                  推送脚本
_config.yml                    Hexo 配置（保留）
_config.fluid.yml              Fluid 主题配置（保留）
package.json                   依赖声明（保留）
404.html                       404 页面
index.html                     首页
local-search.xml               本地搜索索引

about/                         关于页面
links/                         友链页面
archives/                      归档索引页
categories/                    分类索引页
tags/                          标签索引页
2025/                          2025 年文章正文
2026/                          2026 年文章正文

css/                           样式文件
js/                            脚本文件
img/                           图片资源（~28 MB，背景图等）
xml/                           XML 数据文件
source/                        Hexo 源文件（保留）
```

### 不应提交的文件（已在 .gitignore 中排除）

```
排除目录/文件                    原因
─────────────────────────────  ──────────────────────
node_modules/                  npm 依赖，可通过 npm install 还原
.deploy_git/                   Hexo 部署临时目录
Blog.code-workspace            VS Code 工作区文件（个人配置）
*.code-workspace               同上
db.json                        Hexo 数据库缓存
.github/                       空的 workflows 目录
闲置/                          闲置文件（未使用的图片、工具脚本、说明文档等）
Thumbs.db / Desktop.ini        Windows 系统文件
.DS_Store                      macOS 系统文件
```

### 操作步骤

```powershell
# ① 确认当前在 Blog 目录且所有改动已就绪
cd D:\Blog

# ② 创建一个无历史的孤立分支
git checkout --orphan clean-main

# ③ 暂存所有文件（.gitignore 会自动排除不需要的文件）
git add -A

# ④ 提交（将所有文件合并为一次干净的首次提交）
git commit -m "Initial commit: 博客整站重构与代码规范化"

# ⑤ 删除旧的 main 分支
git branch -D main

# ⑥ 将当前分支重命名为 main
git branch -m main

# ⑦ 强制推送到远程，覆盖旧历史
git push origin main --force
```

### 注意事项

1. **不可逆操作**：一旦 `--force` 推送成功，远程仓库的旧历史将永久丢失。本地 `git reflog` 在短期内（默认 90 天）仍可找回旧提交，但远程不可恢复。
2. **推送前检查**：执行 `git status` 确认没有遗漏的未暂存文件，特别是新建文件（`??` 标记）。
3. **推送后验证**：
   - 访问 https://github.com/falling-feather/falling-feather.github.io 确认文件完整
   - 访问 https://falling-feather.github.io 确认博客正常显示
   - 检查 Gitalk 评论区是否正常加载
4. **协作者**：如果有其他设备也 clone 了这个仓库，需要在那些设备上重新 clone，因为旧历史已不存在。
5. **GitHub Pages**：force push 后 GitHub Pages 会自动重新部署，可能需要等待几分钟生效。
