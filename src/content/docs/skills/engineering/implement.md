---
title: /implement —— 按规格实施
description: 按规格或工单实施，走 TDD、定期跑检查、最后自审。这是把前面所有 skill 串起来的收口环节。
---

实施用户在规格或工单里描述的工作。

尽可能在**事先商定的缝**上用 `/tdd`。

**定期跑 typecheck，定期跑单个测试文件，最后完整跑一遍测试套件。**

做完之后，用 `/code-review` 审查这次的工作。

把工作提交到当前分支。

> **译者注**：这个 skill 只有 433 字节，它不包含具体做法——它是**编排层**。
> 真正的规则都在它指向的那些 skill 里：
>
> | 这一步 | 规则在哪 |
> | --- | --- |
> | 在哪些缝上测 | [codebase-design](/skills/engineering/codebase-design/) 定义"缝" |
> | 怎么写测试 | [tdd](/skills/engineering/tdd/) |
> | 跑什么检查 | [tdd](/skills/engineering/tdd/) 的循环规则 |
> | 提交前审查 | [code-review](/skills/engineering/code-review/) |
>
> 注意"**定期**跑 typecheck、**最后**完整跑测试"这个节奏是刻意安排的：
> 完整测试套件慢，每次都跑会打断心流；
> 但只在最后跑一次，则会攒出一堆同时爆发的错误，定位成本指数上升。
> typecheck 快，所以它可以频繁跑。

---

## 安装

**这是斜杠命令入口，`description` 不建议翻译。**

```yaml
---
name: implement
description: "Implement a piece of work based on a spec or set of tickets."
disable-model-invocation: true
---
```

原文：[skills/engineering/implement/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/implement/SKILL.md)
