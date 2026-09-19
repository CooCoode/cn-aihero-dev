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

`npm run build` 会顺带跑 `scripts/check-links.sh`：Astro 不会给 markdown 正文里的
链接自动加 `base`，漏加只会在线上变成 404，所以这里把它变成构建期错误。

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
└── skills/
    ├── index.md                   安装方法 + 按问题挑 skill 的对照表
    ├── engineering/    （18 个）   tdd、code-review、codebase-design …
    ├── productivity/   （7 个）    grilling、writing-for-agents、teach …
    └── misc/           （4 个）    setup-pre-commit、git-guardrails …
```

## 翻译范围与取舍

| 内容 | 处理 | 原因 |
| --- | --- | --- |
| 29 个稳定版 Skills | **全文翻译** | 上游是 MIT 协议，允许翻译分发，只需保留署名 |
| AI 编程术语表 | **中文解释原创** | 术语清单是行业通用词；解释由本站撰写，未复制 aihero.dev 词典 |
| `skills/in-progress/`（9 个） | **不翻** | 上游标注为进行中，接口会变，翻了就作废 |
| aihero.dev 的 101 篇文章、词典、课程 | **不转载不翻译** | 未获授权。只做导读与链接 |
| 付费产品、集训 | **不涉及** | 商业内容 |

详细说明见站点 `/about/`。

**翻译格式约定：**

- 正文译成中文；**代码块、命令、文件路径保持原样**
- `description` 改成**中英双语**，这样用中文提示词也能触发 skill
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

主要自定义工具类（定义在 `src/styles/global.css`）：

| 类名 | 用途 |
| --- | --- |
| `ah-display` / `ah-h2` / `ah-h2-xl` / `ah-h3` | 中文调校过的字号阶梯 |
| `ah-prose` | 正文变量映射 + 引用块衷线体 + 行内代码底色 |
| `ah-container` | 1456px 容器 |
| `ah-label` | 10px mono 小标签 |
| `ah-btn-primary` / `ah-btn-ghost` | 金色主按钮 / 描边按钮 |

### 组件

`Base.astro`（外壳 + 主题内联脚本）· `Article.astro`（三栏：侧栏 / 正文 / 目录）·
`Header` · `Footer` · `Sidebar`（从内容集合自动生成，可折叠）· `ThemeToggle`

部署到任何静态托管：构建命令 `npm run build`，输出目录 `dist`。

## 许可证

- **Skills 译文**：MIT，源自 mattpocock/skills，Copyright (c) 2026 Matt Pocock。见 [LICENSE](./LICENSE)
- **术语表中文解释**：本站原创
- 本站为**非官方**站点，与 Matt Pocock / AI Hero 无隶属关系