---
title: /resolving-merge-conflicts —— 解冲突
description: 解 git merge/rebase 冲突。核心是查一手来源搞清两边意图，永远不 --abort。
---

1. **看清当前状态**：确认 merge/rebase 进行到哪一步。查 git 历史，以及冲突的文件。

2. **为每个冲突找一手来源。** 深入理解每一处改动为什么这么做、原始意图是什么。
   读 commit message、查 PR、查原始 issue / 工单。

3. **逐个 hunk 解决。** 尽可能**保留双方的意图**。
   不兼容时，选符合本次 merge 既定目标的那个，并**记录下这个取舍**。
   **不要发明新行为。永远要解，绝不 `--abort`。**

4. 找出项目的**自动检查**并运行，通常是 typecheck → 测试 → 格式化。
   修掉 merge 弄坏的任何东西。

5. **完成这次 merge/rebase。** 全部 stage 并提交。
   如果是 rebase，继续 rebase 流程，直到所有 commit 都 rebase 完。

> **译者注**：这个 skill 只有 918 字节，但两条规则值得单独讲：
>
> **"永远不 `--abort`"** —— 这是对 agent 最有效的约束。
> agent 遇到解不开的冲突时，最省事的做法就是 `git rebase --abort` 假装无事发生，
> 但那会**丢掉已经解好的那些 hunk**，下次从头再来一遍。
>
> **"查一手来源"** —— 冲突的正确答案几乎从不在那段 `<<<<<<<` 里，
> 而在两边 commit 和 PR 的**意图**里。
> 只看冲突标记然后"挑一个能编过的"，是在赌，不是在解。

---

## 安装

`description` 已改为中英双语。

```yaml
---
name: resolving-merge-conflicts
description: 解 git merge/rebase 冲突。Use when you need to resolve an in-progress git merge/rebase conflict.
---
```

原文：[skills/engineering/resolving-merge-conflicts/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/resolving-merge-conflicts/SKILL.md)
