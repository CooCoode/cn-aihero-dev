---
title: /domain-modeling —— 领域建模
description: 主动建立并打磨项目的领域模型：挑战用词、发明边界场景、把术语表和决策当场写下来。产出 CONTEXT.md 与 ADR。
---

在设计过程中**主动**建立并打磨项目的领域模型。这是一门**主动的**功夫：
挑战用词、发明边界场景、在术语和决策一凝固下来就写进文档。
（仅仅是**读** `CONTEXT.md` 拿词汇不算这个 skill——那是任何 skill 都能做的一行习惯。
这个 skill 是给你**改**模型用的，不是消费模型。）

## 文件结构

多数仓库只有一个 context：

```
/
├── CONTEXT.md
├── docs/
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

如果根目录有 `CONTEXT-MAP.md`，说明仓库有多个 context。这份地图指向每一个的位置：

```
/
├── CONTEXT-MAP.md
├── docs/
│   └── adr/                          ← 系统级决策
├── src/
│   ├── ordering/
│   │   ├── CONTEXT.md
│   │   └── docs/adr/                 ← context 专属决策
│   └── billing/
│       ├── CONTEXT.md
│       └── docs/adr/
```

**懒创建文件：有东西要写的时候才建。** 没有 `CONTEXT.md`，就在第一个术语落定时建；
没有 `docs/adr/`，就在第一个 ADR 需要时建。

## 会话中怎么做

### 拿术语表来挑战

用户用的词跟 `CONTEXT.md` 里已有的语言冲突时，**当场指出来**。
"你的术语表把 'cancellation' 定义成 X，但你说的好像是 Y。是哪个？"

### 把模糊语言磨锋利

用户用含糊或一词多义的词时，提一个精确的规范词。
"你说 'account'：你是指 Customer 还是 User？这俩不是一回事。"

### 讨论具体场景

讨论领域关系时，拿具体场景压测它。
编一些探边界情况的场景，逼用户把概念之间的边界说准。

### 跟代码交叉验证

用户说某个东西是怎么运作的，就去查代码是不是这样。
发现矛盾就摆出来："你的代码会取消整个 Order，但你刚说部分取消是可能的。哪个对？"

### 就地更新 CONTEXT.md

一个术语落定，**当场**更新 `CONTEXT.md`。**不要攒着批量写**：发生了就记。
格式见 [CONTEXT-FORMAT.md](#context-formatmd--contextmd-格式)。

`CONTEXT.md` 应当**完全不含实现细节**。
不要把 `CONTEXT.md` 当规格、草稿纸，或者实现决策的存放处。
**它是术语表，仅此而已。**

### 谨慎地提议 ADR

只有下面三条**同时成立**时才提议建 ADR：

1. **难以逆转**：以后改主意代价很大
2. **脱离上下文会让人惊讶**：未来的读者会问"他们为什么这么干？"
3. **真实权衡的产物**：确实存在其他可选方案，而你出于特定理由选了这个

三条缺任何一条，就跳过 ADR。格式见 [ADR-FORMAT.md](#adr-formatmd--adr-格式)。

---

## CONTEXT-FORMAT.md —— CONTEXT.md 格式

> 译者注：本节对应上游 `skills/engineering/domain-modeling/CONTEXT-FORMAT.md`。

### 规则

- **只放术语**，不放实现、不放规格、不放待办
- **一个术语一条**，按字母序排
- 每条要说清：**它是什么**，以及**它不是什么**（跟哪些近义词区分）
- 用领域专家的语言写，不用代码里的语言写

### 骨架

```markdown
# <项目名> 术语表

## <术语>

<它是什么。一两句话，用领域专家的说法。>

**不是**：<最容易跟它混淆的那个东西，以及为什么不是。>

**相关**：<别的术语>
```

### 判断标准

写完一条，问自己：**新来的人读这条，会不会搞错？**
如果这条只重复了名字本身，说明它没写清楚，删掉或者重写。

---

## ADR-FORMAT.md —— ADR 格式

> 译者注：本节对应上游 `skills/engineering/domain-modeling/ADR-FORMAT.md`。

### 文件命名

`docs/adr/<四位序号>-<kebab-case-标题>.md`，例如：

```
docs/adr/0001-event-sourced-orders.md
docs/adr/0002-postgres-for-write-model.md
```

序号**只增不减**，已废弃的 ADR 也不删，靠 `状态` 字段标记。

### 骨架

```markdown
# <决策的简短标题>

- **状态**：提议中 / 已接受 / 已废弃 / 已被 ADR-XXXX 取代
- **日期**：YYYY-MM-DD

## 背景

我们面对的问题是什么？有哪些约束条件？
（这一节让未来的读者明白：当时的选择不是拍脑袋。）

## 决策

我们决定做什么。（用主动语态："我们决定……"）

## 后果

这个决策带来什么好处，代价是什么，放弃了什么。
（**这一节最容易被省略，也最重要**——它记录了权衡本身。）
```

### 什么时候**不**该写 ADR

- 决策很容易改回来
- 脱离上下文不会让人惊讶
- 没有真正的替代方案（没得选，就不算决策）

---

## 安装

`description` 已改为中英双语。

```yaml
---
name: domain-modeling
description: 建立并打磨项目的领域模型。Build and sharpen a project's domain model. Use when discussing codebase terminology, writing or editing a CONTEXT.md, or recording or editing an ADR.
---
```

原文：`skills/engineering/domain-modeling/`（[SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md) ·
[CONTEXT-FORMAT.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/CONTEXT-FORMAT.md) ·
[ADR-FORMAT.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/ADR-FORMAT.md)）

<small>注：上面两个格式文件的中文版为**摘要译法**，完整原文请以本地安装的英文版为准。</small>
