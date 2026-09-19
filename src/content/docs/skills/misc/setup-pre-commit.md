---
title: /setup-pre-commit —— 配提交前钩子
description: 在当前仓库配 Husky + lint-staged（Prettier）+ 类型检查 + 测试的提交前钩子。
---

# 配置提交前钩子

## 会配好什么

- **Husky** 提交前钩子
- **lint-staged** 对所有已暂存文件跑 Prettier
- **Prettier** 配置（如果缺）
- 提交前钩子里的 **typecheck** 和 **test** 脚本

## 步骤

### 1. 检测包管理器

看有没有 `package-lock.json`（npm）、`pnpm-lock.yaml`（pnpm）、
`yarn.lock`（yarn）、`bun.lockb`（bun）。有哪个用哪个。看不出来就默认 npm。

### 2. 装依赖

作为 devDependencies 安装：

```
husky lint-staged prettier
```

### 3. 初始化 Husky

```bash
npx husky init
```

这会创建 `.husky/` 目录，并往 package.json 里加 `prepare: "husky"`。

### 4. 创建 `.husky/pre-commit`

写这个文件（Husky v9+ 不需要 shebang）：

```
npx lint-staged
npm run typecheck
npm run test
```

**要适配**：把 `npm` 换成检测到的包管理器。
如果仓库的 package.json 里没有 `typecheck` 或 `test` 脚本，
就省掉那几行，并告诉用户。

### 5. 创建 `.lintstagedrc`

```json
{
  "*": "prettier --ignore-unknown --write"
}
```

### 6. 创建 `.prettierrc`（如果缺）

**只在没有任何 Prettier 配置时**才创建。用这些默认值：

```json
{
  "useTabs": false,
  "tabWidth": 2,
  "printWidth": 80,
  "singleQuote": false,
  "trailingComma": "es5",
  "semi": true,
  "arrowParens": "always"
}
```

### 7. 验证

- [ ] `.husky/pre-commit` 存在且可执行
- [ ] `.lintstagedrc` 存在
- [ ] package.json 里的 `prepare` 脚本是 `"husky"`
- [ ] `prettier` 配置存在
- [ ] 跑 `npx lint-staged` 验证它能工作

### 8. 提交

暂存所有改动/新建的文件，用这条消息提交：
`Add pre-commit hooks (husky + lint-staged + prettier)`

**这次提交会走一遍新的提交前钩子**：很好的冒烟测试，验证一切正常。

## 注意事项

- Husky v9+ 的钩子文件不需要 shebang
- `prettier --ignore-unknown` 会跳过 Prettier 解析不了的文件（图片等）
- 提交前钩子的顺序是先 lint-staged（快、只管暂存区），再完整 typecheck 和测试

> **译者注**：第 8 步是这里最值得学的技巧——
> **用"完成配置"这个动作本身来验证配置**。
>
> 配完钩子如果只是"看起来对了"，那你并不知道它真的会拦住东西。
> 让它自己对一次提交生效，钩子配错的话这次提交就会失败，当场暴露。
>
> 顺带一提顺序也是刻意的：`lint-staged` 只管暂存区、毫秒级返回，
> 所以它排第一，让格式问题**在你还在等的时候就修好了**；
> 而完整的 typecheck 和测试放后面，因为它们慢。
> 这是"**快速反馈在前，昂贵检查在后**"的一个具体应用。

---

## 安装

`description` 已改为中英双语。

```yaml
---
name: setup-pre-commit
description: 在当前仓库配置 Husky 提交前钩子、lint-staged（Prettier）、类型检查和测试。Set up Husky pre-commit hooks with lint-staged (Prettier), type checking, and tests in the current repo. Use when user wants to add pre-commit hooks, set up Husky, configure lint-staged, or add commit-time formatting/typechecking/testing.
---
```

原文：[skills/misc/setup-pre-commit/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/misc/setup-pre-commit/SKILL.md)
