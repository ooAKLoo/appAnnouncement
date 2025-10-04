# App Announcement Builder

> 一个专业的应用宣传图生成工具，帮助开发者快速创建精美的 App 发布图和宣传素材

## 📖 产品简介

App Announcement Builder 是一款面向移动应用开发者、产品经理和市场推广人员的可视化宣传图制作工具。无需设计技能，即可快速生成专业级的应用发布图、Product Hunt 发布图、社交媒体宣传图等。

## 🎯 产品目的

### 解决的痛点

1. **设计门槛高**：传统设计工具（Figma、Photoshop）学习成本高，非设计人员难以上手
2. **制作效率低**：从零开始设计一张宣传图需要数小时甚至数天
3. **模板不匹配**：通用模板难以满足特定应用场景（如 Product Hunt 发布）
4. **重复劳动多**：每次发布新版本都要重新调整文案和截图

### 我们的方案

- ✅ **零设计基础**：拖拽式编辑，所见即所得
- ✅ **5分钟出图**：选择模板，填写内容，一键导出
- ✅ **场景化模板**：针对 Product Hunt、App Store、社交媒体等场景优化
- ✅ **智能复用**：保存配置，下次只需更换截图和文案

## 🚀 使用场景

### 1. Product Hunt 发布

创建符合 Product Hunt 规范的精美发布图，提升产品在社区的曝光度。

**适用于**：
- 新产品首次发布
- 重大版本更新
- 获奖展示

**推荐模板**：
- `Product Hunt Center` - 居中布局，突出产品图标
- `Product Hunt Top` - 简约风格，强调产品标语
- `Voice AI` - 适合音频/AI 类应用
- `Palify` - 多设备对比展示

### 2. App Store 宣传

制作 App Store 预览图和宣传海报，提高应用下载转化率。

**适用于**：
- App Store 提交素材
- 应用市场推广
- 官网展示

**推荐模板**：
- `Classic` - 水平布局，展示功能特性
- `Center` - 垂直布局，突出核心价值

### 3. 社交媒体推广

快速生成适合 Twitter、LinkedIn、微信等平台的宣传图。

**适用于**：
- 新功能发布公告
- 用户增长里程碑
- 节日活动宣传

### 4. 内部演示

为产品演示、投资路演、团队汇报创建专业素材。

## ✨ 核心功能

### 📐 多样化模板

#### 移动/桌面模板
- **水平布局（Classic）**：左侧文字说明 + 右侧设备展示
- **垂直布局（Center）**：上下堆叠，层次分明

#### Product Hunt 专用模板
- **PH 居中**：图标居中，支持下载按钮
- **PH 简约**：浅色主题，标语展示
- **Voice AI**：音频/AI 应用专用，支持截图展示
- **Palify**：多设备对比，黑白双主题

### 🎨 可视化编辑

#### 文本编辑
- 实时编辑应用名称、标语、描述
- 支持字体、大小、颜色、对齐方式调整
- 拖拽定位，像素级精准控制

#### 图片管理
- 上传应用图标和截图
- 支持圆角、边框、阴影、滤镜
- 图片适配方式：填充、包含、拉伸、缩小
- 翻转和旋转功能

#### 设备模型
- **3D 模型**：真实感手机/MacBook 模型
- **2D 模型**：扁平化设备展示
- 自由旋转、缩放、定位
- 支持截图自动适配设备屏幕

### 🎯 高级功能

#### 样式系统
- 20+ 预设配色方案
- 渐变背景（线性、径向、锥形）
- 自定义背景图片
- 全局样式一键应用

#### 模板编辑模式
- Figma 风格的调整手柄
- 8个方向尺寸调整
- 旋转手柄（4个角）
- 实时角度和尺寸显示

#### 交互优化
- 多选拖拽（Ctrl/Cmd + 点击）
- 框选批量选择
- 右键菜单快捷操作
- Delete 删除选中元素

### 📤 导出功能

- **高质量导出**：支持 PNG 格式
- **自定义尺寸**：预设常用尺寸或自定义
- **缩放导出**：支持 0.5x - 2x 缩放

## 🛠️ 技术架构

### 前端技术栈

- **React 18**：组件化开发
- **Three.js**：3D 模型渲染
- **Tailwind CSS**：快速样式开发
- **Lucide Icons**：轻量级图标库

### 核心设计模式

- **Canvas 坐标系统**：像素级精准定位
- **数据驱动渲染**：模板配置化
- **组件化架构**：可复用的编辑组件

## 📦 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 💡 使用指南

### 1. 选择设备类型

在顶部选择器中选择：
- **Mobile**：手机设备
- **Desktop**：桌面设备（MacBook）
- **Product Hunt**：Product Hunt 发布图

### 2. 选择模板

从模板面板中选择适合的模板布局。

### 3. 填写内容

在侧边栏中编辑：
- **应用信息**：名称、标语、描述
- **图标**：上传应用图标
- **截图**：上传应用截图（可选）

### 4. 调整样式

- **背景**：选择配色方案或自定义背景
- **模型**：调整设备位置和角度（2D 模式）
- **文字**：自定义字体样式和颜色

### 5. 导出图片

点击右上角导出按钮，选择尺寸和缩放比例，下载 PNG 图片。

## 🎓 高级技巧

### 模板编辑模式

开启后可以：
- 调整元素尺寸（8个调整手柄）
- 旋转元素（4个旋转手柄）
- 生成模板配置代码

### 多选操作

- **Ctrl/Cmd + 点击**：多选元素
- **框选**：按住鼠标拖拽框选区域
- **批量删除**：选中多个元素后按 Delete

### 自定义模板

编辑 `src/data/productHunt/productHuntTemplateData.js` 或 `src/data/mobile/mobileTemplateData.js`，添加自定义模板配置。

## 📚 文档结构

```
src/
├── components/          # React 组件
│   ├── common/         # 通用组件（Editable, StyledText）
│   ├── models/         # 设备模型（3D/2D）
│   ├── sidebars/       # 侧边栏面板
│   └── DynamicComponent.jsx  # 动态组件渲染器
├── context/            # 全局状态管理
├── data/               # 模板数据和配置
│   ├── styleConfig.js  # 样式配置
│   ├── templateConfig.jsx  # 模板配置
│   ├── mobile/         # 移动模板数据
│   └── productHunt/    # Product Hunt 模板数据
└── utils/              # 工具函数
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

### 添加新模板

1. 在 `src/data/productHunt/productHuntTemplateData.js` 中添加模板函数
2. 在 `src/data/templateData.js` 中注册模板
3. 在 `src/data/templateConfig.jsx` 中添加模板配置

### 添加新样式

在 `src/data/styleConfig.js` 中的 `STYLES` 对象添加新配色方案。

## 📄 许可证

MIT License

## 🙏 致谢

- [Three.js](https://threejs.org/) - 3D 图形渲染
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [Lucide Icons](https://lucide.dev/) - 图标库
- [Figma](https://figma.com/) - 交互设计灵感

---

**Made with ❤️ for App Developers**
