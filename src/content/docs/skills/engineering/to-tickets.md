---
title: /to-tickets —— 拆成曳光弹工单
description: 把计划、规格或对话拆成一组曳光弹工单，每个声明自己的阻塞边，发到配置好的 tracker。含宽重构的 expand–contract 例外。
---

# 拆工单

把一份计划、规格或对话拆成一组**工单（ticket）**：
**曳光弹（tracer bullet）式的垂直切片**，每个声明**阻塞**它的那些工单。

issue tracker 和 triage 标签词汇应该已经给你配好了。没有的话，让用户跑 `/setup-matt-pocock-skills`。

## 流程

### 1. 收集上下文

从对话上下文里已有的东西出发。
如果用户传了个引用（规格路径、issue 编号或 URL）作为参数，取来读完整的正文和评论。

### 2. 探索代码库（可选）

还没探索过就探索一下，理解代码现状。
工单标题和描述要用项目的领域术语表词汇，尊重你正在触碰那片区域的 ADR。

**找机会先做预重构（prefactor），让实现变容易。**
"先把改动变简单，再做那个简单的改动。"

### 3. 草拟垂直切片

把工作拆成**曳光弹**工单。

<vertical-slice-rules>

- 每个切片穿透**每一层**（schema、API、UI、测试）走一条**窄但完整**的路径：
  **垂直的，不是某一层的水平切片**
- 一个完成的切片**本身就能演示或验证**
- 每个切片的大小要能塞进**一个全新的上下文窗口**
- 任何预重构都应当先做

</vertical-slice-rules>

给每个工单标出它的**阻塞边（blocking edges）**：必须先完成才能开始本工单的那些工单。
**没有阻塞者的工单可以立刻开工。**

**宽重构是垂直切片的例外。**
**宽重构（wide refactor）**是一次机械性改动（重命名一列、改一个共享符号的类型），
它的**爆炸半径（blast radius）**横扫整个代码库，
于是**一次编辑同时弄坏几千个调用点，没有任何垂直切片能落在绿灯上**。
不要硬把它塞进曳光弹；**按 expand–contract 排序**：

1. **expand（扩张）**：把新形式加在旧形式旁边，什么都不坏。
2. **migrate（迁移）**：按爆炸半径分批迁移调用点（按包、按目录），
   每一批是一个自己的工单，都被 expand 阻塞。
   因为旧形式还在，**批次之间 CI 始终保持绿**。
3. **contract（收缩）**：没有调用方残留后再删掉旧形式，
   这个工单被**每一个**迁移批次阻塞。

当连单批迁移都无法独立保持绿灯时，保留这个顺序，
但让它们共享一个集成分支，全部阻塞一个最终的"集成并验证"工单——**绿灯只在那里承诺**。

### 4. 向用户提问确认

把提案的拆分以编号列表呈现。每个工单展示：

- **标题**：简短描述性的名字
- **阻塞于**：哪些其他工单（如果有）必须先完成
- **它交付什么**：这个工单让什么端到端行为跑通

问用户：

- 粒度对吗？（太粗 / 太细）
- 阻塞边对吗：每个工单是否只依赖那些**真的**卡住它的工单？
- 有没有工单该合并或者再拆？

**反复迭代直到用户批准这份拆分。**

### 5. 把工单发到配置好的 tracker

发布已批准的工单。**怎么发**取决于 `/setup-matt-pocock-skills` 配的是哪个 tracker；
工单本身两种方式下是一样的，只有阻塞边的形态不同：

- **本地文件** → 每个工单一个文件，放在
  `.scratch/<feature-slug>/issues/<NN>-<slug>.md`，
  从 `01` 起按依赖顺序编号（阻塞者在前）。
  每个文件的 "Blocked by" 列出它依赖的编号/标题。
  **用下面那份单工单模板：一个工单一个文件，绝不写成一个合并的大文件。**
- **真实 issue tracker（GitHub、Linear 等）** → 按依赖顺序（阻塞者在前）
  每个工单发一个 issue，这样每个工单的阻塞边都能引用真实标识符。
  平台有原生 blocking / sub-issue 关系就用原生的；
  否则把每个工单的 "Blocked by" 设成那些阻塞它的 issue。
  打上 `ready-for-agent` triage 标签，除非另有指示：这些工单按构造就是 agent 可领的。

**按前沿（frontier）推进**：任何阻塞者都已完成的工单。
对一条纯线性链来说，就是从下往上。

**不要**关闭或修改任何父 issue。

<local-ticket-template>

# <NN>: <工单标题>

**要构建什么：** 这个工单让什么端到端行为跑通，**从用户视角**说，而不是逐层实现清单。

**阻塞于：** 卡住本工单的那些工单的编号/标题，或者 "None (can start immediately)"。

**状态：** ready-for-agent

- [ ] 验收标准 1
- [ ] 验收标准 2

</local-ticket-template>

<issue-template>

## 父级

tracker 上父 issue 的引用（如果来源就是一个已有 issue，否则省略本节）。

## 要构建什么

这个工单让什么端到端行为跑通，**从用户视角**说，而不是逐层实现。

## 验收标准

- [ ] 标准 1
- [ ] 标准 2

## 阻塞于

- 每个阻塞它的工单的引用，或者 "None (can start immediately)"。

</issue-template>

两种形式都**避免具体文件路径或代码片段**：它们过时很快。
例外：如果原型产出的某个片段比散文更精确地编码了一个决策
（状态机、reducer、schema、类型形状），就内联进去并简短注明来自原型。
修剪到只剩决策密集的部分——不要一个能跑的 demo，只要关键点。

---

## 安装

**斜杠命令入口**（`disable-model-invocation: true`）：agent 不会自己调用它，只有你敲命令才触发。`description` 也译成中英双语——它只是命令面板里的说明，翻译对中文用户更友好，保留英文便于对照。

```yaml
---
name: to-tickets
description: "把规格拆成曳光弹工单，每个声明自己的阻塞边。Break a plan or spec into a set of tracer-bullet tickets."
disable-model-invocation: true
---
```

原文：[skills/engineering/to-tickets/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/to-tickets/SKILL.md)
