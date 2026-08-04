# Changesets — 跨业务域输出的唯一出口

本仓库是**一个业务域（domain）的 micro-monorepo**。

## 边界约束

| 场景                                       | 做法                                            |
| ------------------------------------------ | ----------------------------------------------- |
| 本域内子应用使用 `shared-utils`/`ui-package` | 直接 `workspace:*` 引用，源码级联调、热更新生效 |
| **其他业务域**想复用本仓库能力             | **必须走 changeset 发布 npm 包**，禁止跨仓源码引用 |

`config.json` 中 `ignore` 已把三个 `app-*` 应用排除：**子应用只部署、不发包**，
只有 `@demo/shared-utils`、`@demo/ui-package` 是可对外发布的产物。

## 发布流程

```bash
pnpm changeset          # 1. 选包 + 选 semver 级别 + 写变更说明
pnpm version-packages   # 2. 消费 changeset，升版本号 + 生成 CHANGELOG
pnpm release            # 3. 构建 libs 并 npm publish
```
