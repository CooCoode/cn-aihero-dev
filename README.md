# AI Hero 中文站

**➡️ 线上地址：<https://coocoode.github.io/cn-aihero-dev/>**

[Matt Pocock](https://www.aihero.dev) 的 AI 编程方法论中文站。
把 [mattpocock/skills](https://github.com/mattpocock/skills)（MIT 协议）里
**29 个稳定版 Agent Skills** 译成中文，外加一份**原创的 AI 编程术语对照表**。

## 本地运行

```bash
npm install
npm run dev      # http://localhost:4321/cn-aihero-dev/
npm run build    # 构建 + 检查站内链接
npm run preview  # 预览构建产物
```

`npm run build` 做四件事：`astro build` → 链接检查 → 内容一致性检查 → `pagefind` 建索引。

- **check-links.sh**：Astro 不会给 markdown 正文里的链接自动加 `base`，漏加只会在线上
  变成 404，这里把它变成构建期错误。
- **check-content.mjs**：译文与术语表不该自相矛盾。查三类问题——
  每篇译文是否有 `name` + 中英双语 `description`；对照表标 ✅ 的词译文是否用了中文
  （标 🔤 的是否保留英文）；同一页是否有重复 H2（锚点会撞）。
- **pagefind**：`--force-language zh`，只索引标了 `data-pagefind-body` 的正文
  （导航、页脚、侧栏、目录自动排除）。索引产物在 `dist/pagefind/`。

两个检查脚本都可单独跑：`npm run check:links` / `npm run check:content`。

## 部署

推送到 `main` 即自动部署到 GitHub Pages（`.github/workflows/deploy.yml`）。

站点部署在**项目页子路径**下，所以 `astro.config.mjs` 里有 `base = '/cn-aihero-dev'`。
换域名或换仓库名时，需要改两处：

1. `astro.config.mjs` 的 `BASE` 常量
2. 正文里的站内链接前缀（命令写在 `astro.config.mjs` 的注释里）

改完 `npm run build` 会告诉你有没有漏改。

## 内容结构

```
src/content/docs/
├── index / start-here.md          这是什么、中文读者阅读顺序
├── dictionary.md                  AI 编程术语对照表（原创）
├── about.md                       版权与署名
└── skills/                        （页面在 src/pages/skills/index.astro）
    ├── index.md                   安装方法 + 按问题挑 skill 的对照表
    ├── engineering/    （18 个）   tdd、code-review、codebase-design …
    ├── productivity/   （7 个）    grilling、writing-for-agents、teach …
    └── misc/           （4 个）    setup-pre-commit、git-guardrails …
```

## 翻译范围与取舍

**作者本人已明确回复不授权翻译文章与词典词条**（回信原文存在站点 `/about/`）。
下表是这条回复之后的最终边界。

| 内容 | 处理 | 原因 |
| --- | --- | --- |
| 29 个稳定版 Skills | **全文翻译** | `mattpocock/skills` 是 MIT 协议，已授予翻译与分发权，**不需单独请许可** |
| AI 编程术语表 | **完全原创** | 自选词、自写解释、自定分组。不是任何词典的翻译或改写 |
| `skills/in-progress/`（9 个） | **不翻** | 上游标注为进行中，接口会变，翻了就作废 |
| aihero.dev 的文章、词典词条、课程 | **不转载不翻译** | **作者明确拒绝授权**。只链接 |
| 付费产品、集训 | **不涉及** | 商业内容 |

**不要因为那封拒信就去改 Skills 部分。** 拒的是文章和词典词条，
不包含 Skills 仓库，也不改变它的 MIT 许可——那是两件不同的事。

站点上有一条**常驻免责声明**（顶栏位置，每页可见），内容为
“本站未获 AI Hero 授权。文章与词典只链接原文，不翻译”。不要删它。

详细说明见站点 `/about/`。

**翻译格式约定：**

- 正文译成中文；**代码块、命令、文件路径保持原样**
- `description` **全部 29 个**改成中英双语。模型可调用的：中文让你用中文提示词也能触发，
  英文保证英文触发词不失灵。仅斜杠命令可调用的：中文让命令面板可读，英文便于对照
- 术语按 `dictionary.md` 统一，标 🔤 的词保留英文
- `disable-model-invocation: true` 的 skill 是斜杠命令入口，其 `description` 不翻译

## 保持同步

上游更新很勤（本文档成文时它前一天刚推送）。

```bash
bash scripts/sync-check.sh
```

它会拉取上游、对比 `.upstream-sha`，列出**哪些 SKILL.md 变了**、以及对应的中文文件路径。
处理完之后按脚本提示更新 `.upstream-sha`。

## 技术栈

Astro + Tailwind v4 + `@tailwindcss/typography`。**没有集成任何文档主题**——
布局、组件、主题令牌全部自写，因为需要和源站 aihero.dev 的视觉体系对齐。

### 设计体系

令牌直接取自源站的 CSS，不只是“看着像”：

| | 亮色 | 暗色 |
| --- | --- | --- |
| 背景 | `#fbfbfc` | `#0b0b0b` |
| 正文区 | `#fff` | 透明 |
| 文字 | `#14161a` | `#f4f3f1` |
| 强调金 | `#f5c451` | `#f5c451` |
| 边框 | `#14161a1a` | `#ffffff14` |

字体全部自托管（`@fontsource-variable`）：**DM Sans** / **JetBrains Mono** / **Source Serif 4**。
不用 Google Fonts CDN——大陆访问不了。

布局常量：容器 `1456px`、导航高 `62px`、正文限宽 `70ch`、正文 `18.5px / 1.55`。
缓动用源站的 `cubic-bezier(.22,1,.36,1)`，过渡时长以 300ms 为主。

**字号照搬源站，但字距和行高为中文重调。** 源站的 `tracking-[-0.042em]`、`leading-[0.96]`
是给拉丁字母调的；中文是等宽方块字，负字距过头会挤。所以首页大标题取源站的
`4.5rem`，但行高用 `1.08`（源站 `0.96`）、字距用 `-0.022em`（源站 `-0.042em`）。

#### ⚠️ 正文配色变量必须在无层规则里

`--tw-prose-*` 这套变量**不能写在 `@utility` 里**。因为产物中
`@tailwindcss/typography` 的 `.prose` 排在 `.ah-prose` **后面**，
两者同为单类选择器同层，源码顺序决定胜负——插件默认值会压过我们的令牌，
暗色模式下正文变成深灰压深黑（实测 **2.35:1**，几乎读不了）。

无层（unlayered）样式在级联中优先于任何 `@layer`，所以放在
`global.css` 的普通 `.ah-prose { }` 规则里才稳。变量本身随 `.dark` 翻转，
因此也**不需要** `dark:prose-invert`。

改这块之后务必重跑对比度审计：这类失效不报错，只是字看不见。

主要自定义工具类（定义在 `src/styles/global.css`）：

| 类名 | 用途 |
| --- | --- |
| `ah-display` / `ah-h2` / `ah-h2-xl` / `ah-h3` | 中文调校过的字号阶梯 |
| `ah-prose` | 正文变量映射 + 引用块衷线体 + 行内代码底色 |
| `ah-container` | 1456px 容器 |
| `ah-label` | 10px mono 小标签 |
| `ah-btn-primary` / `ah-btn-ghost` | 金色主按钮 / 描边按钮 |

### 动效体系

源站是**两档过渡**，不是统一时长：

| 类型 | 时长 | 缓动 |
| --- | --- | --- |
| 颜色 / 不透明度 | **150ms** | `cubic-bezier(.4, 0, .2, 1)` |
| 位移 / 缩放 | **300ms** | `cubic-bezier(.22, 1, .36, 1)` |

颜色快、位移慢。统一成 300ms 会让悬停变迟钝。

工具类：`ah-t`（颜色）· `ah-move`（位移）· `ah-link` · `ah-icon-btn` ·
`ah-btn-primary` / `ah-btn-ghost`（描边按钮悬停**整块反色**）· `ah-arrow`（父级悬停右移 4px）·
`ah-frame` + `ah-frame-layer`（卡片边框收拢：内层 `inset` 收到 5px，露出金色渐变边）·
`ah-scrollfade`（纯 CSS 滚动遮罩，`animation-timeline: scroll(self)`，零 JS）

全部动效配了 `prefers-reduced-motion` 降级，且是**逐组件关闭**而非全局关掉——
颜色照变，只取消位移。

完整拆解（含源站实测数据、两个静默失效坑）见 [`docs/ui-motion-spec.md`](docs/ui-motion-spec.md)。

### 无障碍

- **文字对比度：两种主题 × 34 页全部达到 WCAG AA**（正文 4.5:1，大字 3:1）
- 有**跳转链接**（`跳到正文`），默认视觉隐藏，聚焦时出现；`<main id="main" tabindex="-1">`
- 所有位移动画配 `prefers-reduced-motion` 降级，逐组件关闭而非全局一刀切
- 焦点环用 `--ring`，2px
- 代码高亮用 `github-light-high-contrast`——`github-light` 的橙色 token 只有 3.49:1

对比度审计脚本思路（值得保留）：用 canvas 的 `ctx.fillStyle` 让浏览器把颜色
归一化成 rgba。**不要用正则解析颜色字符串**——`oklch(0.872 0.01 258.338)`
会被当成 RGB，算出垃圾对比度，把真问题掩盖成假警报。

### `/skills/` 总览页

不是 markdown，而是 `src/pages/skills/index.astro`——因为要用卡片网格和
悬停边框收拢，markdown 表格做不到。

- **卡片列表从内容集合生成**，数量也是派生的（`ENGINEERING · 18`），加 skill 不用改页面
- 只有「按问题挑」那张表是手维护的——「需求 → skill」是编选映射，推导不出来
- 卡片沿用首页的 `ah-frame` 悬停效果，保持全站一致

### 组件

`Base.astro`（外壳 + 主题内联脚本）· `Article.astro`（三栏：侧栏 / 正文 / 目录）·
`Header` · `Footer` · `Sidebar`（从内容集合自动生成，可折叠）· `ThemeToggle` · `Search`

### 搜索

Pagefind 1.5.2，独立于框架，不需要文档主题。用原生 `<dialog>` + `showModal()`，
自带焦点陷阱与 Esc 关闭。

两个必须知道的点：

1. **不要设 `options({ baseUrl })`。** Pagefind 会读页面的 `<link rel="canonical">`，
   结果 URL 自动带 `base` 前缀；再设 `baseUrl` 会重复加。
2. **动态 import 必须放在 `<script is:inline>` 里。** Astro/Vite 会把带 `@vite-ignore`
   的动态 import 也做预处理，注入一个未定义的 `__VITE_PRELOAD__` 助手，
   运行时直接报 `__VITE_PRELOAD__ is not defined`，搜索永远加载不出来。

索引只在第一次打开搜索时才拉，不在每页加载时请求。快捷键 ⌘K / Ctrl+K。

部署到任何静态托管：构建命令 `npm run build`，输出目录 `dist`。

## 许可证

- **Skills 译文**：MIT，源自 mattpocock/skills，Copyright (c) 2026 Matt Pocock。见 [LICENSE](./LICENSE)
- **术语表中文解释**：本站原创
- 本站为**非官方**站点，与 Matt Pocock / AI Hero 无隶属关系