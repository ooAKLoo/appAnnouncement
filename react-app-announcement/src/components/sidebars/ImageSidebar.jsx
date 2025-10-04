import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Image as ImageIcon,
  Move,
  Maximize2,
  Square,
  Circle,
  Droplet,
  Sun,
  Contrast,
  Palette,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Upload,
  X,
  ArrowLeft,
  Scissors
} from 'lucide-react';

function ImageSidebar({ isActive }) {
  const { state, updateElementStyle, updateDynamicComponent, updateAppInfo, updateProductHuntInfo, deselectElement, setCurrentPanel } = useApp();
  const selected = state.selectedElement;
  const fileInputRef = useRef(null);
  const [aspectRatioLocked, setAspectRatioLocked] = useState(true);
  const [currentAspectRatio, setCurrentAspectRatio] = useState(1); // 记录当前宽高比

  // 提取动态组件 ID（支持 ID 中包含小数点）
  const extractComponentId = (element) => {
    if (!element) return null;
    // 使用正则匹配 dynamicComponents.{id}.content 格式
    const match = element.match(/^dynamicComponents\.(.+)\.content$/);
    return match ? match[1] : null;
  };

  // 检测是否是图片类型的元素
  const isImageElement = () => {
    if (!selected) return false;
    // 检查是否是动态组件图片
    if (selected.element && selected.element.startsWith('dynamicComponents.')) {
      const componentId = extractComponentId(selected.element);
      if (componentId) {
        const component = state.dynamicComponents?.find(c => String(c.id) === String(componentId));
        return component?.type === 'image' || component?.type === 'icon';
      }
    }
    // 检查是否是 appInfo.icon 或其他图标路径
    return selected.element?.includes('icon') || selected.element?.includes('image');
  };

  // 获取当前样式
  const currentStyles = selected ? (state.elementStyles[selected.id] || {}) : {};

  // 获取动态组件（如果是）
  const getDynamicComponent = () => {
    if (!selected) return null;
    if (selected.element && selected.element.startsWith('dynamicComponents.')) {
      const componentId = extractComponentId(selected.element);
      if (componentId) {
        return state.dynamicComponents?.find(c => String(c.id) === String(componentId));
      }
    }
    return null;
  };

  const component = getDynamicComponent();

  // 辅助函数：解析数值（必须在 useEffect 之前定义）
  const parseValue = (value, defaultValue) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseInt(value);
      return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
  };

  const parseFloatValue = (value, defaultValue) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseFloat(value);
      return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
  };

  // 🎯 初始化宽高比 - 当组件加载或尺寸改变时更新（必须在所有 return 之前）
  React.useEffect(() => {
    if (!selected || !isImageElement()) return;

    const width = parseValue(currentStyles.width, 100);
    const height = parseValue(currentStyles.height, 100);
    if (width && height) {
      const ratio = width / height;
      setCurrentAspectRatio(ratio);
      console.log('📐 初始化宽高比:', ratio, { width, height });
    }
  }, [selected?.id, currentStyles.width, currentStyles.height]);

  // 如果面板没激活或没有选中元素，不显示
  if (!isActive || !selected) return null;

  // 如果不是图片元素，不显示
  if (!isImageElement()) {
    return null;
  }

  const updateStyle = (property, value) => {
    updateElementStyle(selected.id, { [property]: value });
  };

  // 处理宽度变化（支持锁定比例）
  const handleWidthChange = (newWidth) => {
    const width = parseInt(newWidth);
    if (isNaN(width) || width <= 0) return;

    if (aspectRatioLocked && currentAspectRatio) {
      // 锁定比例：根据新宽度计算新高度
      const newHeight = Math.round(width / currentAspectRatio);
      console.log('🔒 锁定比例调整:', { width, height: newHeight, ratio: currentAspectRatio });
      updateElementStyle(selected.id, {
        width: `${width}px`,
        height: `${newHeight}px`
      });
    } else {
      // 自由缩放：只更新宽度
      updateStyle('width', `${width}px`);
      // 更新宽高比
      const currentHeight = parseValue(currentStyles.height, 100);
      setCurrentAspectRatio(width / currentHeight);
    }
  };

  // 处理高度变化（支持锁定比例）
  const handleHeightChange = (newHeight) => {
    const height = parseInt(newHeight);
    if (isNaN(height) || height <= 0) return;

    if (aspectRatioLocked && currentAspectRatio) {
      // 锁定比例：根据新高度计算新宽度
      const newWidth = Math.round(height * currentAspectRatio);
      console.log('🔒 锁定比例调整:', { width: newWidth, height, ratio: currentAspectRatio });
      updateElementStyle(selected.id, {
        width: `${newWidth}px`,
        height: `${height}px`
      });
    } else {
      // 自由缩放：只更新高度
      updateStyle('height', `${height}px`);
      // 更新宽高比
      const currentWidth = parseValue(currentStyles.width, 100);
      setCurrentAspectRatio(currentWidth / height);
    }
  };

  const handleBack = () => {
    deselectElement();
    setCurrentPanel('design');
  };

  // 处理图片替换
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const imageUrl = event.target.result;
      console.log('🖼️ 图片上传完成，URL:', imageUrl.substring(0, 50) + '...');
      console.log('🔍 当前选中元素信息:', {
        selected,
        component,
        elementPath: selected?.element,
        elementId: selected?.id
      });

      if (component) {
        // 更新动态组件的内容
        console.log('🔄 更新动态组件:', component.id);
        console.log('🔍 动态组件 dataPath:', component.dataPath);

        // 先更新动态组件的 content
        updateDynamicComponent(component.id, { content: imageUrl });

        // 🔥 关键修复：如果动态组件关联到 appInfo.iconImage 或 productHuntInfo.iconImage，也要更新 state
        if (component.dataPath) {
          const pathParts = component.dataPath.split('.');
          console.log('🔍 检查 dataPath:', component.dataPath, '分割结果:', pathParts);

          if (pathParts[0] === 'appInfo' && pathParts[1] === 'iconImage') {
            console.log('✅ 动态组件关联到 appInfo.iconImage，同时更新 state');
            updateAppInfo({ iconImage: imageUrl });
          } else if (pathParts[0] === 'productHuntInfo' && pathParts[1] === 'iconImage') {
            console.log('✅ 动态组件关联到 productHuntInfo.iconImage，同时更新 state');
            updateProductHuntInfo({ iconImage: imageUrl });
          }
        }
      } else {
        // 更新 Editable 元素（appInfo.icon 等）
        const path = selected.element;
        console.log('🔄 更新 Editable 元素 path:', path);

        if (path) {
          const pathParts = path.split('.');
          console.log('📝 路径分割结果:', pathParts);

          if (pathParts[0] === 'appInfo' && pathParts[1] === 'icon') {
            // appInfo.icon 需要更新 iconImage 字段来显示图片
            console.log('✅ 匹配到 appInfo.icon，更新 iconImage');
            updateAppInfo({ iconImage: imageUrl });
            console.log('✅ updateAppInfo 调用完成');
          } else if (pathParts[0] === 'appInfo') {
            console.log('✅ 更新 appInfo 其他字段:', pathParts[1]);
            updateAppInfo({ [pathParts[1]]: imageUrl });
          } else if (pathParts[0] === 'productHuntInfo' && pathParts[1] === 'icon') {
            // productHuntInfo.icon 也需要更新对应的 iconImage 字段
            console.log('✅ 匹配到 productHuntInfo.icon，更新 iconImage');
            updateProductHuntInfo({ iconImage: imageUrl });
          } else if (pathParts[0] === 'productHuntInfo') {
            console.log('✅ 更新 productHuntInfo 其他字段:', pathParts[1]);
            updateProductHuntInfo({ [pathParts[1]]: imageUrl });
          } else {
            console.warn('⚠️ 未匹配到任何更新路径:', pathParts);
          }
        } else {
          console.error('❌ 没有找到 selected.element 路径');
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // 翻转和旋转
  const handleFlipHorizontal = () => {
    const currentTransform = currentStyles.transform || '';
    const hasFlipH = currentTransform.includes('scaleX(-1)');
    const newTransform = hasFlipH
      ? currentTransform.replace('scaleX(-1)', 'scaleX(1)')
      : currentTransform + ' scaleX(-1)';
    updateStyle('transform', newTransform.trim());
  };

  const handleFlipVertical = () => {
    const currentTransform = currentStyles.transform || '';
    const hasFlipV = currentTransform.includes('scaleY(-1)');
    const newTransform = hasFlipV
      ? currentTransform.replace('scaleY(-1)', 'scaleY(1)')
      : currentTransform + ' scaleY(-1)';
    updateStyle('transform', newTransform.trim());
  };

  const handleRotate = (degrees) => {
    const currentRotation = parseValue(currentStyles.rotation, 0);
    const newRotation = (currentRotation + degrees) % 360;
    updateStyle('rotation', newRotation);
    updateStyle('transform', `rotate(${newRotation}deg) ${currentStyles.transform || ''}`.trim());
  };

  return (
    <div
      className="fixed left-4 top-20 bottom-4 w-80 bg-white rounded-xl shadow-xl border border-gray-200/50 flex flex-col overflow-hidden z-50 style-edit-panel"
      onClick={(e) => e.stopPropagation()}
    >
      {/* 标题栏 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <button
            onClick={handleBack}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={16} className="text-gray-500" />
          </button>
          <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
            <ImageIcon size={16} className="text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">图片编辑</h3>
            <p className="text-xs text-gray-500">调整图片样式和属性</p>
          </div>
        </div>
        <button
          onClick={deselectElement}
          className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* 替换图片 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Upload size={14} className="inline mr-1" />
            替换图片
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full p-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-all text-sm text-gray-600 hover:text-purple-600"
          >
            点击上传新图片
          </button>
        </div>

        {/* 尺寸调整 */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Maximize2 size={14} />
            尺寸
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600 w-12">宽度</label>
              <input
                type="number"
                value={parseValue(currentStyles.width, 100)}
                onChange={(e) => handleWidthChange(e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-xs text-gray-500">px</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600 w-12">高度</label>
              <input
                type="number"
                value={parseValue(currentStyles.height, 100)}
                onChange={(e) => handleHeightChange(e.target.value)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-xs text-gray-500">px</span>
            </div>
            <button
              onClick={() => {
                setAspectRatioLocked(!aspectRatioLocked);
                // 切换锁定状态时，更新当前宽高比
                if (!aspectRatioLocked) {
                  const width = parseValue(currentStyles.width, 100);
                  const height = parseValue(currentStyles.height, 100);
                  setCurrentAspectRatio(width / height);
                  console.log('🔒 启用锁定比例，当前比例:', width / height);
                }
              }}
              className={`w-full text-xs py-1.5 rounded ${
                aspectRatioLocked ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {aspectRatioLocked ? '🔒 锁定比例' : '🔓 自由缩放'}
            </button>
          </div>
        </div>

        {/* 位置 */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Move size={14} />
            位置
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600 w-12">X 坐标</label>
              <input
                type="number"
                value={parseValue(currentStyles.left, 0)}
                onChange={(e) => updateStyle('left', `${e.target.value}px`)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-xs text-gray-500">px</span>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600 w-12">Y 坐标</label>
              <input
                type="number"
                value={parseValue(currentStyles.top, 0)}
                onChange={(e) => updateStyle('top', `${e.target.value}px`)}
                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
              />
              <span className="text-xs text-gray-500">px</span>
            </div>
          </div>
        </div>

        {/* 适配方式 */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Scissors size={14} />
            图片适配
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'cover', label: '填充', desc: '裁剪填满' },
              { value: 'contain', label: '包含', desc: '完整显示' },
              { value: 'fill', label: '拉伸', desc: '变形填充' },
              { value: 'scale-down', label: '缩小', desc: '缩小适应' }
            ].map((fit) => (
              <button
                key={fit.value}
                onClick={() => updateStyle('objectFit', fit.value)}
                className={`p-2 rounded-lg border text-left transition-all ${
                  (currentStyles.objectFit || 'cover') === fit.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="text-xs font-medium text-gray-900">{fit.label}</div>
                <div className="text-xs text-gray-500">{fit.desc}</div>
              </button>
            ))}
          </div>
        </div>

        {/* 圆角 */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Square size={14} />
            圆角
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="range"
                min="0"
                max="100"
                value={parseValue(currentStyles.borderRadius, 0)}
                onChange={(e) => updateStyle('borderRadius', `${e.target.value}px`)}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm text-gray-600 min-w-[50px]">
                {parseValue(currentStyles.borderRadius, 0)}px
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[0, 8, 16, 50].map((radius) => (
                <button
                  key={radius}
                  onClick={() => updateStyle('borderRadius', `${radius}px`)}
                  className={`p-2 text-xs rounded-lg border ${
                    parseValue(currentStyles.borderRadius, 0) === radius
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {radius === 50 ? '圆形' : radius === 0 ? '直角' : `${radius}px`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 边框 */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Circle size={14} />
            边框
          </h4>
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <label className="text-xs text-gray-600 w-12">粗细</label>
              <input
                type="range"
                min="0"
                max="10"
                value={parseValue(currentStyles.borderWidth, 0)}
                onChange={(e) => updateStyle('borderWidth', `${e.target.value}px`)}
                className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs text-gray-600 min-w-[40px]">
                {parseValue(currentStyles.borderWidth, 0)}px
              </span>
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">颜色</label>
              <input
                type="color"
                value={currentStyles.borderColor || '#000000'}
                onChange={(e) => updateStyle('borderColor', e.target.value)}
                className="w-full h-8 rounded border border-gray-300"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 mb-1 block">样式</label>
              <div className="grid grid-cols-3 gap-2">
                {['solid', 'dashed', 'dotted'].map((style) => (
                  <button
                    key={style}
                    onClick={() => updateStyle('borderStyle', style)}
                    className={`p-2 text-xs rounded border ${
                      (currentStyles.borderStyle || 'solid') === style
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200'
                    }`}
                  >
                    {style === 'solid' ? '实线' : style === 'dashed' ? '虚线' : '点线'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 阴影 */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Droplet size={14} />
            阴影
          </h4>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: '无', value: 'none' },
              { label: '小', value: '0 1px 3px rgba(0,0,0,0.12)' },
              { label: '中', value: '0 4px 6px rgba(0,0,0,0.1)' },
              { label: '大', value: '0 10px 15px rgba(0,0,0,0.15)' },
              { label: '特大', value: '0 20px 25px rgba(0,0,0,0.2)' },
              { label: '发光', value: '0 0 20px rgba(147,51,234,0.5)' }
            ].map((shadow) => (
              <button
                key={shadow.label}
                onClick={() => updateStyle('boxShadow', shadow.value)}
                className={`p-2 text-xs rounded-lg border ${
                  (currentStyles.boxShadow || 'none') === shadow.value
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {shadow.label}
              </button>
            ))}
          </div>
        </div>

        {/* 滤镜 */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Palette size={14} />
            滤镜
          </h4>
          <div className="space-y-3">
            {/* 亮度 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-gray-600 flex items-center gap-1">
                  <Sun size={12} />
                  亮度
                </label>
                <span className="text-xs text-gray-500">
                  {parseFloatValue(currentStyles.brightness, 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={parseFloatValue(currentStyles.brightness, 100)}
                onChange={(e) => updateStyle('brightness', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 对比度 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-gray-600 flex items-center gap-1">
                  <Contrast size={12} />
                  对比度
                </label>
                <span className="text-xs text-gray-500">
                  {parseFloatValue(currentStyles.contrast, 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={parseFloatValue(currentStyles.contrast, 100)}
                onChange={(e) => updateStyle('contrast', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 饱和度 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-gray-600">饱和度</label>
                <span className="text-xs text-gray-500">
                  {parseFloatValue(currentStyles.saturate, 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                value={parseFloatValue(currentStyles.saturate, 100)}
                onChange={(e) => updateStyle('saturate', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 模糊 */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-gray-600">模糊</label>
                <span className="text-xs text-gray-500">
                  {parseFloatValue(currentStyles.blur, 0)}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="20"
                value={parseFloatValue(currentStyles.blur, 0)}
                onChange={(e) => updateStyle('blur', e.target.value)}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* 应用滤镜按钮 */}
            <button
              onClick={() => {
                const brightness = parseFloatValue(currentStyles.brightness, 100);
                const contrast = parseFloatValue(currentStyles.contrast, 100);
                const saturate = parseFloatValue(currentStyles.saturate, 100);
                const blur = parseFloatValue(currentStyles.blur, 0);
                const filterString = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturate}%) blur(${blur}px)`;
                updateStyle('filter', filterString);
              }}
              className="w-full text-xs py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
            >
              应用滤镜
            </button>
          </div>
        </div>

        {/* 透明度 */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            透明度
          </h4>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="0"
              max="100"
              value={parseFloatValue(currentStyles.opacity, 100) * 100}
              onChange={(e) => updateStyle('opacity', (e.target.value / 100).toFixed(2))}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-600 min-w-[50px]">
              {Math.round(parseFloatValue(currentStyles.opacity, 1) * 100)}%
            </span>
          </div>
        </div>

        {/* 翻转和旋转 */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <RotateCw size={14} />
            翻转 & 旋转
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleFlipHorizontal}
              className="p-2 text-xs rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all flex items-center justify-center gap-1"
            >
              <FlipHorizontal size={14} />
              水平翻转
            </button>
            <button
              onClick={handleFlipVertical}
              className="p-2 text-xs rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all flex items-center justify-center gap-1"
            >
              <FlipVertical size={14} />
              垂直翻转
            </button>
            <button
              onClick={() => handleRotate(90)}
              className="p-2 text-xs rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
            >
              旋转 90°
            </button>
            <button
              onClick={() => handleRotate(-90)}
              className="p-2 text-xs rounded-lg border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all"
            >
              旋转 -90°
            </button>
          </div>
        </div>

        {/* 重置按钮 */}
        <div className="pt-4 border-t border-gray-100">
          <button
            onClick={() => updateElementStyle(selected.id, {})}
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
          >
            重置为默认样式
          </button>
        </div>
      </div>
    </div>
  );
}

export default ImageSidebar;
