# 设备模型规范文档

本文件夹包含所有设备展示模型组件（手机、电脑等）。每个模型负责渲染设备外观并在屏幕区域显示用户上传的截图。

## 📁 当前模型

- `PhoneModel.jsx` - 3D 手机模型
- `PhoneModel2D.jsx` - 2D 手机模型（iPhone 17）
- `MacBookModel2D.jsx` - 2D MacBook 模型（MacBook Pro M4 16-inch）

## 📐 添加新模型的步骤

### 1. 在 Figma 中测量屏幕区域

#### 准备工作
1. 将设备 PNG 图片导入 Figma
2. 记录设备整体尺寸

#### 测量屏幕区域
1. 按 `R` 键创建矩形
2. 调整矩形完全贴合屏幕可视区域
3. 记录以下数据：

```
设备整体:
  width: [设备总宽度]
  height: [设备总高度]
  X: [设备左上角X坐标]
  Y: [设备左上角Y坐标]

屏幕区域:
  width: [屏幕宽度]
  height: [屏幕高度]
  X: [屏幕左上角X坐标]
  Y: [屏幕左上角Y坐标]
  border-radius: [圆角值，如: 23px 23px 0 0]
```

```
/* MacBook Pro M4 16-inch Silver 1 */

position: absolute;
width: 2048px;
height: 1349.5px;

background: url(MacBook Pro M4 16-inch Silver.png);
border-radius: 0px;
x:6394
Y:-10319


/* Frame 7矩形 */

position: relative;
width: 1632px;
height: 1058px;

background: rgba(238, 0, 0, 0.2);
border-radius: 23px 23px 0px 0px;
X:6602
Y:-10173
```

### 2. 计算关键参数

```javascript
// 偏移量计算
const leftOffset = 屏幕X - 设备X;        // 左边距
const topOffset = 屏幕Y - 设备Y;         // 顶部距

// 比例计算
const widthRatio = 屏幕宽度 / 设备宽度;
const heightRatio = 屏幕高度 / 设备高度;

// 屏幕宽高比（用于图片裁剪）
const screenRatio = 屏幕宽度 / 屏幕高度;
```

### 3. 实际案例参考

#### MacBook Pro M4 16-inch

**Figma 测量数据：**
```
设备整体:
  width: 2048px
  height: 1349.5px
  X: 6394
  Y: -10319

屏幕区域:
  width: 1632px
  height: 1058px
  X: 6602
  Y: -10173
  border-radius: 23px 23px 0px 0px
```

**计算结果：**
```javascript
// 偏移量
const leftOffset = 6602 - 6394 = 208px
const topOffset = -10173 - (-10319) = 146px

// 比例
const widthRatio = 1632 / 2048 ≈ 0.797 (79.7%)
const heightRatio = 1058 / 1349.5 ≈ 0.784 (78.4%)
const topRatio = 146 / 1349.5 ≈ 0.108 (10.8%)
const leftRatio = 208 / 2048 ≈ 0.102 (10.2%)

// 屏幕比例
const screenRatio = 1632 / 1058 ≈ 1.542
```

**应用到代码：**
```jsx
<div
  className="absolute z-10"
  style={{
    top: `${deviceHeight * (146 / 1349.5)}px`,
    left: `${deviceWidth * (208 / 2048)}px`,
    width: `${deviceWidth * (1632 / 2048)}px`,
    height: `${deviceHeight * (1058 / 1349.5)}px`,
    borderRadius: '23px 23px 0 0',
    overflow: 'hidden',
    backgroundColor: '#000'
  }}
>
  <img src={screenContent} ... />
</div>
```

#### iPhone 17

**Figma 测量数据：**
```
设备整体:
  width: 430px
  height: 879px

屏幕区域:
  width: 384px
  height: 835px
  topOffset: 22px
  leftOffset: 23px
  border-radius: 60px
```

**计算结果：**
```javascript
const screenRatio = 384 / 835 ≈ 0.460
const topRatio = 22 / 879 ≈ 0.025 (2.5%)
const leftRatio = 23 / 430 ≈ 0.0535 (5.35%)
const widthRatio = 384 / 430 ≈ 0.893 (89.3%)
const heightRatio = 835 / 879 ≈ 0.95 (95%)
```

## 🖼️ 图片预处理

每个模型需要包含 `preprocessImage` 函数，用于裁剪用户上传的图片以适配屏幕比例：

```javascript
const preprocessImage = (imageSrc) => {
  return new Promise((resolve) => {
    const targetRatio = 屏幕宽度 / 屏幕高度; // 使用计算出的屏幕比例

    const img = new Image();
    img.onload = () => {
      const imgRatio = img.width / img.height;

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      canvas.width = img.width;
      canvas.height = img.height;

      if (imgRatio > targetRatio) {
        // 图片更宽，按高度适配，裁剪左右
        const drawWidth = img.height * targetRatio;
        const offsetX = (img.width - drawWidth) / 2;
        ctx.drawImage(img, offsetX, 0, drawWidth, img.height,
                      0, 0, img.width, img.height);
      } else {
        // 图片更高，按宽度适配，裁剪上下
        const drawHeight = img.width / targetRatio;
        const offsetY = (img.height - drawHeight) / 2;
        ctx.drawImage(img, 0, offsetY, img.width, drawHeight,
                      0, 0, img.width, img.height);
      }

      resolve(canvas.toDataURL('image/png', 1.0));
    };

    if (imageSrc.startsWith('data:') || imageSrc.startsWith('blob:')) {
      img.src = imageSrc;
    } else {
      img.crossOrigin = 'anonymous';
      img.src = imageSrc;
    }
  });
};
```

## 📝 模型组件模板

创建新模型时可以参考以下模板：

```jsx
import React, { useEffect, useState, useRef } from 'react';
import { RotateCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';

function NewDeviceModel2D() {
  const { state } = useApp();
  const [screenContent, setScreenContent] = useState(null);
  const [deviceSize, setDeviceSize] = useState({ width: 0, height: 0 });
  const imgRef = useRef(null);

  // 在这里填入从 Figma 测量的数据
  const DEVICE_WIDTH = 0;    // 设备宽度
  const DEVICE_HEIGHT = 0;   // 设备高度
  const SCREEN_WIDTH = 0;    // 屏幕宽度
  const SCREEN_HEIGHT = 0;   // 屏幕高度
  const TOP_OFFSET = 0;      // 顶部偏移
  const LEFT_OFFSET = 0;     // 左边距
  const BORDER_RADIUS = '';  // 圆角，如 '23px 23px 0 0'

  const preprocessImage = (imageSrc) => {
    // 实现图片预处理逻辑
  };

  useEffect(() => {
    // 处理上传图片
  }, [state.screenImage]);

  return (
    <div className="relative w-full h-[800px] flex items-center justify-center">
      {/* 屏幕内容 */}
      {screenContent && (
        <div
          className="absolute z-10"
          style={{
            top: deviceSize.height > 0
              ? `${deviceSize.height * (TOP_OFFSET / DEVICE_HEIGHT)}px`
              : `${TOP_OFFSET}px`,
            left: deviceSize.width > 0
              ? `${deviceSize.width * (LEFT_OFFSET / DEVICE_WIDTH)}px`
              : `${LEFT_OFFSET}px`,
            width: deviceSize.width > 0
              ? `${deviceSize.width * (SCREEN_WIDTH / DEVICE_WIDTH)}px`
              : `${SCREEN_WIDTH}px`,
            height: deviceSize.height > 0
              ? `${deviceSize.height * (SCREEN_HEIGHT / DEVICE_HEIGHT)}px`
              : `${SCREEN_HEIGHT}px`,
            borderRadius: BORDER_RADIUS,
            overflow: 'hidden',
            backgroundColor: '#000'
          }}
        >
          <img src={screenContent} className="w-full h-full"
               style={{ objectFit: 'cover' }} />
        </div>
      )}

      {/* 设备图片 */}
      <img
        ref={imgRef}
        src="/device-mockup.png"
        alt="Device"
        className="relative z-20 block w-auto h-[500px]"
        onLoad={(e) => {
          setDeviceSize({
            width: e.target.offsetWidth,
            height: e.target.offsetHeight
          });
        }}
        draggable={false}
      />
    </div>
  );
}

export default NewDeviceModel2D;
```

## ✅ 验证清单

添加新模型后，请检查：

- [ ] 图片完全贴合屏幕区域，无溢出或空白
- [ ] 圆角设置正确（顶部、底部、四角等）
- [ ] 支持拖拽、缩放、旋转（如需要）
- [ ] 支持 blob URL 和 data URL
- [ ] 响应式尺寸计算正确
- [ ] 图片裁剪比例正确

## 🔧 常见问题

**Q: 图片位置偏移？**
- 重新在 Figma 中精确测量偏移量
- 确保使用正确的坐标差值计算

**Q: 圆角不对？**
- 检查 border-radius 值
- 注意只有顶部圆角还是四角都有

**Q: 图片被拉伸？**
- 检查 screenRatio 计算
- 确保 preprocessImage 逻辑正确

**Q: 图片模糊？**
- 使用 `imageSmoothingQuality: 'high'`
- 使用 PNG 格式：`canvas.toDataURL('image/png', 1.0)`
