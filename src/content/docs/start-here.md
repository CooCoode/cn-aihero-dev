---
title: 这是什么
description: 本站是 Matt Pocock（AI Hero / Total TypeScript 作者）方法论的中文入口。说明收录范围、为什么这样切分，以及中文读者的推荐阅读顺序。
---

## 一句话

[Matt Pocock](https://www.aihero.dev) 的 AI 编程方法论中文站。
他开源在 [mattpocock/skills](https://github.com/mattpocock/skills)（MIT 协议）的 **40 个 Agent Skills** 全部译成中文，
外加一份**原创的术语对照表**。

## 为什么不是把 aihero.dev 整个翻译过来

因为那样做，法律上站不住，而且对你也没多大用。

aihero.dev 上有一百多篇文章和一本 AI 编程词典，这些内容**没有开放授权**，
翻译并公开发布属于制作衍生作品，需要作者同意。
但它的 **Skills 仓库是 MIT 协议的**——翻译、分发、改成你自己的，都明确允许，只要保留署名。

所以本站的切分是：

| 内容 | 处理方式 |
| --- | --- |
| **40 个 Skills**（MIT） | ✅ **全文翻译**，可直接安装使用 |
| **AI 编程术语表** | ✅ 术语清单公开，**中文解释由本站原创撰写**，不是翻译 |
| 一百多篇文章 | ➡️ 只做导读与链接，**不转载、不翻译全文**，请去原站读 |
| 付费课程与集训 | ❌ 不涉及 |

这样切分的另一个好处：**Skills 恰好是最该翻译的部分**。
文章读完就过去了，而 Skills 是要真的装进项目里、每天用的东西——
中文注释和中文触发词，对它的实际可用性影响很大。

## 中文读者该从哪里开始

**如果你完全没用过 Agent Skills：**

1. 先读下面的[术语对照表](/cn-aihero-dev/dictionary/)，把 🔤 标记的词记住——这些词**不要翻译**。
2. 装一个 skill 试试水。推荐从 [tdd](/cn-aihero-dev/skills/engineering/tdd/) 或
   [code-review](/cn-aihero-dev/skills/engineering/code-review/) 开始，这两个最直接见效。
3. 再读 [writing-for-agents](/cn-aihero-dev/skills/productivity/writing-for-agents/)——
   讲怎么写给 agent 看的文档，这是所有 skill 的底层功。

**如果你已经在自己写 skill 了：**

直接看 [codebase-design](/cn-aihero-dev/skills/engineering/codebase-design/)（模块、接口、缝在哪）
和 [grilling](/cn-aihero-dev/skills/productivity/grilling/)（动手前先被追问清楚）。

**推荐路径图**（Matt 原站的路线，链接到英文原文）：

- [AI Engineer Roadmap](https://www.aihero.dev/ai-engineer-roadmap) —— 转型 AI 工程师要学什么
- [LLM Fundamentals](https://www.aihero.dev/llm-fundamentals) —— LLM 基础，免费
- [AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary) —— 原版词典，**强烈建议对照着读**

## 关于翻译质量

翻译由 AI 辅助完成，术语按本站的[对照表](/cn-aihero-dev/dictionary/)统一。
保留了大量英文术语和代码块原文——这是刻意的，不是偷懒：

- 中文读者最终要读英文文档、看英文报错，术语留英文**减少了中间层**
- 你拿中文 skill 去搜索时，`context window` 比"上下文窗口"能搜到东西

发现译得不对，欢迎到 [GitHub](https://github.com/mattpocock/skills/issues) 提 Issue —— 或者直接改，
MIT 协议就是让你改的。

## 支持原作者

本站不替代 AI Hero。如果你觉得这些内容有帮助：

- 订阅 [Matt 的 newsletter](https://www.aihero.dev/s/skills-newsletter)（约 6 万开发者）
- 考虑购买他的[付费课程](https://www.aihero.dev/workshops/ai-coding-crash-course)

一手内容永远是最好的一手内容。
