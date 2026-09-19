---
title: /git-guardrails-claude-code —— 挡住危险 git 命令
description: 配 Claude Code 的 PreToolUse hook，在危险 git 命令执行前拦下它们：push、reset --hard、clean、branch -D 等。
---

# 配置 git 护栏

配置一个 `PreToolUse` hook，在 Claude 执行**危险 git 命令之前**拦截并挡住它们。

## 会挡住什么

- `git push`（所有变体，包括 `--force`）
- `git reset --hard`
- `git clean -f` / `git clean -fd`
- `git branch -D`
- `git checkout .` / `git restore .`

被挡住时，Claude 会看到一条消息，告诉它没有权限使用这些命令。

## 步骤

### 1. 问范围

问用户：装在**只有这个项目**（`.claude/settings.json`）还是**所有项目**（`~/.claude/settings.json`）？

### 2. 复制 hook 脚本

随附的脚本在：`scripts/block-dangerous-git.sh`

按范围复制到目标位置：

- **项目级**：`.claude/hooks/block-dangerous-git.sh`
- **全局级**：`~/.claude/hooks/block-dangerous-git.sh`

用 `chmod +x` 给它执行权限。

### 3. 把 hook 加进 settings

加进对应的 settings 文件：

**项目级**（`.claude/settings.json`）：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

**全局级**（`~/.claude/settings.json`）：

```json
{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          {
            "type": "command",
            "command": "~/.claude/hooks/block-dangerous-git.sh"
          }
        ]
      }
    ]
  }
}
```

settings 文件已存在的话，把 hook **合并**进已有的 `hooks.PreToolUse` 数组。
不要覆盖其他设置。

### 4. 问自定义

问用户要不要从黑名单里增删任何模式。相应编辑复制过来的脚本。

### 5. 验证

跑个快速测试：

```bash
echo '{"tool_input":{"command":"git push origin main"}}' | <脚本路径>
```

应当以退出码 2 结束，并向 stderr 打印一条 BLOCKED 消息。

> **译者注**：注意第 1 步问的"项目级还是全局级"——**这是这个 skill 唯一需要你判断的地方**。
>
> 全局装意味着**你以后所有项目**里的 agent 都不能 `git push`，
> 包括那些你本来就想让它推的。多数人的正确选择是**项目级**，
> 只在确实需要保护的主仓库上打开。
>
> 另外注意：护栏靠的是 `PreToolUse` hook，而不是提示词里写"请不要 push"。
> **提示词是建议，hook 是强制。** 需要保证的事，永远用机制而不是措辞。
> 这个区别值得迁移到你所有跟 agent 的协作里。

---

## 安装

`description` 已改为中英双语。

```yaml
---
name: git-guardrails-claude-code
description: 配置 Claude Code hook，在危险 git 命令执行前挡住它们。Set up Claude Code hooks to block dangerous git commands (push, reset --hard, clean, branch -D, etc.) before they execute. Use when user wants to prevent destructive git operations, add git safety hooks, or block git push/reset in Claude Code.
---
```

原文：[skills/misc/git-guardrails-claude-code/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/misc/git-guardrails-claude-code/SKILL.md)
