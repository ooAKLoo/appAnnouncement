# 模板文件结构说明

## 📁 文件组织

模板文件已按设备类型分类组织：

```
templates/
├── Templates.jsx              # 主入口文件，统一导出所有模板
├── MobileTemplates.jsx        # 手机/桌面模板
└── ProductHuntTemplates.jsx   # Product Hunt 模板
```

## 📱 手机/桌面模板 (MobileTemplates.jsx)

包含以下4个模板：

- **ClassicTemplate** - 左文右图布局
- **CenterTemplate** - 居中布局
- **TopBottomTemplate** - 上图下文布局
- **DiagonalTemplate** - 斜角展示布局

这些模板支持 `mobile` 和 `desktop` 设备类型。

## 🏆 Product Hunt 模板 (ProductHuntTemplates.jsx)

包含以下9个模板：

1. **ProductHuntCenterTemplate** - PH 居中布局
2. **ProductHuntTopTemplate** - PH 简约布局
3. **KlavisStrataTemplate** - Strata 代码展示
4. **InfluencerMarketingTemplate** - Marketing 网格卡片
5. **ScrumballTemplate** - Scrumball 倾斜卡片
6. **VoiceAITemplate** - Voice AI 音频播放器
7. **SpeakCreateLaunchTemplate** - Speak & Create 双设备
8. **PalifyTemplate** - Palify 设备对比
9. **ClipsTemplate** - Clips 多手机展示

这些模板支持 `product-hunt` 设备类型。

## 🔧 使用方式

所有模板通过主入口文件 `Templates.jsx` 统一导出：

```javascript
import {
  ClassicTemplate,           // 手机模板
  ProductHuntCenterTemplate  // Product Hunt 模板
} from './templates/Templates';
```

## ✏️ 添加新模板

### 1. 添加模板组件

根据设备类型选择对应文件：
- 手机/桌面模板 → `MobileTemplates.jsx`
- Product Hunt 模板 → `ProductHuntTemplates.jsx`

### 2. 导出模板

在对应文件中 export 新模板组件。

### 3. 更新主入口

在 `Templates.jsx` 中添加导出：

```javascript
export { NewTemplate } from './MobileTemplates';
```

### 4. 添加模板数据

在 `data/` 目录对应的数据文件中添加模板数据配置。
