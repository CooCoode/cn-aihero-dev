---
title: /code-review —— 双轴代码审查
description: 对照「标准」与「规格」两条独立轴线审查改动，两条线在并行子智能体中跑，结果并排呈现，互不掩盖。
---

对 `HEAD` 与用户给定的**固定点**之间的 diff 做双轴审查：

- **标准（Standards）**：代码符不符合这个仓库文档化的编码规范？
- **规格（Spec）**：代码有没有忠实实现它要解决的那个 issue / 规格？

两条轴跑在**并行子智能体（subagent）**里，免得互相污染上下文，最后由本 skill 汇总。

issue tracker 应该已经给你配好了。如果没有 `docs/agents/issue-tracker.md`，
让用户跑 `/setup-matt-pocock-skills`。

## 流程

### 1. 定住固定点

用户说的任何东西都可以当固定点（commit SHA、分支名、tag、`main`、`HEAD~5` 等）。
他要是没说，就问他。

把 diff 命令固定下来：`git diff <固定点>...HEAD`（**三个点**，这样是跟 merge-base 比）。
同时记下提交列表：`git log <固定点>..HEAD --oneline`。

往下走之前，先确认固定点能解析（`git rev-parse <固定点>`）且 diff 非空。
**引用错了或者 diff 是空的，要在这里就失败**，不要等进了两个并行子智能体才炸。

### 2. 找到规格来源

按这个顺序找原始规格：

1. commit message 里的 issue 引用（`#123`、`Closes #45`、GitLab 的 `!67` 等），
   用 `docs/agents/issue-tracker.md` 里的流程取。
2. 用户当参数传进来的路径。
3. `docs/`、`specs/`、`.scratch/` 下、文件名匹配分支名或功能名的规格文件。
4. 都找不到就问用户规格在哪。他说没有，**规格**子智能体就跳过，报告"无可用规格"。

### 3. 找到标准来源

仓库里任何记录"代码该怎么写"的文件，比如 `CODING_STANDARDS.md` 或 `CONTRIBUTING.md`。

除了仓库自己文档化的内容，**标准**轴永远还带着下面这份**坏味道基线**：
一组固定的 Fowler 代码坏味道（《重构》第 3 章），即使仓库什么都没写也适用。
两条规则约束它：

- **仓库优先。** 仓库文档化的标准永远赢；它认可的东西如果基线要报，就把这条坏味道压掉。
- **永远只是判断，不是断言。** 每条坏味道都是带标签的启发式（"疑似 Feature Envy"），
  绝不是硬性违规。和这里所有标准一样，工具已经能管的东西就别报。

每条坏味道按 *它是什么* → *怎么修* 来读，然后拿它去对照 diff：

- **神秘命名（Mysterious Name）**：函数、变量或类型名看不出它在做什么、存什么。→ 改名；
  要是想不出一个诚实的名字，说明设计本身是糊的。
- **重复代码（Duplicated Code）**：同一段逻辑形状出现在本次改动的多个 hunk 或文件里。→ 抽出共享形状，两边都调它。
- **依恋情结（Feature Envy）**：方法访问别人对象的数据比自己还多。→ 把方法搬到它羡慕的那份数据上。
- **数据泥团（Data Clumps）**：同几个字段或参数老是一起出现（一个想出生的类型）。→ 打包成一个类型，传那个。
- **基本类型偏执（Primitive Obsession）**：用基本类型或字符串顶替一个值得有自己的类型的领域概念。→ 给这个概念一个小类型。
- **重复的 switch（Repeated Switches）**：同一个类型上的 `switch` / `if` 级联在改动里反复出现。→ 换成多态，或者两处共享一个映射表。
- **霰弹式修改（Shotgun Surgery）**：一个逻辑变更逼得 diff 里一堆文件零散改。→ 把总是一起变的东西收进一个模块。
- **发散式变化（Divergent Change）**：一个文件或模块因为好几个不相关的原因被改。→ 拆开，让每个模块只因一个原因而变。
- **夸夸其谈通用性（Speculative Generality）**：为规格里根本没有的需求加的抽象、参数或钩子。→ 删掉，内联回去，等真需求出现再说。
- **过长的消息链（Message Chains）**：调用方不该依赖的长链导航 `a.b().c().d()`。→ 用第一个对象上的一个方法把这段走位藏起来。
- **中间人（Middle Man）**：一个类或函数基本只是往下转发。→ 砍掉，直接调真正的目标。
- **被拒绝的遗赠（Refused Bequest）**：子类或实现类忽略/改写了它继承来的大部分东西。→ 放弃继承，改用组合。

### 4. 并行启动两个子智能体

**标准子智能体的 prompt** 要包含：

- 完整的 diff 命令和提交列表。
- 第 3 步找到的标准来源文件清单，**外加第 3 步那份坏味道基线全文粘进去**（子智能体没有别的途径拿到它）。
- 任务书："逐文件/逐 hunk 报告：(a) diff 违反哪条文档化标准的地方——引用该标准（文件 + 规则）；
  (b) 你发现的任何基线坏味道——报出名字并引用该 hunk。
  区分硬性违规和主观判断：违反文档化标准可以是硬性的，但基线坏味道永远是主观判断，
  而且仓库文档化的标准优先于基线。工具能管的东西跳过。400 字以内。"

**规格子智能体的 prompt** 要包含：

- diff 命令和提交列表。
- 规格的路径或抓取到的内容。
- 任务书："报告：(a) 规格要求但缺失或只做了一半的需求；(b) diff 里没被要求的行为（范围蔓延）；
  (c) 看起来做了、但实现看着不对劲的需求。每条结论引用规格原文行。400 字以内。"

规格缺失就跳过**规格**子智能体，并在最终报告里说明。

### 5. 汇总

把两份报告分别放在 `## 标准` 和 `## 规格` 标题下，原文照登或轻度清理。
**不要**把两边的结论合并或重排序——两条轴是刻意分开的（见 _为什么要两条轴_）。

结尾给一行总结：每条轴各有多少条结论，以及**每条轴内**最严重的问题（如果有）。
**不要跨轴选出一个总冠军**——交叉重排正是这个分离设计要防的事。

## 为什么要两条轴

一个改动可以过一条轴、挂另一条：

- 每条标准都遵守，但做错了事 → **标准过，规格挂。**
- 完全按 issue 要求做，但破坏了项目约定 → **规格过，标准挂。**

分开报告，一条轴就不会掩盖另一条。

---

## 安装

`description` 已改为中英双语，用中文也能触发。

```yaml
---
name: code-review
description: "对照标准与规格双轴审查改动。Review the changes since a fixed point (commit, branch, tag, or merge-base) along two axes: Standards and Spec. Runs both reviews in parallel sub-agents and reports them side by side. Use when the user wants to review a branch, a PR, work-in-progress changes, or asks to \"review since X\"."
---
```

原文：[skills/engineering/code-review/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/code-review/SKILL.md)
