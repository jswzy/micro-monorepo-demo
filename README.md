# micro-monorepo-demo

> **架构模式：一仓 = 一个业务域（micro-monorepo）**
> `packages` 内 = 多个「独立可部署子应用」+ 「域内公共包」
> 技术栈：pnpm workspace + Vite 6 + Vue 3 + TypeScript 5（+ Turbo 增量构建 + Changesets）

---

## 一、这是什么，不是什么

| | micro-monorepo（本仓） | 传统 monorepo | 多仓多应用 |
| --- | --- | --- | --- |
| 仓库粒度 | **一个业务域一仓** | 全公司/全产品一仓 | 一应用一仓 |
| 运行时形态 | **多个独立微应用** | 通常一个大应用 | 多个独立应用 |
| 开发时形态 | **同仓统一管理** | 同仓 | 分散 |
| 部署 | **每个 app 独立打包、独立发布** | 整体发布 | 独立发布 |
| 公共代码 | 域内 `workspace:*` 直连源码 | 同上 | 只能发 npm |
| 跨域复用 | **必须 changeset 发 npm 包** | — | 发 npm 包 |

一句话：**开发时是一个仓库，运行时是一组独立应用。**

---

## 二、目录结构

```
micro-monorepo-demo/
├── pnpm-workspace.yaml        # pnpm 单仓核心配置（含 catalog 统一版本）
├── package.json               # 根目录公共脚本、公共 devDependencies
├── tsconfig.json              # 全局 TS 配置（所有包 extends 继承）
├── .eslintrc.js               # 全局 ESLint（全部包复用，子包不再各写一套）
├── .prettierrc                # 全局 Prettier
├── turbo.json                 # Turbo 增量构建 / 任务编排
├── .changeset/                # 跨业务域输出的唯一出口
└── packages/
    ├── app-main/              # 基座应用（wujie 微前端基座，独立部署）
    ├── app-order/             # 子应用 1：订单模块（独立打包部署）
    ├── app-goods/             # 子应用 2：商品模块（独立打包部署）
    ├── ui-package/            # 域内公共组件库（仅当前域使用）
    └── shared-utils/          # 通用工具、常量、请求、类型定义
```

| 包名 | 角色 | 端口(dev) | 部署形态 |
| --- | --- | --- | --- |
| `@demo/app-main` | 基座 | 5173 | 独立部署（根路径 `/`） |
| `@demo/app-order` | 微应用 | 5174 | 独立部署（`/sub/order/`） |
| `@demo/app-goods` | 微应用 | 5175 | 独立部署（`/sub/goods/`） |
| `@demo/ui-package` | 域内组件库 | — | 随子应用打包 / changeset 发包 |
| `@demo/shared-utils` | 域内工具库 | — | 随子应用打包 / changeset 发包 |

---

## 三、快速开始

```bash
# 1. 根目录一键安装所有包依赖
pnpm install

# 2. 一键启动全部应用（基座 + 2 个子应用，Turbo 并行）
pnpm dev
#    基座        http://localhost:5173
#    订单子应用  http://localhost:5174
#    商品子应用  http://localhost:5175

# 3. 或者只启动单个应用
pnpm dev:order
pnpm dev:goods
pnpm dev:main
```

> 完整微前端效果请访问基座 <http://localhost:5173>，
> 左侧「订单中心 / 商品中心」由基座通过 wujie 加载对应子应用；
> 直接访问 5174 / 5175 则是子应用**独立运行**形态（页面顶部会显示"独立运行"标记）。

---

## 四、验收标准逐条对照

### ✅ 基础能力

| 验收项 | 实现位置 |
| --- | --- |
| `pnpm install` 一键安装所有包 | `pnpm-workspace.yaml` + `.npmrc`（`link-workspace-packages=true`） |
| 子应用引用 `@demo/shared-utils`、`@demo/ui-package` | 各 app `package.json` 中 `"workspace:*"` |
| 改公共组件/工具，子应用**热更新实时生效** | 公共包 `exports` 指向 `src/*.ts`，各 app `optimizeDeps.exclude` 排除预构建 |
| 单独启动单个应用 | `pnpm dev:order` → `pnpm --filter @demo/app-order dev` |
| 单独打包单个应用 | `pnpm build:order` → `turbo run build --filter=@demo/app-order` |

**热更新自测**：`pnpm dev` 后打开 5174，修改
`packages/ui-package/src/components/DemoTag.vue` 的圆角或
`packages/shared-utils/src/format.ts` 的 `formatMoney`，页面无刷新即时变化。

### ✅ TS 能力

- 公共包 `types` 直接指向 `src/index.ts`，子应用 `import { formatMoney } from '@demo/shared-utils'` 即获得完整签名与跳转。
- `TableColumn<OrderEntity>` 的 `key` 被约束为 `OrderEntity` 的字段名，写错字段编译期报错。
- 所有 `packages/*/tsconfig.json` 均为 `"extends": "../../tsconfig.json"`，只覆盖 `types`/`include`，零重复配置。
- 跨应用通信事件（`MicroEventPayload`）也有类型契约，基座与子应用共用。

```bash
pnpm typecheck   # 全仓类型检查（Turbo 增量）
```

### ✅ 工程规范

- 全局唯一 `.eslintrc.js` + `.prettierrc`，子包**不允许**再放配置文件。
- 包命名统一 `@demo/xxx` 内部命名空间。
- ESLint 内置边界规则：公共包禁止 `import '@demo/app-*'`（防止公共层反向依赖业务层）。

```bash
pnpm lint        # 全仓 lint（--max-warnings 0）
pnpm format      # 全仓格式化
```

### ✅ micro-monorepo 灵魂特征

1. **每个 app 独立打包**：`pnpm build:order` 只产出 `packages/app-order/dist`。
2. **每个 app 独立部署**：产物自带 `base`（`/sub/order/`），可换成独立域名，
   通过 `VITE_PUBLIC_BASE=https://order.example.com/ pnpm build:order` 覆盖。
3. **运行时是多个独立应用**：基座用 wujie 在运行时加载子应用，
   子应用不在基座的构建产物里，各自有独立的发布节奏。
4. **开发时统一管理**：一次 `pnpm install`，一次 `pnpm dev`，公共包源码级联调。

---

## 四·五、两个子应用之间如何传值（核心实战）

运行时每个 app 是独立应用，它们靠 **wujie 共享 bus** 互通（基座、订单、商品三方共用同一个 host bus 实例）。`shared-utils` 把它封装成 `microBus`，并提供「事件」与「共享状态」两套机制：

### 1) 事件传值（一次性通知）

```ts
import { microBus } from '@demo/shared-utils'

// 商品域 -> 订单域：把选中的商品推过去
microBus.emit('goods:pick', { sku, name, price, source: 'app-goods' })

// 订单域监听（也来自商品域）
microBus.on('goods:pick', (payload) => { /* 实时收到 */ })
```

内置事件契约（类型安全，写错字段/事件名编译期报错）：

| 事件 | 方向 | 载荷 |
| --- | --- | --- |
| `goods:pick` | 商品域 → 订单域 | `{ sku, name, price, source }` |
| `order:focus-goods` | 订单域 → 商品域 | `{ goodsName, source }` |

### 2) 共享状态（响应式同步，像本地 ref 一样用）

```ts
import { useSharedState } from '@demo/ui-package'

// 订单域写入
const { value, set } = useSharedState('cross:customer', '', 'app-order')
set('张三')

// 商品域订阅同一份 key，value 自动同步更新
const { value } = useSharedState('cross:customer', '', 'app-goods')
// value 即「张三」
```

底层 = `shared-utils/src/store.ts`（`getShared/setShared/subscribeShared`），经 `microBus` 广播；Vue 响应式封装在 `ui-package` 的 `useSharedState`。

### 3) 体验路径（启动 `pnpm dev` 后访问基座 http://localhost:5173）

- **订单中心**：点表格「推给商品域」→ 商品中心对应商品**高亮**（事件传值）。
- **商品中心**：点「推给订单域 / 随机推给订单域」→ 订单中心「② 商品域 → 订单域」卡片**实时收到**（事件传值）。
- **订单中心**：在「共享状态」输入框填客户名 → 商品中心顶部 banner **实时同步**（响应式共享状态）。
- **基座仪表盘**：「跨应用通信总线」面板滚动展示 bus 上的所有事件，是子应用互相传值的直接证据。

---

## 五、边界约束（重要）

```
┌─────────────────────── 交易业务域（本仓库） ───────────────────────┐
│                                                                    │
│   app-main   app-order   app-goods                                 │
│      │           │           │                                     │
│      └───────────┴───────────┘   workspace:*  直连源码 ✅          │
│                  │                                                 │
│          ui-package / shared-utils                                 │
│                                                                    │
└────────────────────────────┬───────────────────────────────────────┘
                             │  ⛔ 禁止跨仓源码引用
                             │  ✅ 只能通过 changeset 发布 npm 包
                             ▼
                     其他业务域（供应链域 / 结算域 …）
```

- **域内**：`app-*` 直接 `workspace:*` 引用公共包，改代码立即生效，不需要发版。
- **跨域**：其他业务域要用本仓能力，**必须**执行 changeset 发 npm 包；
  禁止相对路径穿透、禁止 git submodule 直连源码。
- `.changeset/config.json` 已把三个 `app-*` 加入 `ignore`：
  **子应用只部署、不发包**，只有 `shared-utils` / `ui-package` 是可对外发布的产物。

```bash
pnpm changeset          # 1. 选包 + semver + 变更说明
pnpm version-packages   # 2. 升版本 + 生成 CHANGELOG
pnpm release            # 3. 构建 libs 并 npm publish
```

---

## 六、命令速查

| 命令 | 说明 |
| --- | --- |
| `pnpm install` | 根目录一键安装全部包依赖 |
| `pnpm dev` | Turbo 并行启动全部应用 |
| `pnpm dev:main` / `dev:order` / `dev:goods` | 单独启动某个应用 |
| `pnpm build` | 构建全部（按依赖图拓扑排序 + 增量缓存） |
| `pnpm build:main` / `build:order` / `build:goods` | 单独打包某个应用 |
| `pnpm build:libs` | 只构建两个公共包（发包前用） |
| `pnpm preview:order` | 预览订单子应用构建产物（:4174） |
| `pnpm typecheck` | 全仓类型检查 |
| `pnpm lint` / `pnpm lint:fix` | 全仓代码检查 |
| `pnpm format` | 全仓格式化 |
| `pnpm changeset` | 新建一条变更集（跨域发包用） |
| `pnpm clean` | 清理 dist / turbo 缓存 |

---

## 七、生产部署示例（Nginx）

三个应用各自 CI、各自产物、各自发布节奏：

```nginx
server {
    listen 80;
    server_name trade.example.com;

    # 基座
    location / {
        root /var/www/app-main;
        try_files $uri $uri/ /index.html;
    }

    # 订单子应用（独立部署目录，独立发版）
    location /sub/order/ {
        alias /var/www/app-order/;
        try_files $uri $uri/ /sub/order/index.html;
        add_header Access-Control-Allow-Origin *;
    }

    # 商品子应用
    location /sub/goods/ {
        alias /var/www/app-goods/;
        try_files $uri $uri/ /sub/goods/index.html;
        add_header Access-Control-Allow-Origin *;
    }
}
```

若改为**独立域名**部署（更彻底的隔离），构建时覆盖 base 即可：

```bash
VITE_PUBLIC_BASE=https://order.example.com/ pnpm build:order
```

并把 `packages/shared-utils/src/constants.ts` 中 `MICRO_APPS[].url` 换成对应域名。

---

## 八、关键实现说明

### 1. 为什么公共包 `exports` 指向 `src` 而不是 `dist`

只有指向源码，Vite 才会把公共包当成项目内文件处理，
配合各 app 的 `optimizeDeps.exclude`，才能做到 **改公共包 → 子应用 HMR 实时生效**。
发 npm 包时由 `publishConfig` 自动切换到 `dist` 产物，两不耽误。

### 2. 微前端方案选型

选 **wujie（无界）**：iframe + WebComponent 沙箱，对 Vite ESM 子应用天然友好，
子应用接入成本只有 `bootstrapMicroApp({ mount, unmount })` 一行
（该适配逻辑本身也沉淀在 `@demo/shared-utils/src/micro.ts`，两个子应用共用）。

### 3. 子应用如何做到「既能独立跑、又能被基座加载」

`packages/shared-utils/src/micro.ts` 里判断 `window.__POWERED_BY_WUJIE__`：
- 有 → 注册 `__WUJIE_MOUNT` / `__WUJIE_UNMOUNT` 生命周期
- 没有 → 直接 `mount()`

业务代码完全无感知，同一份代码两种运行形态。
