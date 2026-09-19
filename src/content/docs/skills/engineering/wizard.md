---
title: /wizard —— 生成交互式 bash 向导
description: 生成一个 bash 脚本，一步步带着人走完只有人能做的流程：开 URL、说清点哪、收下值、写进 .env 或 GitHub secrets。配基础设施、配凭据、跑一次性迁移用。
---

# 向导

**向导（wizard）**是一个 bash 脚本，一步步带着人走完一个手工流程——
手工做很烦，每次都跟 AI 重新解释一遍也很烦。
它会**打开每个 URL**、说清**点什么、复制什么**、**收下值**、
写进它们该去的地方（`.env`、GitHub secrets）、**每一步都确认**、并显示还剩几步。
它可能用来配第三方服务、跑一次性迁移，或者把项目从一个状态移到另一个状态。

那套好用的交互已经由 `template.sh` 解决了：
逐阶段进度、确认门、跨平台开 URL（含 WSL）、隐藏式密钥输入、
幂等的 `.env` upsert、`gh secret` / `gh variable` 写入、收尾总结。
**你的工作只是界定流程、编写它的各个阶段。**
`STAGES` 标记以上的那部分是每个向导都一模一样的库；
**那份一致性本身就是重点：绝不要手改它。**

向导**默认是一次性的**：为跑一次而造，存到草稿路径或 `scripts/` 下，活儿干完就删。
**只有当用户想要一条该留在仓库里的可重复配置路径时，才提交它。**

## 流程

### 1. 界定流程

把**人要做的每一个手工步骤**、以及过程中被捕获的**每一个值**都摸清楚。
**先读仓库，不要冷着脸就问：**

- 配置类：`.env`、`.env.example`、`.env.*`、`README`、`docker-compose*`、
  框架配置，以及 `.github/workflows/*`
  （**每一个 `secrets.*` / `vars.*` 引用都是向导必须产出的一个值**）。
- 迁移或转换类：当前状态、目标状态，以及两者之间那些不可逆的动作。

然后把**有序的阶段列表**和**每个阶段产出的值**给用户看，并确认：他可以增、删、调序。

**完成条件：** 每个阶段按顺序命名完毕，并且对每个被捕获的值你都知道
(a) 人从哪里得到它，(b) 它写到哪（`.env`、GitHub secret、两者、还是都不写——有些阶段是纯动作），
(c) 它是密钥（隐藏输入）还是公开的。

### 2. 画出每个阶段的路径

为每个阶段写出人跟的**精确路径**：打开哪个 URL、在那里做什么、值显示在哪、填哪个变量——例如
"Dashboard → Developers → API keys → Reveal test key → copy"。
**你并不真正了解当前 UI 或确切命令的地方，就说出来，去问用户或者查文档：
绝不编造可能不存在的步骤。**

**完成条件：** 每个阶段都能追溯到**一个陌生人也能照着做的**具体指令。

### 3. 编写向导

把 `template.sh` 复制到目标路径。
用每个步骤一个 `stage` 替换掉示例阶段，按依赖顺序排。
用库里的辅助函数：`stage`、`say`/`step`、`open_url`、`ask`/`ask_secret`、
`write_env`、`set_secret`/`set_var`、`pause`/`confirm`。
把 `TOTAL_STAGES` 设成你写的阶段数。

**守住模板立下的标准：**
问值**之前**先开 URL；任何密钥都用 `ask_secret`；
每个要持久化的值都用 `write_env`；**只**把 CI 真正需要的值 `set_secret`；
任何不可逆动作前先 `confirm`。
每个 `stage` 都会清屏，让只有当前步骤可见：
**把阶段控制在一个聚焦的任务上**，别让人需要的东西滚出屏幕。
**不要碰标记以上的那部分库。**

### 4. 验证并交付

- `bash -n <script>`；有 `shellcheck` 就跑一下。
- `chmod +x <script>`。
- **不要自己端到端跑一遍**：它会开浏览器、并在人的输入上阻塞。
  改为**静态地追一遍**：第 1 步里的每个值都被捕获、并落在第 1 步说的地方；
  每个 `set_secret` 的名字跟 CI 里的 `secrets.*` 引用**精确对应**。
- 告诉用户怎么跑它。如果是可重复的配置路径，就提交它，并从 README 链过去，
  这样下一个人是跑脚本，而不是问 AI。

> **译者注**：什么时候该用 wizard，什么时候不该用？
>
> **该用**：要做的事**只有人能完成**——去第三方控制台点按钮、拿 API key、
> 在没 API 的界面上开一个开关。agent 再强也进不去那个网页。
>
> **不该用**：agent 自己能做的一切。装包、写配置文件、跑迁移脚本——
> 这些直接让它做就行，别做成向导反过来让人操作。
>
> 这个 skill 最聪明的设计是**它只做编排，不做渲染**。
> 进度条、清屏、跨平台开 URL、隐藏输入——全在模板库里，一次写好永不改动；
> 而"这个项目具体要点哪些按钮"是每次唯一变化的部分。
> 这正是[深模块](/skills/engineering/codebase-design/)：
> 小接口（`stage` + 几个 helper），大量行为藏在后面。

---

## 安装

`description` 已改为中英双语。

```yaml
---
name: wizard
description: 生成一个交互式 bash 向导，带着人走完只有人能做的步骤。Generate an interactive bash wizard that walks a human through steps only they can perform. Use when provisioning infrastructure, setting up credentials or CI secrets, walking an unfamiliar third-party dashboard, or running a one-off migration or cutover. Don't invoke this for steps the agent can perform itself.
---
```

原文：[skills/engineering/wizard/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/wizard/SKILL.md)
