# CODEBUDDY.md 本文件为 CodeBuddy 在本仓库中工作提供指导。

## 常用命令

- **启动开发服务器**: `npm run dev`（或 `npx vite dev`）。在沙箱/Lovable 环境中，服务器强制使用 8080 端口和 `::` 主机。非沙箱环境默认使用 8080 端口，若被占用则回退到 8081+。
- **生产构建**: `npm run build` — 通过 Vite+Nitro 打包客户端和服务端，目标部署为 Cloudflare Workers。
- **开发/预发布构建**: `npm run build:dev` — 以 `--mode development` 模式构建。
- **预览生产构建**: `npm run preview` — 在本地启动构建产物预览服务。
- **代码检查**: `npm run lint` — 运行 ESLint 9，含 TypeScript、React Hooks 和 Prettier 插件。
- **代码格式化**: `npm run format` — 对整个项目运行 Prettier。

## 架构概览

### 技术栈
**TanStack Start**（React 19 SSR 框架）+ **TypeScript**，样式使用 **Tailwind CSS v4** + **shadcn/ui**（基于 Radix 原语，New York 风格）。SSR 由 **Nitro** 驱动，部署目标为 **Cloudflare Workers**。路由使用 **TanStack Router**，采用基于文件系统的约定。地图使用 **Leaflet/React-Leaflet**，PDF 生成使用 **jsPDF**，图表使用 **Recharts**。

### 项目定位
**GoChina Guide** — 面向来华外国游客的双语（英文/中文）旅游指南单页面网站。所有内容在 `/` 路由上以长卷轴落地页形式呈现，覆盖目的地、行程规划和实用生存指南（支付、签证、上网）等板块。

### 路由架构
TanStack Router 从 `src/routes/` 目录自动生成 `src/routeTree.gen.ts`。**请勿手动编辑此文件。** 当前路由如下：

| 路由 | 文件 | 用途 |
|-------|------|---------|
| `__root__` | `src/routes/__root.tsx` | 应用外壳：`<html>`、`<head>` 元数据、Provider 嵌套、错误/404边界、全局 `WishlistSidebar` |
| `/` | `src/routes/index.tsx` | 首页 — 按滚动顺序组装所有 Section 组件 |
| `/sitemap.xml` | `src/routes/sitemap[.]xml.ts` | 服务端 GET 处理器，返回 XML 站点地图 |

### 路由器与数据获取设置
`src/router.tsx` 从 `@tanstack/react-query` 创建 `QueryClient` 并注入到路由上下文中。`getRouter()` 工厂函数按请求调用（SSR 安全）。目前未使用 `useQuery`/`useMutation` 钩子——所有内容均为静态定义——但 React Query 基础设施已完整接入，为未来的 API 集成预留。`scrollRestoration` 已启用；`defaultPreloadStaleTime` 设为 0。

### Section 组件 (`src/components/sections/`)
所有落地页内容以顺序 Section 形式组织，在 `src/routes/index.tsx` 中组装：

- **Navbar** — 粘性导航栏，支持锚点平滑滚动和中英文语言切换（EN/中文）
- **Hero** — 轮播背景（4 张城市图片）、搜索框、动画统计数据
- **Destinations** — 四城 Tab 切换浏览器（北京、上海、西安、南京），含景点、美食和心愿单收藏按钮
- **AttractionsMap** — 基于 Leaflet 的交互式地图，按城市切换标记点
- **Itineraries** — 4 张预置行程卡片（图片 + 标签 + 天数）
- **SurvivalKit** — 3 张入口卡片，分别触发弹窗：PaymentGuide、VisaGuide、InternetGuide
- **Footer** — 链接列表与版权信息

### 弹层/模态框组件
- **WishlistSidebar**（Sheet/Drawer）— 心愿单管理面板；"生成行程"按钮触发规划器
- **ItineraryModal**（Dialog）— 按天展示行程，含体力消耗平衡
- **PaywallModal**（Dialog）— 模拟支付流程（$4.99）→ 通过 jsPDF 导出 PDF
- **PaymentGuide / VisaGuide / InternetGuide** — 完整内容的详细指南弹窗

### 状态管理
无外部状态库，使用两个 React Context 管理全局状态：

1. **LanguageProvider**（`src/lib/i18n.tsx`）— `en`/`zh` 切换，持久化到 `localStorage`，设置 `<html lang>` 属性。所有可翻译字符串存储在统一的 `translations` 对象中，按语言代码索引。
2. **PlannerProvider**（`src/lib/planner.tsx`）— 心愿单数组（`WishlistItem[]`），提供 `toggle`（添加/移除）和 `planItinerary()` 方法。规划算法按城市分组，每半天最多 1 个高强度景点，每天上限 8 小时。

此外，`src/hooks/use-mobile.tsx` 提供 `useIsMobile()` 钩子（768px 断点）。

### 数据层 — 静态内容
**没有后端 API。** 所有旅游内容（景点描述、美食推荐、签证规则、支付步骤等）硬编码在：
- `src/lib/i18n.tsx` — `translations` 对象（双语，按 `en`/`zh` 索引）
- `src/lib/attractions-meta.ts` — 景点元数据（游览时长、强度等级）
- `src/components/sections/AttractionsMap.tsx` — `CITY_MAPS` 对象，含地理坐标和标记数据
- 各 Section 组件内联持有各自的展示数据

### 服务端 / SSR 架构
SSR 采用为 Cloudflare Workers 设计的**三层错误处理链**：

1. **TanStack Start 中间件**（`src/start.ts`）— `createMiddleware().server()` 用 try/catch 包裹每个请求；非 HTTP 错误渲染静态 500 HTML 页面。
2. **CF Worker fetch 处理器**（`src/server.ts`）— 生产入口导出 `fetch(request, env, ctx)` 处理器。懒加载 `@tanstack/react-start/server-entry`，捕获错误。同时会规范化"灾难性"SSR 响应——当 h3 将原始错误吞没为通用的 `{"unhandled":true}` JSON 体时进行恢复。
3. **全局错误捕获**（`src/lib/error-capture.ts`）— 钩入 `unhandledrejection`/`error` 事件，保存 h3 丢弃的堆栈跟踪，使 `consumeLastCapturedError()` 可用于日志记录。

`src/lib/config.server.ts` 遵循 **TanStack Start `.server.ts` 约定**——该文件后缀确保代码仅在服务端运行，绝不会被打包到客户端代码中。ESLint 配置明确禁止 `server-only` 导入（Next.js 模式），转而使用此约定。

### UI 组件体系（`src/components/ui/`）
约 45 个 shadcn/ui 组件，基于 Radix UI 原语构建，通过 `components.json` 配置（New York 风格、Slate 基础色、CSS 变量）。`src/lib/utils.ts` 中的 `cn()` 工具函数组合了 `clsx` + `tailwind-merge`。所有组件使用 `@/` 路径别名指向 `./src/`。

### 样式体系（`src/styles.css`）
Tailwind v4，通过 `@theme inline` 定义语义化颜色 token，使用 `oklch` 色彩空间。浅色和深色模式通过 `:root` 与 `.dark` 选择器定义。品牌色为暖金色（`oklch(0.55 0.125 45)`）。自定义属性包括 `--brand`、`--brand-glow`、`--ink`、`--cream`。字体：Inter（无衬线正文）和 Playfair Display（衬线标题），通过 Google Fonts 加载，在 `__root.tsx` 中使用 preconnect 提示。

### 构建与部署流程
1. **Vite** 打包客户端资源并调用插件：React、Tailwind CSS、tsconfig paths
2. **Nitro**（由 `@lovable.dev/vite-tanstack-config` 自动配置）处理 SSR 服务端构建，默认目标为 Cloudflare Workers
3. `vite.config.ts` 使用 `@lovable.dev/vite-tanstack-config` 的 `defineConfig`，它自动注入：`tanstackStart`、`viteReact`、`tailwindcss`、`tsConfigPaths`、`nitro`（仅构建时）、`componentTagger`（仅开发时）、环境变量注入、`@` 路径别名和沙箱检测
4. 在沙箱/Lovable 环境中，强制启用 `port: 8080`、`strictPort: true`、`host: "::"`；同时激活 HMR 网关和 dev-server bridge 插件

### 关键模式与约定
- **`.server.ts` 后缀**标记仅服务端模块（TanStack Start 约定，非 Next.js 的 `server-only`）
- **无 `use client` 指令** — TanStack Start 通过文件系统路由和 `.server.ts` 命名来确定客户端/服务端分离
- **`createServerFn`**（示例见 `src/lib/api/example.functions.ts`）是 TanStack Start 的 RPC 风格服务端函数模式，配合 Zod 输入验证
- **`src/routeTree.gen.ts`** 从路由目录自动生成 — 切勿手动编辑
- **`src/lib/`** 包含工具函数、Context 和纯数据模块；**`src/hooks/`** 包含 React 钩子；**`src/components/ui/`** 包含 shadcn 原语组件；**`src/components/sections/`** 包含页面级内容区块
