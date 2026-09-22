# 源站 UI 交互与动效规格

对 aihero.dev 的交互与动效做**定量**拆解，用于本站实现对齐。

数据来源：源站产物的 CSS（`_next/static/chunks/*.css`）+ Playwright 实测计算样式。
所有数值都是读出来的，不是目测的。

---

## 一、缓动曲线（源站只用了 5 条）

```
--ease-out-quart : cubic-bezier(.22, 1, .36, 1)     ← 位移主力，出现 52 次
--ease-out       : cubic-bezier(0, 0, .2, 1)
--ease-in-out    : cubic-bezier(.4, 0, .2, 1)        ← Tailwind 默认，颜色过渡用
default          : cubic-bezier(.4, 0, .2, 1)        ← --default-transition-timing-function
--ease-quint     : cubic-bezier(.23, 1, .32, 1)      ← 少量面板过渡
--ease-quad-io   : cubic-bezier(.65, 0, .35, 1)      ← 资源卡边框收拢，5 处
```

## 二、时长（源站只用了 5 档）

| 时长 | 用途 | 出现次数 |
| --- | --- | --- |
| **150ms** | `--default-transition-duration`，**所有颜色过渡** | 默认，最多 |
| 200ms | 折叠面板 `collapsible-down` | 2 |
| **300ms** | **所有位移过渡** | 58 |
| 400ms | 资源卡边框收拢 | 5 |
| 500ms | 个别 transform | 2 |

### 核心结论：两档过渡体系

这是源站手感的关键，也是最容易做错的地方：

| 类型 | 属性 | 时长 | 缓动 |
| --- | --- | --- | --- |
| **颜色** | `color, background-color, border-color` | **150ms** | `cubic-bezier(.4, 0, .2, 1)` |
| **位移** | `transform, translate, scale, rotate` | **300ms** | `cubic-bezier(.22, 1, .36, 1)` |

颜色快、位移慢。**不要统一成 300ms**——那会让悬停变迟钝。
实测：金色 CTA 悬停 `#f5c451 → #eab534`，耗时 150ms。

---

## 三、组件交互清单

### 1. 文本链接

```
悬停: color: --muted-foreground → --foreground
过渡: transition-colors（150ms / cubic-bezier(.4,0,.2,1)）
无下划线变化、无位移
```
实测：`rgba(20,22,26,0.7)` → `rgb(20,22,26)`。

### 2. 图标按钮（搜索/主题切换一类）

源站原文：
```
size-9 rounded-[7px] opacity-70 hover:opacity-100
hover:bg-foreground/[0.06] transition
focus-visible:ring-2 focus-visible:ring-ring
dark:opacity-60 dark:hover:opacity-100
```

量化：
| 项 | 值 |
| --- | --- |
| 尺寸 | 36×36px（`size-9`） |
| 圆角 | 7px |
| 常态不透明度 | 0.7（暗色 0.6） |
| 悬停不透明度 | 1 |
| 悬停底色 | `foreground @ 6%` |
| 焦点环 | 2px，色 `--ring` |
| 过渡 | 150ms 默认 |

### 3. 金色主按钮

| 项 | 值 |
| --- | --- |
| 底色 | `--accent-fill` `#f5c451` |
| 悬停底色 | `--accent-fill-hover` `#eab534`（暗色 `#ffd873`） |
| 文字 | `--accent-fill-foreground` `#191510` |
| 圆角 | 8px |
| 内边距 | 8px 14px |
| 字号 / 字重 | 13px / 700 |
| 过渡 | 150ms 仅 `background-color` |

### 4. 描边按钮（出现 25 次，是最常见的按钮样式）

```
hover:bg-foreground hover:border-foreground hover:text-background transition-colors
```
**悬停时整块反色**：底色变前景色，文字变背景色。150ms。
这是源站最抓眼的交互之一——不是变浅，是**整块翻转**。

### 5. 箭头位移（出现 26 次）

```
duration-300 ease-out-quart group-hover:translate-x-1
motion-reduce:transform-none motion-reduce:transition-none transition-transform
```
| 项 | 值 |
| --- | --- |
| 位移量 | `translate-x-1` = **4px** |
| 时长 | 300ms |
| 缓动 | `cubic-bezier(.22,1,.36,1)` |
| 触发 | 父级 `group:hover` |
| 降级 | `prefers-reduced-motion` 时取消位移与过渡 |

### 6. 资源卡边框收拢（`.resource-hover-frame-*`）

两层绝对定位覆盖层，悬停时：

```css
.resource-hover-frame-gradient {
  opacity: 0;
  transition: opacity .4s cubic-bezier(.65, 0, .35, 1);
}
.resource-hover-frame-surface {
  transition: top .4s cubic-bezier(.65,0,.35,1), right .4s …, bottom .4s …, left .4s …;
}
.group\/resource:hover .resource-hover-frame-gradient { opacity: 1 }
.group\/resource:hover .resource-hover-frame-surface  { inset: 5px }
```

量化：渐变层 400ms 淡入；内层 `inset` 从 `0` 收到 **5px**，四条边各自 400ms 同曲线。
效果是**一圈边框向内收拢**。零 JS。

### 7. 吉祥物雪碧图（`.aihero-mascot`）

```css
.aihero-mascot {
  width: var(--aihero-size, 32px);
  height: var(--aihero-size, 32px);
  background-image: var(--aihero-sprite-url);
  background-size: calc(var(--aihero-size) * 6) calc(var(--aihero-size) * 5); /* 6 列 × 5 行 */
  background-position: 0 0;
  image-rendering: pixelated;   /* 像素画 */
  display: inline-block;
}
.group:hover .aihero-mascot, .aihero-mascot:hover {
  animation: .86s steps(6, end) infinite aihero-idle;
}
@keyframes aihero-idle {
  0%  { background-position: 0 0 }
  to  { background-position: calc(var(--aihero-size, 32px) * -6) 0 }
}
```

量化：**6 帧**（一次横向滚动 6 格）、`steps(6, end)` 阶跃（不要用线性，像素画必须阶跃）、
**860ms** 一轮、`infinite`、**仅在悬停时播放**（离开即停在第 0 帧）。

### 8. 图标/文字轮播（`.ah-agent-cycle`）

```css
.ah-agent-cycle > svg {
  opacity: 0;
  animation-name: ah-agent-cycle;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}
.ah-agent-cycle > svg:first-child { opacity: 1 }
@keyframes ah-agent-cycle {
  0%      { opacity: 0; transform: translateY(2px) }
  4%, 21% { opacity: 1; transform: none }
  25%, to { opacity: 0; transform: translateY(-2px) }
}
```

量化：每个子元素占用周期的 **25%**；其中 0–4% 淡入（从下方 2px 上来）、
4–21% 保持、21–25% 淡出（向上 2px 走）。线性缓动。
`first-child` 预设 `opacity:1` 避免首屏空白。

### 9. 骨架屏扫光

```css
animation: 1.6s ease-in-out infinite ah-skeleton-sweep;
background-size: 220% 100%;
@keyframes ah-skeleton-sweep { 0% { background-position: -110% 0 } to { background-position: 210% 0 } }
```
量化：**1.6s**、`ease-in-out`、背景尺寸 220%、从 -110% 扫到 210%。

### 10. 滚动遮罩（`.scroll-fade`）——纯 CSS 滚动驱动，零 JS

```css
@property --scroll-fade-top    { syntax: "<length>"; inherits: false; initial-value: 0 }
@property --scroll-fade-bottom { syntax: "<length>"; inherits: false; initial-value: 0 }

.scroll-fade {
  --scroll-fade-size: 1.75rem;          /* 28px */
  mask-image: linear-gradient(to bottom,
    transparent 0, #000 var(--scroll-fade-top),
    #000 calc(100% - var(--scroll-fade-bottom)), transparent 100%);
  animation: linear both scroll-fade-top, linear both scroll-fade-bottom;
  animation-timeline: scroll(self), scroll(self);
  animation-range: 0 var(--scroll-fade-size),
                   calc(100% - var(--scroll-fade-size)) 100%;
}
@keyframes scroll-fade-top    { 0% { --scroll-fade-top: 0px }    to { --scroll-fade-top: var(--scroll-fade-size) } }
@keyframes scroll-fade-bottom { 0% { --scroll-fade-bottom: var(--scroll-fade-size) } to { --scroll-fade-bottom: 0px } }
```

量化：淡出高度 **28px**；**在滚动到顶/底时遮罩自动归零**（这就是那两个 keyframe 的作用），
所以内容贴边时不会出现无意义的渐隐。用 `animation-timeline: scroll(self)` 由滚动位置驱动，
**不需要 IntersectionObserver 或 scroll 监听**。

⚠️ 需要 `@property` + `animation-timeline` 支持。降级方案见实现节。

### 11. 折叠面板

```css
animate-collapsible-down / -up
animation: collapsible-down var(--tw-duration, .2s) var(--tw-ease, ease-out) …
@keyframes collapsible-down { 0% { height: 0 } to { height: var(--…-content-height) } }
```
量化：**200ms**、`ease-out`、对 `height` 做动画（需要知道内容高度）。

---

## 四、可访问性：全站 `prefers-reduced-motion` 守卫

源站在**每一个**位移动画上都挂了降级类，用法是固定的两条：

```
motion-reduce:transform-none
motion-reduce:transition-none
```

CSS 侧：
```css
@media (prefers-reduced-motion: reduce) {
  .group:hover .aihero-mascot, .aihero-mascot:hover { animation: none }
  .resource-hover-frame-gradient, .resource-hover-frame-surface { transition: none }
  .ah-agent-cycle > svg { animation: none }
}
```

**这是源站最值得学的一点**：降级不是"全局关掉动画"，而是**逐个组件关掉，且保留状态变化本身**
（颜色照变、位移取消）。本站目前只有一个全局 `animation-duration: 0.01ms` 粗暴方案，要按这个改。

焦点环：
```
focus-visible:ring-2 focus-visible:ring-ring    /* 2px，色 --ring */
focus-visible:outline-none
```

---

## 五、本站实现映射

| 源站 | 本站实现 | 文件 |
| --- | --- | --- |
| 两档过渡 | `@theme` 暴露 `--ease-out-quart`；工具类 `ah-t` / `ah-move` | `global.css` |
| 文本链接 | `ah-link` | `global.css` |
| 图标按钮 | `ah-icon-btn` | `global.css` |
| 金色按钮 | `ah-btn-primary`（已有，补 150ms） | `global.css` |
| 描边反色按钮 | `ah-btn-ghost`（**改为反色**，当前只是变浅） | `global.css` |
| 箭头位移 | `ah-arrow`（`group` 悬停时 +4px） | `global.css` |
| 资源卡边框收拢 | `ah-frame` + `.ah-frame-glow` / `.ah-frame-inset` | `global.css` + 卡片组件 |
| 吉祥物 | 无雪碧图素材 → 用 CSS 阶跃动画做 logo 标记，机制相同 | `global.css` |
| 图标轮播 | 暂不用（本站没有需要轮播的图标列） | — |
| 骨架屏 | 暂不用（无异步加载内容） | — |
| 滚动遮罩 | `ah-scrollfade`，用在侧栏与目录 | `global.css` + Sidebar / Article |
| 折叠面板 | `details` 的内容高度动画 | `global.css` + Sidebar |

### 明确不做的

- **图标轮播、骨架屏**：本站没有对应场景，加了就是无意义动效。
- **吉祥物雪碧图**：源站是自己的像素画素材，不能复制。只实现"悬停触发的阶跃动画"这个机制。
- **滚动显现（reveal on scroll）**：源站根本没有。不要加。

---

## 六、降级策略

| 特性 | 支持情况 | 降级 |
| --- | --- | --- |
| `animation-timeline: scroll()` | Chrome 115+ / Safari 26+ | 无遮罩，直接显示（`@supports` 包裹） |
| `@property` | 主流均已支持 | 同上 |
| `mask-image` | 主流均已支持，需 `-webkit-` 前缀 | 无遮罩 |
| `::details-content` | Chrome 131+ / Safari 18.4+ / FF 139+ | 无高度过渡，瞬间展开 |

滚动遮罩必须包在 `@supports (animation-timeline: scroll())` 里，
否则不支持的浏览器会拿到一个 `--ah-fade-top` 恒为 0 的渐变——
那反而比没有遮罩更糟（内容被永久压暗）。

---

## 七、实现过程中实测到的两个坑

以下都是**实测发现**的，不是看文档推的。单独记下来是因为它们都会**静默失效**：
不报错、构建通过、页面能开，只是效果没了。

### 坑 1：`<details>` 不能用 grid-template-rows 做高度动画

网上流行的写法：

```css
details > .wrap { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 200ms }
details[open] > .wrap { grid-template-rows: 1fr }
```

**对 `<details>` 无效。** 因为 `details` 关闭时内容节点根本不渲染，过渡无从发生。

实测（点击展开后每 25ms 采一次高度）：

| 方案 | 高度采样 | 结果 |
| --- | --- | --- |
| `grid-template-rows` | `208 → 208 → 208 → 208` | ✗ 瞬时跳变 |
| `::details-content` | `71 → 130 → 166 → 178 → 196 → 205 → 208` | ✓ 200ms ease-out 曲线 |

正确写法：

```css
@supports selector(::details-content) {
  :root { interpolate-size: allow-keywords; }   /* 没有它就不能动画到 auto */
  details::details-content {
    block-size: 0;
    overflow: hidden;
    transition: block-size 200ms var(--ease-out), content-visibility 200ms allow-discrete;
  }
  details[open]::details-content { block-size: auto; }
}
```

比源站的方案更简单：他们用 JS 测量内容高度（`--radix-collapsible-content-height`）
再动画到那个值，原生方案不需要测量。

### 坑 2：Lightning CSS 会把滚动动画压成非法 CSS

源站把 `animation` 和 `animation-timeline` 写成**两条独立声明**：

```css
animation: linear both scroll-fade-top, linear both scroll-fade-bottom;
animation-timeline: scroll(self), scroll(self);
```

这不是风格选择，是**必需的**。因为：

```js
CSS.supports('animation', 'linear both foo scroll(self)')  // false
const d = document.createElement('div');
d.style.animation = 'linear both foo scroll(self)';
d.style.animation                                 // ""  ← 整条被丢弃
```

**Chrome 不接受在 `animation` 简写里写时间线。**

而 Astro 默认的 CSS 压缩器 Lightning CSS 会把上面那两条合并成简写：

```css
/* 压缩后 —— 浏览器直接丢弃，animation-name 回退为 none */
animation: linear both ah-fade-top scroll(self), linear both ah-fade-bottom scroll(self);
```

结果：遮罩的 `mask-image` 照常生效（所以看上去“有遮罩”），
但 `--ah-fade-top` 永远是初始值 28px，**永远不随滚动变化**。很难发现。

修法（`astro.config.mjs`）：

```js
vite: { build: { cssMinify: 'esbuild' } }   // esbuild 不做这种合并
```

验证方法：在浏览器里查 `getComputedStyle(el).animationName`，
如果是 `none` 而 `animation-timeline` 是 `auto`，就是踩了这个坑。


### 坑 3：移动端 `display: grid` 被宽 `pre` 撑爆

三栏布局写成这样是错的：

```html
<!-- 错：移动端也是 grid -->
<div class="grid lg:grid-cols-[236px_minmax(0,1fr)]">
```

移动端没有 `lg:grid-cols-*`，就变成 `display: grid` + 一条隐式 `auto` 轨道。
`auto` 轨道的下限是内容的 **min-content**，而一个 `pre`（`scrollWidth` 实测 **2121px**）
会把轨道撑到 **711px**，而容器只有 **354px**。

结果：整页横向溢出，标题被截断，手机上要左右拖才能读。

实测（390px 视口，修复前后）：

| | `scrollWidth` |
| --- | --- |
| 修复前 | 472（头部）+ 711（正文） |
| 修复后 | 390 = 视口宽 ✓ |

两个修法，都要做：

```html
<!-- 1. grid 只在 lg 以上生效 -->
<div class="lg:grid lg:grid-cols-[236px_minmax(0,1fr)]">
  <!-- 2. 网格子项加 min-w-0，否则 min-content 仍然顶出去 -->
  <article class="min-w-0 ...">
```

另外 prose 层加了三道保险，缺任何一道都会被某页撑爆：

```css
.ah-prose {
  overflow-wrap: break-word;   /* 长 URL / 标识符断行 */
  & pre   { max-width: 100%; overflow-x: auto }   /* 代码块自己滚 */
  & table { display: block; overflow-x: auto }    /* 宽表格自己滚 */
  & img   { max-width: 100%; height: auto }
}
```

`overflow-wrap` 这条不是可选的：`/about/` 里一条长 URL
（`github.com/mattpocock/skills/blob/main/LICENSE`，47 字符不可断行）
单独让那一页溢出 8px。

### 顺带：移动端导航

源站在移动端把导航收进汉堡菜单，不是压缩内联导航。
用原生 `<details>` 实现，零 JS，还能复用已有的 `::details-content` 动画。

注意 `::details-content` 的规则要**限定作用域**（`.ah-collapse`），
写全局的 `details::details-content` 会裁掉移动菜单里绝对定位的下拉面板。

### 顺带一提：源站的 `scroll-fade` 为什么值得学

它用 `animation-timeline: scroll(self)` 把遮罩高度绑到滚动位置，
**不需要 `IntersectionObserver`、不需要 scroll 监听、不需要 JS**，
而且因为用了 `@property` 注册的变量，滚动到两端时遮罩能平滑归零。
一个纯 CSS 方案解决了“滚动容器边缘渐隐”这个通常要靠 JS 做的事。
