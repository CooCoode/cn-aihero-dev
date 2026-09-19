---
title: /migrate-to-shoehorn —— 测试里别再写 as
description: 把测试文件里的 `as` 类型断言迁移到 @total-typescript/shoehorn。只用于测试代码，绝不用于生产代码。
---

# 迁移到 shoehorn

## 为什么要 shoehorn

`shoehorn` 让你在测试里传部分数据，同时让 TypeScript 满意。
它用类型安全的替代品换掉 `as` 断言。

**只用于测试代码。绝不在生产代码里用 shoehorn。**

测试里用 `as` 的问题：

- 你已经被训练成不该用它
- 必须手工指定目标类型
- 故意传错数据时要写双重 `as`（`as unknown as Type`）

## 安装

```bash
npm i @total-typescript/shoehorn
```

## 迁移模式

### 大对象、只用得上几个属性

改前：

```ts
type Request = {
  body: { id: string };
  headers: Record<string, string>;
  cookies: Record<string, string>;
  // ...还有 20 个属性
};

it("gets user by id", () => {
  // 只关心 body.id，但必须伪造整个 Request
  getUser({
    body: { id: "123" },
    headers: {},
    cookies: {},
    // ...伪造全部 20 个属性
  });
});
```

改后：

```ts
import { fromPartial } from "@total-typescript/shoehorn";

it("gets user by id", () => {
  getUser(
    fromPartial({
      body: { id: "123" },
    }),
  );
});
```

### `as Type` → `fromPartial()`

改前：

```ts
getUser({ body: { id: "123" } } as Request);
```

改后：

```ts
import { fromPartial } from "@total-typescript/shoehorn";

getUser(fromPartial({ body: { id: "123" } }));
```

### `as unknown as Type` → `fromAny()`

改前：

```ts
getUser({ body: { id: 123 } } as unknown as Request); // 故意用错类型
```

改后：

```ts
import { fromAny } from "@total-typescript/shoehorn";

getUser(fromAny({ body: { id: 123 } }));
```

## 各函数用在哪

| 函数 | 使用场景 |
| --- | --- |
| `fromPartial()` | 传部分数据，且仍然通过类型检查 |
| `fromAny()` | 故意传错数据（保留自动补全） |
| `fromExact()` | 强制传完整对象（以后可以换成 fromPartial） |

## 工作流

1. **收集需求**——问用户：
   - 哪些测试文件的 `as` 断言在制造麻烦？
   - 是不是在处理大对象，而只有部分属性要紧？
   - 是否需要故意传错数据来测错误分支？

2. **安装并迁移**：
   - [ ] 安装：`npm i @total-typescript/shoehorn`
   - [ ] 找出带 `as` 断言的测试文件：
         `grep -r " as [A-Z]" --include="*.test.ts" --include="*.spec.ts"`
   - [ ] 把 `as Type` 换成 `fromPartial()`
   - [ ] 把 `as unknown as Type` 换成 `fromAny()`
   - [ ] 加上从 `@total-typescript/shoehorn` 的 import
   - [ ] 跑类型检查验证

> **译者注**：`shoehorn` 是 Matt 自己做的库（`@total-typescript` scope），
> 所以这个 skill 同时是一份安装指南和一份库的介绍。
>
> 它解决的问题很具体：**测试的输入数据往往只需要一小部分字段**，
> 但类型系统要求完整对象。
> 于是测试里堆满 `as Request` 这样的断言，而断言会**静默地关掉类型检查**——
> 你改了一个字段名，生产代码报错，测试却照样过。
>
> `fromPartial()` 保留了"只给部分字段"的便利，但把类型检查留着。
> 区别在**改字段名的时候测试会跟着红**。
>
> `fromAny()` 更微妙：它用于**故意传错数据**测错误分支的场景，
> 而且保留了自动补全——纯 `as` 会连补全都失去。

---

## 安装

`description` 已改为中英双语。

```yaml
---
name: migrate-to-shoehorn
description: 把测试文件里的 `as` 类型断言迁移到 @total-typescript/shoehorn。Migrate test files from `as` type assertions to @total-typescript/shoehorn. Use when user mentions shoehorn, wants to replace `as` in tests, or needs partial test data.
---
```

原文：[skills/misc/migrate-to-shoehorn/SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/misc/migrate-to-shoehorn/SKILL.md)
