---
title: /handoff —— 交接给下一个会话
description: 上下文快满时，把当前对话压成一份交接文档，让全新的 agent 能接着干。
---

写一份交接文档，总结当前对话，好让一个全新的 agent 接着干。
**存到操作系统的临时目录里——不要存在当前工作区。**

文档里要有一节 **"建议使用的 skills"**，点名下一个 agent 应该用 Skill 工具调用哪些 skill。

**不要重复已经存在于其他产物里的内容**（规格、计划、ADR、issue、commit、diff）。
要用路径或 URL 引用它们。

**抹掉任何敏感信息**，比如 API key、密码、个人身份信息。

如果用户传了参数，就把它们当作对"下一个会话要干什么"的描述，据此裁剪文档。

> **译者注**：为什么存临时目录而不是工作区？
>
> 因为交接文档是**一次性的**。放进工作区就会变成一堆没人删的 `HANDOFF.md`，
> 还会被下一轮 agent 当成项目文档读进去——反而污染上下文。
>
> 另外注意"不要重复已有产物"这条：它和 agent 的本能相反。
> agent 天然想把所有上下文都抄进文档，结果交出一份几千字、
> 每条信息都能从别处找到的东西。**引用，不要复述。**

---

## 安装

`description` 已改为中英双语。

```yaml
---
name: handoff
description: 把当前对话压缩成交接文档，供另一个 agent 接续。Compact the current conversation into a handoff document for another agent to pick up.
argument-hint: "What will the next session be used for?"
disable-model-invocation: true
---
```

原文：[skills/productivity/handoff/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/productivity/handoff/SKILL.md)
