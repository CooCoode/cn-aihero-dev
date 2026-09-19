---
title: Skills 中文版
description: Matt Pocock 开源（MIT）的 29 个 Agent Skills 中文版。包含安装方法、每个 skill 的用途、以及中文触发词说明。
---

## 这是什么

[Matt Pocock](https://www.aihero.dev) 每天在自己项目里用的 **Agent Skills**，共 29 个稳定版，
全部译成中文。上游仓库：[mattpocock/skills](https://github.com/mattpocock/skills)（MIT 协议）。

Skill 就是一个 markdown 文件，告诉 agent "遇到这类任务该怎么做"。
它不是代码、不是插件、不绑定模型——任何支持 skill 的 agent 都能用。

**中文版做了什么额外处理：**

- skill 正文译成中文，代码块、命令、文件路径**保持原样**
- `description`（决定 agent 什么时候自动调用它的那句）改成**中英双语**——
  这样你用中文说"帮我测试先行地开发"也能触发，不必切成英文
- 术语按本站[对照表](/cn-aihero-dev/dictionary/)统一，标 🔤 的词保留英文

## 安装

**推荐方式**：直接从上游装，拿到的是官方最新版；中文版用来读。

```bash
npx skills@latest add mattpocock/skills
```

安装器会让你挑选要哪些 skill、装到哪个 agent 上。
**请务必把 `setup-matt-pocock-skills` 选上**，后面要用。

装完在 agent 里跑一次：

```
/setup-matt-pocock-skills
```

它会问你三件事：用哪个 issue tracker（GitHub / Linear / 本地文件）、
triage 时打什么标签、生成的文档放哪。

**Claude Code 用户**也可以用插件方式（只读、自动更新，但改不了）：

```bash
claude plugins install mattpocock-skills
```

## 按问题挑 skill

不知道从哪开始，就照这个表按"你现在的痛苦"找。

| 你的问题 | 用这个 |
| --- | --- |
| **agent 做的不是我想要的** | [grill-with-docs](/cn-aihero-dev/skills/engineering/grill-with-docs/)（首选）、[grill-me](/cn-aihero-dev/skills/productivity/grill-me/) |
| **agent 太啰嗦** | [grill-with-docs](/cn-aihero-dev/skills/engineering/grill-with-docs/)（建立共享语言）、[wait-what](/cn-aihero-dev/skills/productivity/wait-what/) |
| **代码能跑但不敢改** | [tdd](/cn-aihero-dev/skills/engineering/tdd/)、[code-review](/cn-aihero-dev/skills/engineering/code-review/) |
| **不知道模块该怎么切** | [codebase-design](/cn-aihero-dev/skills/engineering/codebase-design/) |
| **项目里的词各说各话** | [domain-modeling](/cn-aihero-dev/skills/engineering/domain-modeling/) |
| **bug 查不出来** | [diagnosing-bugs](/cn-aihero-dev/skills/engineering/diagnosing-bugs/) |
| **代码库越改越乱** | [improve-codebase-architecture](/cn-aihero-dev/skills/engineering/improve-codebase-architecture/) |
| **需求说不清** | [to-spec](/cn-aihero-dev/skills/engineering/to-spec/)、[to-tickets](/cn-aihero-dev/skills/engineering/to-tickets/) |
| **积压的 issue 太多** | [triage](/cn-aihero-dev/skills/engineering/triage/) |
| **要给 agent 写文档** | [writing-for-agents](/cn-aihero-dev/skills/productivity/writing-for-agents/) |
| **上下文快满了** | [handoff](/cn-aihero-dev/skills/productivity/handoff/)、[wait-what](/cn-aihero-dev/skills/productivity/wait-what/) |
| **想学一个新领域** | [teach](/cn-aihero-dev/skills/productivity/teach/) |
| **不知道下一步做什么** | [wayfinder](/cn-aihero-dev/skills/engineering/wayfinder/)、[ask-matt](/cn-aihero-dev/skills/engineering/ask-matt/) |
| **要配 CI / 环境** | [wizard](/cn-aihero-dev/skills/engineering/wizard/)、[setup-pre-commit](/cn-aihero-dev/skills/misc/setup-pre-commit/) |

## 全部 29 个

### 工程（18）

| Skill | 一句话 |
| --- | --- |
| [ask-matt](/cn-aihero-dev/skills/engineering/ask-matt/) | 不确定该用哪个 skill 时，先问它 |
| [code-review](/cn-aihero-dev/skills/engineering/code-review/) | 对照标准与规格两条线审查改动 |
| [codebase-design](/cn-aihero-dev/skills/engineering/codebase-design/) | 模块、接口、深度、缝在哪——共享词汇表 |
| [diagnosing-bugs](/cn-aihero-dev/skills/engineering/diagnosing-bugs/) | 硬骨头 bug 和性能回退的诊断循环 |
| [domain-modeling](/cn-aihero-dev/skills/engineering/domain-modeling/) | 建立领域模型，写 CONTEXT.md 和 ADR |
| [grill-with-docs](/cn-aihero-dev/skills/engineering/grill-with-docs/) | 盘问 + 顺手产出文档（最推荐） |
| [implement](/cn-aihero-dev/skills/engineering/implement/) | 按规格或工单实施 |
| [improve-codebase-architecture](/cn-aihero-dev/skills/engineering/improve-codebase-architecture/) | 找架构改进机会，出报告 |
| [prototype](/cn-aihero-dev/skills/engineering/prototype/) | 写丢弃型原型，回答一个设计问题 |
| [research](/cn-aihero-dev/skills/engineering/research/) | 查一手资料，把结论落成仓库里的文档 |
| [resolving-merge-conflicts](/cn-aihero-dev/skills/engineering/resolving-merge-conflicts/) | 解冲突 |
| [setup-matt-pocock-skills](/cn-aihero-dev/skills/engineering/setup-matt-pocock-skills/) | 一次性配置 |
| [tdd](/cn-aihero-dev/skills/engineering/tdd/) | 红绿循环：什么算好测试、测试放哪 |
| [to-spec](/cn-aihero-dev/skills/engineering/to-spec/) | 把讨论转成规格 |
| [to-tickets](/cn-aihero-dev/skills/engineering/to-tickets/) | 把规格拆成可交付工单 |
| [triage](/cn-aihero-dev/skills/engineering/triage/) | 清积压 issue |
| [wayfinder](/cn-aihero-dev/skills/engineering/wayfinder/) | 规划下一步行动 |
| [wizard](/cn-aihero-dev/skills/engineering/wizard/) | 生成交互式 bash 向导，带人做只有人能做的步骤 |

### 协作与表达（7）

| Skill | 一句话 |
| --- | --- |
| [grilling](/cn-aihero-dev/skills/productivity/grilling/) | 设计树 + 分轮追问的底层机制 |
| [grill-me](/cn-aihero-dev/skills/productivity/grill-me/) | 仅代码之外的盘问（grilling 的简版入口） |
| [handoff](/cn-aihero-dev/skills/productivity/handoff/) | 上下文快满时交接给下一个会话 |
| [teach](/cn-aihero-dev/skills/productivity/teach/) | 教用户某个领域，边教边建学习记录 |
| [to-questionnaire](/cn-aihero-dev/skills/productivity/to-questionnaire/) | 把需要用户回答的东西变成问卷 |
| [wait-what](/cn-aihero-dev/skills/productivity/wait-what/) | 上一句没听懂，让它用简化英语重讲 |
| [writing-for-agents](/cn-aihero-dev/skills/productivity/writing-for-agents/) | 怎么写给 agent 看的文档（所有 skill 的底层功） |

### 杂项（4）

| Skill | 一句话 |
| --- | --- |
| [git-guardrails-claude-code](/cn-aihero-dev/skills/misc/git-guardrails-claude-code/) | 挡住 agent 执行危险的 git 命令 |
| [migrate-to-shoehorn](/cn-aihero-dev/skills/misc/migrate-to-shoehorn/) | TypeScript 测试的类型断言迁移 |
| [scaffold-exercises](/cn-aihero-dev/skills/misc/scaffold-exercises/) | 搭练习题骨架 |
| [setup-pre-commit](/cn-aihero-dev/skills/misc/setup-pre-commit/) | 配 husky + lint-staged + Prettier |

## 未收录的部分

上游 `skills/in-progress/` 下的 9 个 skill **本站不翻译**——
上游明确标注它们是进行中的工作，接口还会变，翻了很快就作废。
需要的话直接看英文原文。

附属文件（如 tdd 的 `tests.md`、`mocking.md`）在主要 skill 页面里以内嵌章节呈现，
标注了对应的文件名。其余附属文件请以你本地安装的英文版为准。
