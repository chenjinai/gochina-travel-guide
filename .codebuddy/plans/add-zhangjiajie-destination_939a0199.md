---
name: add-zhangjiajie-destination
overview: 为GoChina旅游指南添加张家界（Zhangjiajie）为新目的地，包含中英双语旅游信息、景点元数据、地图坐标、行程卡片等全链路数据。
todos:
  - id: add-image
    content: 在 src/assets/ 下添加 zhangjiajie.jpg 封面图片（暂无图片时可先复制现有城市图片作为临时占位）
    status: completed
  - id: update-meta
    content: 更新 src/lib/attractions-meta.ts：扩展 CityKey 类型、添加张家界5个景点的元数据及 CITY_LABELS
    status: completed
  - id: update-i18n
    content: 更新 src/lib/i18n.tsx：在 destinations.cities 和 itineraries.cities 中添加张家界中英双语翻译数据
    status: completed
  - id: update-map
    content: 更新 src/components/sections/AttractionsMap.tsx：扩展 CityKey、添加 CITY_IMAGES 和 CITY_MAPS 地图数据
    status: completed
    dependencies:
      - add-image
      - update-meta
  - id: update-destinations
    content: 更新 src/components/sections/Destinations.tsx：导入图片并添加张家界到 images 和 keys
    status: completed
    dependencies:
      - add-image
  - id: update-itineraries
    content: 更新 src/components/sections/Itineraries.tsx：导入图片并添加张家界到 images 和 keys
    status: completed
    dependencies:
      - add-image
---

## 用户需求

在现有的 GoChina Guide 旅游指南项目中添加**张家界（Zhangjiajie）**作为第5个目的地。

## 核心功能

- 在导航栏"Destinations"板块增加张家界标签页
- 展示张家界的城市介绍、建议游玩天数、最佳季节等基本信息
- 提供5个核心景点及其详情（含游览时长和强度标注）
- 提供5种必尝美食及其推荐地点
- 在交互式 Leaflet 地图上显示景点标记点，点击可查看弹窗详情
- 支持将景点加入心愿单，参与行程自动规划
- 在 Itineraries 板块增加张家界行程卡片
- 所有内容支持中英文双语切换

## 技术方案

### 涉及文件（共6个）

按照项目现有的分层数据架构，新增张家界需要修改以下文件：

### 1. 数据层 — `src/lib/attractions-meta.ts`

- **CityKey 类型**: 追加 `| "zhangjiajie"`
- **ATTRACTION_META**: 新增 `zhangjiajie` 键，包含5个景点的元数据（各景点对应游览时长和强度等级）
- **CITY_LABELS**: 新增 `zhangjiajie: "Zhangjiajie"` 英文标签

### 2. 国际化 — `src/lib/i18n.tsx`

在 `destinations.cities` 和 `itineraries.cities` 下分别增加 `zhangjiajie` 的中英双语数据：

- **destinations.cities.zhangjiajie**: name、region、tagline、duration、bestTime、intro、attractions[5]、foods[5]
- **itineraries.cities.zhangjiajie**: name、tagline、duration、highlights[4]
- 中英文结构完全对称，值不同

### 3. 地图组件 — `src/components/sections/AttractionsMap.tsx`

- **CityKey 类型**: 追加 `| "zhangjiajie"`
- **CITY_IMAGES**: 新增 `zhangjiajie: zhangjiajieImg` 映射
- **CITY_MAPS**: 新增 `zhangjiajie` 的地图中心坐标、缩放级别、5个景点的经纬度与简介

### 4. 目的地组件 — `src/components/sections/Destinations.tsx`

- 导入 `zhangjiajieImg from "@/assets/zhangjiajie.jpg"`
- `images` 对象追加 `zhangjiajie: zhangjiajieImg`
- `keys` 数组追加 `"zhangjiajie"`

### 5. 行程组件 — `src/components/sections/Itineraries.tsx`

- 导入 `zhangjiajieImg from "@/assets/zhangjiajie.jpg"`
- `images` 对象追加 `zhangjiajie: zhangjiajieImg`
- `keys` 数组追加 `"zhangjiajie"`

### 6. 新增资产 — `src/assets/zhangjiajie.jpg`

需要一张张家界封面图片。若暂无图片，可先存放一张占位图片（如复制现有城市图片临时替代），后续替换为正式图片。

### 技术约束

- **CityKey 类型一致性**: `attractions-meta.ts` 和 `AttractionsMap.tsx` 各自声明 CityKey 联合类型，必须保持同步
- **索引对齐**: `i18n.tsx` 中 attractions 数组的索引顺序与 `attractions-meta.ts` 中的 ATTRACTION_META 索引顺序严格对应
- **planner.tsx 无需修改**: 它从 `attractions-meta.ts` 导入 CityKey 类型，扩展后自动兼容
- **Navbar.tsx 无需修改**: 导航栏仅包含静态锚点链接 `#destinations`，不依赖城市枚举
- 所有代码遵循现有的 Tailwind CSS v4 + shadcn/ui + TypeScript 模式