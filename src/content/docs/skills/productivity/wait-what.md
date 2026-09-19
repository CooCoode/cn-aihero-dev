---
title: /wait-what —— 重讲一遍
description: 上一句话没听懂？让它用简化技术英语重讲，并改用项目共享语言。上下文快爆时的急救手段。
---

等等，我没看懂你是怎么走到这一步的。重讲一遍：给我一点上下文，
用 **ASD-STE100 简化技术英语（Simplified Technical English）** 说，
并且使用 `CONTEXT.md` 里的共享语言（仓库里有多个 `CONTEXT.md` 的话，按 `CONTEXT-MAP.md` 找到对的那个）。

> **译者注**：这个 skill 只有一个斜杠命令，没有正文逻辑，但它是**最实用的小工具之一**。
>
> 它的价值集中在两点：
>
> 1. **ASD-STE100** 是航空业的受控英语标准，词汇量约 900 词、一句话一个意思、
>    禁止嵌套从句。模型对它有很强的先验——一句话就能让它从"学术腔"切到"说明书腔"。
> 2. **强制使用 `CONTEXT.md`** 而不是自己现编术语，正好逼 agent 回到项目的共享语言上。
>
> 什么时候用：不是"看不懂英文"，而是**它把话说糊了**的时候。
> 模型解释得又长又绕，通常是它自己也没想清楚——这时它重讲一遍往往就露馅了。

---

## 安装

`description` 已改为中英双语。

```yaml
---
name: wait-what
description: "停下。上一条消息没讲清楚：重讲一遍。Stop. That last message did not land: re-pitch it."
disable-model-invocation: true
---
```

原文：[skills/productivity/wait-what/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/productivity/wait-what/SKILL.md)
