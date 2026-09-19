---
title: /research —— 查一手资料
description: 派一个后台 agent 去查一手来源，把结论写成仓库里的一份 Markdown。你继续干别的。
---

起一个**后台 agent** 去做调研，这样它读资料的时候你能继续干活。

它的任务：

1. 针对**一手来源**（官方文档、源码、规范、第一方 API）调查问题，
   而不是读别人转述它们的二手文章。**每条论断都要追溯回拥有它的那个来源。**
2. 把结论写进**一个** Markdown 文件，每条论断标注来源。
3. 存到仓库里已经放这类笔记的地方；沿用已有约定。
   没有约定的话，放个合理的位置，并说明放在了哪。

> **译者注**：这个 skill 的精髓在"一手来源"四个字。
>
> 用 AI 查技术问题时，最大的失败模式是**模型凭记忆答**——
> 答的可能是某个博客、某个旧版本、甚至纯粹是幻觉。
> 要求"追溯回拥有它的那个来源"，等价于强制它去翻官方文档和源码，
> 而且**留下可核查的引用**。
>
> 配合[术语表](/cn-aihero-dev/dictionary/)里的区分看：
> **一手来源（primary source）** = 官方文档 / 源码 / 规范；
> **二手来源（secondary source）** = 博客 / 教程 / 转述。
> 在 AI 编程里这个区分极其关键，因为模型的错误几乎总发生在二手信息的层级。

---

## 安装

`description` 已改为中英双语。

```yaml
---
name: research
description: 针对高可信度的一手来源调查一个问题，把结论落成仓库里的一份 Markdown。Investigate a question against high-trust primary sources and capture the findings as a Markdown file in the repo. Use when the user wants a topic researched, docs or API facts gathered, or reading legwork delegated to a background agent.
---
```

原文：[skills/engineering/research/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/research/SKILL.md)
