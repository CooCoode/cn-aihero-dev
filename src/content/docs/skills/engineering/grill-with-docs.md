---
title: /grill-with-docs —— 盘问 + 顺手产出文档
description: 最推荐的入口。既做盘问，又在过程中把共享语言写成文档（ADR 与术语表）。同时解决「agent 做错事」和「agent 太啰嗦」两个问题。
---

用 Skill 工具调用**两次**：一次 `grilling`，一次 `domain-modeling`。

> **译者注**：这是 Matt 说"可能是整个仓库里最酷的技术"的那个 skill。
> 它把两件事合在一起：
>
> 1. **盘问**——动手前先被追问到位，解决"agent 做的不是我想要的"
> 2. **领域建模**——顺手把讨论中定下来的词汇写成 `CONTEXT.md`（共享语言）和 ADR（难解释的决策）
>
> 为什么共享语言能治啰嗦：agent 通常被扔进一个项目，边干边猜黑话，
> 于是用 20 个词说 1 个词能说完的事。建立共享语言之后：
>
> - 变量、函数、文件名用同一套词命名，**代码库对 agent 更好导航**
> - agent **花在思考上的 token 也更少**，因为它有一套更简洁的语言可用
>
> 官方给的对照例子——同一个问题，哪种更好读？
>
> - **之前**："There's a problem when a lesson inside a section of a course is made 'real'
>   (i.e. given a spot in the file system)"
> - **之后**："There's a problem with the materialization cascade"
>
> 这种简洁性会在一个又一个会话里持续兑现。

---

## 安装

**这个 skill 是斜杠命令入口，`description` 不建议翻译。**

```yaml
---
name: grill-with-docs
description: A relentless interview to sharpen a plan or design, which also creates docs (ADR's and glossary) as we go.
disable-model-invocation: true
---
```

它依赖另外两个 skill 一起装：[grilling](/cn-aihero-dev/skills/productivity/grilling/) 和
[domain-modeling](/cn-aihero-dev/skills/engineering/domain-modeling/)。

原文：[skills/engineering/grill-with-docs/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/grill-with-docs/SKILL.md)
