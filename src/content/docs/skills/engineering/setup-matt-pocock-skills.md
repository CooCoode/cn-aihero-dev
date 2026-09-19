---
title: /setup-matt-pocock-skills —— 一次性配置
description: 首次使用前跑一次。配好这个仓库的 issue tracker、triage 标签词汇、领域文档布局。其它工程类 skill 都依赖这些配置。
---

# 配置 Matt Pocock 的 Skills

搭好工程类 skill 所假设的**每个仓库一份**的配置：

- **Issue tracker**：issue 住在哪（默认 GitHub；开箱也支持本地 markdown）
- **Triage 标签**：五个规范 triage 角色所用的字符串
- **领域文档**：`CONTEXT.md` 和 ADR 放在哪，以及消费者读取它们的规则

**这是一个由提示词驱动的 skill，不是确定性脚本。**
探索 → 呈现你发现的 → 跟用户确认 → 再写。

## 流程

### 1. 探索

看看当前仓库的初始状态。**读到什么就是什么，不要假设：**

- `git remote -v` 和 `.git/config`：这是 GitHub 仓库吗？哪个？
- 根目录的 `AGENTS.md` 和 `CLAUDE.md`：存在吗？里面已经有 `## Agent skills` 一节吗？
- 根目录的 `CONTEXT.md` 和 `CONTEXT-MAP.md`
- `docs/adr/` 以及任何 `src/*/docs/adr/` 目录
- `docs/agents/`：本 skill 之前的产出已经存在了吗？
- `.scratch/`：本地 markdown issue tracker 约定已在使用的迹象
- **`triage` skill 装了吗？**（本 skill 旁边有个 `triage` 文件夹，或者你的可用 skill 列表里有 `triage`。）
  这决定 B 节到不到底要不要跑。
- 单体仓库信号：`pnpm-workspace.yaml`、`package.json` 里的 `workspaces` 字段，
  或者 `packages/*` 下有自己的 `src/`。**只有真正大型的多包仓库才有这些**；
  没有就意味着单 context，**而几乎所有仓库都是单 context**。

### 2. 呈现发现并提问

总结有什么、缺什么。然后**按节走，一节一个答案，再进下一节**。

每节**先给出推荐答案**，让用户一个字就能接受。
只有当这个选择**真的会分叉**时才给一行解释；
探索已经定下来的节**整节跳过**（`triage` 没装就跳过 B 节，没有单体仓库就跳过 C 节）。

**A 节：Issue tracker。**

> 解释：这里的"issue tracker"指这个仓库的 issue 住在哪。
> `to-tickets`、`triage`、`to-spec` 这类 skill 会读写它。
> 它们需要知道：该调 `gh issue create`、该在 `.scratch/` 下写 markdown 文件，
> 还是走你描述的其他流程。**挑你实际用来跟踪这个仓库工作的地方。**

默认姿态：这些 skill 是为 GitHub 设计的。
`git remote` 指向 GitHub 就提议 GitHub；
指向 GitLab（`gitlab.com` 或自建域名）就提议 GitLab。否则（或用户更想要的话）提供：

- **GitHub**：issue 放在仓库的 GitHub Issues（用 `gh` CLI）
- **GitLab**：issue 放在仓库的 GitLab Issues（用 [`glab`](https://gitlab.com/gitlab-org/cli) CLI）
- **本地 markdown**：issue 作为文件放在本仓库 `.scratch/<feature>/` 下
  （适合单人项目或没有 remote 的仓库）
- **其他**（Jira、Linear 等）：请用户用一段话描述流程，skill 会把它记为自由文本

把选择记进 `docs/agents/issue-tracker.md`。
GitHub 和 GitLab 模板带一个"把 PR 当请求入口"的开关，**默认关闭**。
**保持关闭，也别主动提**：想让外部 PR 进 triage 队列的用户，以后自己改文件里的开关就行。

**B 节：Triage 标签词汇。** `triage` skill 没装就**整节跳过**——没装的 skill 不需要标签。

装了的话，**只问一个问题**：

> 要保留默认的 triage 标签吗？（推荐：**要**）

默认是五个规范角色，每个标签字符串等于它自己的名字：
`needs-triage`、`needs-info`、`ready-for-agent`、`ready-for-human`、`wontfix`。
回答**要**就原样写入。**只有**用户说不——通常是因为他们的 tracker 已用了别的名字
（比如用 `bug:triage` 表示 `needs-triage`）——才收集这些覆盖值，
好让 `triage` 去打已有标签，而不是造重复的。

**C 节：领域文档。** 默认**单 context**（根目录一个 `CONTEXT.md` + `docs/adr/`）。
这适合几乎所有仓库；**不问，直接写**。

**只有**探索发现单体仓库信号时，才提供**多 context**
（根目录一个 `CONTEXT-MAP.md` 指向各 context 的 `CONTEXT.md`）。那就跟用户确认要哪种布局。

### 3. 确认并编辑

给用户看草稿：

- 要加进 `CLAUDE.md` / `AGENTS.md`（改哪个见第 4 步的选择规则）的 `## Agent skills` 块
- `docs/agents/issue-tracker.md`、`docs/agents/domain.md`、
  `docs/agents/triage-labels.md` 的内容（最后一个只在装了 `triage` 时）

**让用户在写入前过一遍、改一改。**

### 4. 写入

**挑要改的文件：**

- `CLAUDE.md` 存在 → 改它。
- 否则 `AGENTS.md` 存在 → 改它。
- 都不存在 → 问用户要建哪个；**不要替他决定**。

**`CLAUDE.md` 已存在时绝不新建 `AGENTS.md`**（反之亦然）；永远改已经存在的那个。

选中的文件里已有 `## Agent skills` 块，就**就地更新内容**，不要再追加一个重复的。
不要覆盖用户对周边章节的修改。

那个块：

```markdown
## Agent skills

### Issue tracker

[一行说明 issue 在哪跟踪]。见 `docs/agents/issue-tracker.md`。

### Triage labels

[一行说明标签词汇]。见 `docs/agents/triage-labels.md`。

### Domain docs

[一行说明布局："single-context" 或 "multi-context"]。见 `docs/agents/domain.md`。
```

**只有当 `triage` 装了、B 节跑过时**，才包含 `### Triage labels` 子块并写
`docs/agents/triage-labels.md`。没装的话两者都省略。

然后用本 skill 目录里的种子模板作为起点写那些文档文件：

- `issue-tracker-github.md`：GitHub issue tracker
- `issue-tracker-gitlab.md`：GitLab issue tracker
- `issue-tracker-local.md`：本地 markdown issue tracker
- `triage-labels.md`：标签映射（只在装了 `triage` 时）
- `domain.md`：领域文档的消费者规则 + 布局

"其他" tracker 就按用户的描述从头写 `docs/agents/issue-tracker.md`。

### 5. 完成

告诉用户配置完成，以及哪些工程类 skill 现在会读这些文件。
提一句：以后可以直接编辑 `docs/agents/*.md`；
**只有**想换 issue tracker 或从头重来时才需要重跑本 skill。

---

## 安装

**这是斜杠命令入口，`description` 不建议翻译。装完之后第一件事就是跑它。**

```yaml
---
name: setup-matt-pocock-skills
description: "Configure this repo for the engineering skills: set up its issue tracker, triage label vocabulary, and domain doc layout. Run once before first use of the other engineering skills."
disable-model-invocation: true
---
```

原文：[skills/engineering/setup-matt-pocock-skills/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/setup-matt-pocock-skills/SKILL.md)
