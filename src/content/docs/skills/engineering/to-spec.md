---
title: /to-spec —— 把对话变成规格
description: 不访谈，只综合。把已有对话和代码理解写成规格，发到 issue tracker。含完整规格模板。
---

本 skill 拿当前对话上下文和代码库理解，产出一份规格。
**不要**访谈用户；只综合你已经知道的东西。

issue tracker 和 triage 标签词汇应该已经给你配好了。没有的话，让用户跑 `/setup-matt-pocock-skills`。

## 流程

1. 探索仓库，理解代码库的现状（如果你还没做过）。
   规格全篇使用项目的领域术语表词汇，尊重你正在触碰那片区域的 ADR。

2. 草拟你打算在哪些**缝（seam）**上测这个功能。
   **已有缝优先于新缝。用尽可能高的缝。** 需要新缝时，在你能提的最高点上提。
   整个代码库里的缝越少越好——**理想数量是一个**。

   跟用户确认这些缝符合他的预期。

3. 用下面的模板写规格，然后发到项目的 issue tracker。
   打上 `ready-for-agent` 这个 triage 标签——不需要再做额外的 triage。

<spec-template>

## 问题陈述

用户面临的问题，**从用户的视角**描述。

## 解决方案

问题的解法，**从用户的视角**描述。

## 用户故事

一份**长的**、带编号的用户故事列表。每条格式为：

1. 作为 <角色>，我想要 <功能>，以便 <收益>

<用户故事示例>
1. 作为手机银行客户，我想要看到我各账户的余额，以便做出更明智的消费决策
</用户故事示例>

这份列表应当**极其详尽**，覆盖功能的所有方面。

## 实现决策

已做出的实现决策列表，可以包含：

- 将要构建/修改的模块
- 这些模块中将修改的接口
- 来自开发者的技术澄清
- 架构决策
- schema 变更
- API 契约
- 具体的交互方式

**不要**写具体文件路径或代码片段。它们会很快过时。

例外：如果原型产出的某个片段比散文更精确地编码了一个决策
（状态机、reducer、schema、类型形状），就把它内联在相关决策里，
并简短注明来自原型。**修剪到只剩决策密集的部分**——不要一个能跑的 demo，只要关键点。

## 测试决策

已做出的测试决策列表，包含：

- 什么算好测试的描述（只测外部行为，不测实现细节）
- 哪些模块会被测
- 测试的先例（即代码库里类似类型的测试）

## 范围之外

描述哪些东西不在本规格范围内。

## 补充说明

关于这个功能的任何补充说明。

</spec-template>

---

## 安装

**这是斜杠命令入口，`description` 不建议翻译。**

```yaml
---
name: to-spec
description: "Turn the current conversation into a spec and publish it to the project issue tracker: no interview, just synthesis of what you've already discussed."
disable-model-invocation: true
---
```

原文：[skills/engineering/to-spec/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/to-spec/SKILL.md)
