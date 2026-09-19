---
title: /tdd —— 测试驱动开发
description: 红→绿循环的完整参考：什么算好测试、测试该放在哪个缝上、三种致命反模式，以及循环本身的规则。
---

TDD 就是红 → 绿这个循环。本 skill 是让这个循环产出**值得留下的测试**的参考：
什么算好测试、测试放哪、有哪些反模式、循环的规则是什么。
**每一节在每一轮循环里都适用**——循环前和循环中都要查，不是循环后补。

探索代码库时，读 `CONTEXT.md`（如果存在），让测试命名和接口词汇跟项目的领域语言对齐；
同时尊重你正在触碰那片区域的 ADR。

## 什么算好测试

测试通过**公开接口**验证行为，不验证实现细节。代码可以整个换掉，测试不该跟着变。
好测试读起来像一份规格："user can checkout with valid cart" 明确告诉你存在什么能力，
而且它在重构后依然成立，因为它不关心内部结构。

例子见 [tests.md](#testsmd-好测试与坏测试)，mock 规范见 [mocking.md](#mockingmd-什么时候该-mock)。

## 缝：测试该放哪

**缝（seam）**是你做测试的公开边界：那个让你**不伸手进去就能观察行为**的接口。
测试住在缝上，永远不针对内部实现。

**只在事先商定的缝上测试。** 写任何测试之前，先把要测的缝写下来，跟用户确认。
没确认过的缝上一个测试都不写。你不可能什么都测，
所以**事先把缝谈清楚**，才能让测试精力落在关键路径和复杂逻辑上，而不是撒在每一个边界情况。

问："公开接口是什么？我们该测哪几个缝？"

当接口的形状本身还在争论时（模块该多深、缝该划在哪、接口该暴露什么），
用 Skill 工具调用 `codebase-design` 拿那套词汇。它是模块、接口、深度、缝、
适配器、杠杆、局部性这些词的共享来源；**它是拿来查的参考资料，不是要开一场会话**。

## 反模式

- **与实现耦合（Implementation-coupled）**：mock 内部协作者、测私有方法、
  或者绕开接口从侧信道验证（查数据库而不走接口）。
  识别特征：**重构但行为没变，测试却挂了。**
- **同义反复（Tautological）**：断言用跟代码一样的方式重算了期望值
  （`expect(add(a, b)).toBe(a + b)`、手工按同样方式导出的快照、常数断言等于它自己），
  于是它按构造必然通过，永远不可能跟代码产生分歧。
  期望值必须来自**独立的真相来源**：已知正确的字面量、算好的例子、规格。
- **水平切片（Horizontal slicing）**：先把所有测试写完，再写所有实现。
  批量写出来的测试验证的是**想象中**的行为：你测的是东西的**形状**而不是面向用户的行为，
  测试对真实变化变得不敏感，而且你在还没理解实现的时候就先锁死了测试结构。
  改用**垂直切片**：一个测试 → 一个实现 → 重复，
  每个测试都是一颗**曳光弹（tracer bullet）**，回应上一轮教会你的东西。

## 循环的规则

- **先红后绿。** 先写失败的测试，然后只写够它通过的最少代码。
  不要预判未来的测试，不要加投机性的功能。
- **一次一个切片。** 每轮一个缝、一个测试、一个最小实现。
- **重构不属于这个循环。** 它属于审查阶段（见 `code-review` skill），
  不属于红 → 绿的实现循环。

---

## tests.md —— 好测试与坏测试

### 好测试

**集成风格**：通过真实接口测，而不是测内部零件的 mock。

```typescript
// GOOD: 测可观察的行为
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

特征：

- 测用户/调用方在意的行为
- 只用公开 API
- 内部重构后依然成立
- 描述 **WHAT**，不是 HOW
- 每个测试一个逻辑断言

### 坏测试

**实现细节测试**：跟内部结构耦合。

```typescript
// BAD: 测实现细节
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

危险信号：

- mock 内部协作者
- 测私有方法
- 断言调用次数/顺序
- 重构但行为没变，测试就挂
- 测试名描述的是 HOW 而不是 WHAT
- 绕过接口从外部手段验证

```typescript
// BAD: 绕过接口去验证
test("createUser saves to database", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});

// GOOD: 通过接口验证
test("createUser makes user retrievable", async () => {
  const user = await createUser({ name: "Alice" });
  const retrieved = await getUser(user.id);
  expect(retrieved.name).toBe("Alice");
});
```

**同义反复的测试**：期望值重述了实现，于是测试按构造必然通过。

```typescript
// BAD: 期望值用代码计算它的方式重算了一遍
test("calculateTotal sums line items", () => {
  const items = [{ price: 10 }, { price: 5 }];
  const expected = items.reduce((sum, i) => sum + i.price, 0);
  expect(calculateTotal(items)).toBe(expected);
});

// GOOD: 期望值是一个独立的、已知的字面量
test("calculateTotal sums line items", () => {
  expect(calculateTotal([{ price: 10 }, { price: 5 }])).toBe(15);
});
```

---

## mocking.md —— 什么时候该 mock

**只在系统边界上 mock**：

- 外部 API（支付、邮件等）
- 数据库（有时——优先用测试数据库）
- 时间 / 随机性
- 文件系统（有时）

**不要 mock**：

- 你自己的类 / 模块
- 内部协作者
- 任何你能控制的东西

### 为「可 mock」而设计

在系统边界上，把接口设计成容易 mock 的样子：

**1. 用依赖注入**

把外部依赖传进来，而不是在内部创建：

```typescript
// 容易 mock
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// 难 mock
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**2. 优先用 SDK 风格的接口，而不是通用的 fetcher**

给每个外部操作建一个专门的函数，而不是一个带条件逻辑的通用函数：

```typescript
// GOOD: 每个函数都能独立 mock
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// BAD: mock 里必须写条件逻辑才能 mock
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

SDK 风格意味着：

- 每个 mock 只返回一种确定的形状
- 测试准备里没有条件逻辑
- 更容易看出一个测试覆盖了哪些 endpoint
- 每个 endpoint 各自的类型安全

---

## 安装

`description` 已改为中英双语，用中文也能触发。

```yaml
---
name: tdd
description: 测试驱动开发。当你想要测试先行地开发功能或修 bug、提到 "red-green-refactor"、或需要集成测试时使用。Test-driven development. Use when the user wants to build features or fix bugs test-first, mentions "red-green-refactor", or wants integration tests.
---
```

原文：`skills/engineering/tdd/`（[SKILL.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/SKILL.md) ·
[tests.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/tests.md) ·
[mocking.md](https://github.com/mattpocock/skills/blob/main/skills/engineering/tdd/mocking.md)）
