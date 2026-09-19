---
title: /scaffold-exercises —— 搭练习题骨架
description: 生成带 section、problem/solution/explainer 的练习目录结构，并保证通过 lint。给课程仓库用的。
---

# 搭练习题骨架

生成能通过 `pnpm ai-hero-cli internal lint` 的练习目录结构，然后用 `git commit` 提交。

> **注意**：这个 skill 依赖 `pnpm ai-hero-cli`——AI Hero 课程仓库自己的工具链。
> 只在同一套课程体系里有用，别的地方参考它的思路即可。

## 目录命名

- **Section**：`exercises/` 下的 `XX-section-name/`（例如 `01-retrieval-skill-building`）
- **Exercise**：section 下的 `XX.YY-exercise-name/`（例如 `01.03-retrieval-with-bm25`）
- section 编号 = `XX`，exercise 编号 = `XX.YY`
- 名字用 dash-case（小写、连字符）

## 练习变体

每个练习至少要有下面这些子目录之一：

- `problem/` —— 学生工作区，带 TODO
- `solution/` —— 参考实现
- `explainer/` —— 概念材料，没有 TODO

搭骨架时**默认用 `explainer/`**，除非计划里另有说明。

## 必需文件

每个子目录（`problem/`、`solution/`、`explainer/`）都需要一个 `readme.md`，它：

- **不能是空的**（必须有真实内容，哪怕只有一行标题都行）
- 没有坏链

搭骨架时创建一个最小的 readme，带标题和描述：

```md
# Exercise Title

Description here
```

子目录里有代码的话，还需要一个 `main.ts`（超过 1 行）。
但搭骨架阶段，只有 readme 的练习是完全可以的。

## 工作流

1. **解析计划** —— 提取 section 名、exercise 名、变体类型
2. **创建目录** —— 对每条路径 `mkdir -p`
3. **创建 readme 骨架** —— 每个变体目录一个带标题的 `readme.md`
4. **跑 lint** —— `pnpm ai-hero-cli internal lint` 验证
5. **修错** —— 反复迭代直到 lint 通过

## Lint 规则概要

linter（`pnpm ai-hero-cli internal lint`）检查：

- 每个练习都有子目录（`problem/`、`solution/`、`explainer/`）
- `problem/`、`explainer/`、`explainer.1/` 至少存在一个
- 主子目录里 `readme.md` 存在且非空
- 没有 `.gitkeep` 文件
- 没有 `speaker-notes.md` 文件
- readme 里没有坏链
- readme 里没有 `pnpm run exercise` 命令
- 每个子目录需要 `main.ts`，除非它只有 readme

## 移动 / 重命名练习

给练习重新编号或移动时：

1. **用 `git mv`（不是 `mv`）** 重命名目录 —— 保住 git 历史
2. 更新数字前缀，维持顺序
3. 移动后重跑 lint

例子：

```bash
git mv exercises/01-retrieval/01.03-embeddings exercises/01-retrieval/01.04-embeddings
```

## 例子：从计划搭骨架

给定这样一份计划：

```
Section 05: Memory Skill Building
- 05.01 Introduction to Memory
- 05.02 Short-term Memory (explainer + problem + solution)
- 05.03 Long-term Memory
```

创建：

```bash
mkdir -p exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer
mkdir -p exercises/05-memory-skill-building/05.02-short-term-memory/{explainer,problem,solution}
mkdir -p exercises/05-memory-skill-building/05.03-long-term-memory/explainer
```

然后创建 readme 骨架：

```
exercises/05-memory-skill-building/05.01-introduction-to-memory/explainer/readme.md -> "# Introduction to Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/explainer/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/problem/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.02-short-term-memory/solution/readme.md -> "# Short-term Memory"
exercises/05-memory-skill-building/05.03-long-term-memory/explainer/readme.md -> "# Long-term Memory"
```

> **译者注**：这个 skill 里有一条通用性最高的技巧：
> **把 lint 当作完成条件的判据，而不是自己判断"搭好了"。**
>
> 骨架搭没搭对没法靠眼睛看——它有七八条约束（目录命名、变体组合、
> readme 非空、没有 `.gitkeep`、没有坏链……）。
> 人的做法是对着规则逐条核对，容易漏；
> 这里的做法是**把规则写成 linter，然后"跑 lint 直到通过"就是完成**。
>
> 这正好是 [writing-for-agents](/cn-aihero-dev/skills/productivity/writing-for-agents/)
> 说的**最强完成条件：既可检查，又穷尽**。
> 也是 [tdd](/cn-aihero-dev/skills/engineering/tdd/) 里"用可执行的检查代替人眼"的同一个思路。
>
> 另外 `git mv` 那条不是小事：用 `mv` 会让 git 认为文件被删了又新建，
> 历史断掉；`git mv` 保住 blame 和历史。

---

## 安装

`description` 已改为中英双语。

```yaml
---
name: scaffold-exercises
description: 生成带 section、problem/solution/explainer 的练习目录结构，并保证通过 lint。Create exercise directory structures with sections, problems, solutions, and explainers that pass linting. Use when user wants to scaffold exercises, create exercise stubs, or set up a new course section.
---
```

原文：[skills/misc/scaffold-exercises/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/misc/scaffold-exercises/SKILL.md)
