---
title: AI 编程术语对照表
description: 72 个 AI 编程核心术语的中英对照与中文解释。中文读者读英文一手资料最大的障碍是术语不统一，这张表给出推荐译名与保留英文的场景。**本站原创，非任何词典的翻译。**
---

中文读者读 AI 编程的英文资料，卡住的地方往往不是句子结构，而是**术语没有统一译名**。
同一个 `context window`，有人叫"上下文窗口"，有人叫"语境长度"，有人直接不译。
读中文二手资料时各说各话，读英文一手资料时又认不出对应关系。

这张表给每个术语一个**推荐中文译名**，并标注哪些词建议**直接保留英文**。

标注说明：

| 标记 | 含义 |
| --- | --- |
| ✅ | 有公认译名，放心用中文 |
| 🔤 | **建议保留英文**。译名一旦被硬翻，反而看不懂，也无法搜索 |
| ⚠️ | 译名尚不统一，本表给出的是推荐用法，不是唯一正确答案 |

---

## 一、模型与推理

理解 LLM 本身在做什么。这一层是地基，术语误用会导致后面全部理解错位。

| 英文 | 推荐中文 | 说明 |
| --- | --- | --- |
| LLM / model | 大语言模型 / 模型 | ✅ Large Language Model |
| model provider | 模型服务商 | ✅ Anthropic、OpenAI、Google，以及 DeepSeek、Qwen、Kimi 等 |
| inference | 推理 | ✅ 模型跑一次计算并产出结果。**注意**：和"模型推理能力（reasoning）"不是一回事 |
| training | 训练 | ✅ 用数据调整模型权重的过程 |
| parameters | 参数 | ✅ 模型权重本身。"这个模型有多少参数"指规模 |
| parametric knowledge | 参数化知识 | ⚠️ 烧进模型权重里的知识，区别于运行时从上下文读到的知识 |
| knowledge cutoff | 知识截止时间 | ✅ 训练数据的时间边界，之后的事模型不知道 |
| next-token prediction | 下一 token 预测 | ✅ 一句话说清 LLM 的本质：永远在猜下一个最可能的 token |
| non-determinism | 非确定性 | ✅ 同样输入、同样的提示词，两次调用结果可能不同。**这是工程问题，不是 bug** |
| hallucination | 幻觉 | ✅ 模型编出看起来合理但实际错误的内容 |
| sycophancy | 谄媚 | ✅ 模型倾向于附和用户、不敢反驳的倾向。会污染你的判断 |
| effort | 思考强度 | ⚠️ 控制模型花多少算力思考一个问题的参数。**建议保留英文 effort** |
| smart zone | — | 🔤 Matt Pocock 自创术语，指上下文里模型表现最好的那段区间。无对应译名，建议保留英文 |

---

## 二、Token 与上下文

这一层是**成本**和**能力上限**的来源。绝大部分 AI 编程的坑都在这里。

| 英文 | 推荐中文 | 说明 |
| --- | --- | --- |
| token | token | 🔤 有译作"词元""令牌"，但**工程语境里一律建议保留 token**。"这个词有多少 token"是无法替代的说法 |
| input tokens / output tokens | 输入 / 输出 token | 🔤 计费就按这两个算，输出通常贵好几倍 |
| context | 上下文 | ✅ 模型这次调用能"看到"的全部内容 |
| context window | 上下文窗口 | ✅ 一次调用能容纳的 token 上限。**这是硬上限，超了就报错或截断** |
| cache tokens | 缓存 token | ⚠️ 命中 prompt 缓存的部分，比常规输入便宜得多 |
| prefix cache | 前缀缓存 | ⚠️ 把重复的提示词开头缓存起来复用，省时省钱 |
| clearing | 清空 | ⚠️ 主动丢弃上下文内容，换取空间 |
| compaction | 压缩 | ⚠️ 上下文快满时，把历史总结成更短的版本 |
| autocompact | 自动压缩 | ⚠️ 由工具自动触发的 compaction，通常在接近上限时发生 |
| attention budget | 注意力预算 | ⚠️ 模型对上下文的注意不是均分的，可以理解为有限的注意力配额 |
| attention degradation | 注意力衰减 | ⚠️ 上下文越长，模型对其中每部分的关注越弱 |
| attention relationship | 注意力关系 | ⚠️ 哪些内容彼此相关、需要被放在一起看 |
| context pointer | 上下文指针 | ⚠️ 不把内容塞进上下文，而是在上下文里放一个"去哪找"的线索 |
| contextual knowledge | 上下文知识 | ⚠️ 运行时从上下文里读到的知识，区别于参数化知识 |
| memory system | 记忆系统 | ✅ 跨会话保留信息的机制（文件、数据库等） |

---

## 三、Agent 与工具

| 英文 | 推荐中文 | 说明 |
| --- | --- | --- |
| agent | agent | 🔤 由模型自己决定下一步做什么的系统。有译作「智能体」，本站只在首次定义处用，正文一律保留 agent |
| agent mode | 智能体模式 | ✅ 让模型自主多步执行，而不是单问单答 |
| harness | 承载框架 | ⚠️ 包在模型外面、提供工具与循环的那层程序（如 Claude Code、Codex CLI）。**建议保留英文 harness**，因为"框架"会和 framework 混淆 |
| tool | 工具 | ✅ 模型可以调用的函数或命令 |
| tool call | 工具调用 | ✅ 模型决定调用某个工具的那一步 |
| tool result | 工具结果 | ✅ 工具返回给模型的内容 |
| function calling / tool use | 工具调用能力 | ✅ 模型支持结构化输出工具调用的能力 |
| subagent | 子智能体 | ⚠️ 主智能体派生出去的独立智能体，有自己的上下文。**建议保留英文 subagent** |
| MCP | MCP | 🔤 Model Context Protocol，模型与工具之间的标准协议。**从不翻译** |
| skill | skill | 🔤 写给 agent 看的操作手册，通常是一个 markdown 文件。**本站译文一律保留英文**——`SKILL.md` 是文件名约定，译了反而对不上 |
| sandbox | 沙箱 | ✅ 隔离的执行环境，防止 agent 乱动你的系统 |
| permission mode | 权限模式 | ✅ 控制 agent 能做什么、要不要问你 |
| permission request | 权限请求 | ✅ agent 请求执行敏感操作时弹给你确认 |
| human-in-the-loop | 人在回路 | ⚠️ 关键步骤由人确认，而非全自动 |
| human review | 人工审查 | ✅ 由人检查 agent 的产出 |
| automated review | 自动审查 | ✅ 由另一个模型或工具检查产出 |
| automated check | 自动检查 | ✅ 测试、类型检查、lint 这类机器判定 |
| progressive disclosure | 渐进式披露 | ⚠️ 先给概要、需要时再展开细节的信息组织方式 |

---

## 四、会话与状态

| 英文 | 推荐中文 | 说明 |
| --- | --- | --- |
| session | 会话 | ✅ 一次持续的对话上下文 |
| turn | 轮次 | ✅ 用户说一次 + 模型回一次 = 一轮 |
| stateful / stateless | 有状态 / 无状态 | ✅ 跨轮次记住东西，就是有状态 |
| filesystem | 文件系统 | ✅ 对 agent 来说，文件系统是最可靠的记忆 |
| environment | 环境 | ✅ agent 能操作的那台机器 / 那个容器 |
| AFK | 挂机跑 | ⚠️ Away From Keyboard。指启动 agent 后离开，让它自己跑完。**建议保留英文 AFK** |

---

## 五、协作与提示工程

| 英文 | 推荐中文 | 说明 |
| --- | --- | --- |
| system prompt | 系统提示词 | ✅ 最高优先级的指令，定义 agent 的身份和行为边界 |
| AGENTS.md | AGENTS.md | 🔤 放在项目根目录、告诉 agent 这个项目怎么干活的文件。**文件名是约定，不要翻译** |
| spec | 规格 / 规格书 | ✅ 要做什么的正式描述 |
| ticket | 工单 | ✅ 可独立交付的最小工作单元 |
| design concept | 设计概念 | ✅ 实现前先对齐的核心设计决策 |
| grilling | 盘问 | ⚠️ Matt Pocock 提倡的做法：在动手前被反复追问，直到想清楚。**建议保留英文 grilling** |
| handoff | 交接 | ✅ 把工作交给另一个人或另一个 agent |
| handoff artifact | 交接产物 | ✅ 交接时留下的文档 |
| primary source | 一手来源 | ✅ 官方文档、源码、规范原文 |
| secondary source | 二手来源 | ✅ 博客、教程、转述。**AI 编程里这个区分极其关键** |
| AX | AX | 🔤 Agent Experience，智能体体验。对标 DX |
| DX | DX | 🔤 Developer Experience，开发者体验。**从不翻译** |
| vibe coding | 氛围编程 | ⚠️ 跟着感觉写、不看代码细节的写法。带贬义 |

---

## 怎么用这张表

1. **读英文资料时**：遇到不认识的词先查这里，再回原文。
2. **写中文文档时**：标 🔤 的词直接用英文，别硬翻。硬翻会让习惯英文的人搜不到、
   也不认识。
3. **和 AI 对话时**：直接用英文术语。模型对 `context window` 的理解远好于"上下文窗口"。
   中英混说是这个领域最有效的沟通方式，不丢人。

## 这张表是怎么来的

**这是本站自己写的表，不是任何词典的翻译。**

收词依据是中文读者实际会卡住的地方，而不是照着哪份清单抄：同一个英文词在中文圈有好几种
叫法（`context window` 就至少有三种），或者干脆没人翻过，这类词才会进表。术语本身
（`context window`、`compaction`、`subagent`）是行业内通用的技术词汇，不专属于任何一家。
解释、推荐译名、以及 🔤 / ✅ / ⚠️ 的判断，都是本站自己写的。

想读原版词典（英文、词条更全、带 Matt 本人的解读）：
[AI Hero 的 AI Coding Dictionary](https://www.aihero.dev/ai-coding-dictionary)。

**我们问过能不能把它翻成中文，对方没有授权。** 所以这页只有我们自己的表和一条链接，
将来也只有这些。详见[版权与署名](/cn-aihero-dev/about/)。

如果你觉得某个译名该改，欢迎提 Issue —— 术语标准是靠争论定下来的。
