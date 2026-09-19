---
title: /grilling —— 盘问
description: 把设计当成一棵树，按轮次追问「前沿」上的决策。这是所有盘问类 skill 的底层机制。
---

不停地访谈用户，直到你们达成共识。把这件事建模成一棵**设计树（design tree）**：
每个决策都会分叉出挂在它下面的一串决策。

按**轮次（round）**处理这棵树。**前沿（frontier）**是指那些前提条件已经全部落定的决策：
也就是你**现在就能问**、不需要猜测还没听到的答案的那些问题。
一轮里把整个前沿都问完：每个问题编号，并给出你推荐的答案。然后**等用户回答**再进下一轮。

一轮的格式长这样：

```
❓ **Q1** - **<问题标题>**: <问题正文，可以多段，可以包含多个选项>

➡️ <你推荐的答案>

---

❓ **Q2** - **<问题标题>**: <问题正文，可以多段，可以包含多个选项>

➡️ <你推荐的答案>
```

用户每轮的回答都会重塑这棵树：已定的决策把前沿往外推，解锁依赖它们的问题。
重新计算前沿，再问下一轮。
**如果某个问题的答案依赖于同轮里另一个还没答的问题，它就属于后面的轮次，不属于这一轮。**

**找事实是你的工作，永远不是用户的。** 当前沿上的问题需要环境里的一个事实时
（文件系统、工具等），派一个 subagent 去查；**不要问用户任何你自己能查到的东西。**
不要因此阻塞：一个正在跑的探查就是一个未落定的前提，
所以只有它下游的问题需要等 subagent 回报，**前沿上其余的问题现在就问**。
**决策是用户的**：每个决策都摆给他，然后等。

会话在前沿清空时结束：设计树的每个分支都访问过了，没有任何东西被默默假设。
**在用户确认你们已达成共识之前，不要动手实施。**

---

## 安装

`description` 已改为中英双语，用中文也能触发。

```yaml
---
name: grilling
description: 就一个计划、决策或想法不停地盘问用户。Grill the user relentlessly about a plan, decision, or idea. Use when the user wants to stress-test their thinking, or uses any 'grill' trigger phrases.
---
```

原文：[skills/productivity/grilling/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/productivity/grilling/SKILL.md)
