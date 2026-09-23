---
title: /grill-me —— 盘问（代码之外）
description: 简版盘问入口，用于非代码场景。它只做一件事：调用 grilling。
---

用 Skill 工具调用 `grilling`。

> **译者注**：这是 `grilling` 的**斜杠命令入口**。上游把它单独拆成一个 skill，
> 是因为它的 `description` 写了 `disable-model-invocation: true`——
> 意思是**只有你主动敲 `/grill-me` 才会触发，agent 不会自己决定调用它**。
>
> 这是刻意的设计：盘问会打断你，所以决定权在你手上。

---

## 安装

**斜杠命令入口**（`disable-model-invocation: true`）：agent 不会自己调用它。`description` 也译成中英双语——它是命令面板里的说明，翻译对中文用户更友好。

```yaml
---
name: grill-me
description: "盘问（代码之外）。简版入口，只做一件事：调用 grilling。A relentless interview to sharpen a plan or design."
disable-model-invocation: true
---
```

原文：[skills/productivity/grill-me/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/productivity/grill-me/SKILL.md)
