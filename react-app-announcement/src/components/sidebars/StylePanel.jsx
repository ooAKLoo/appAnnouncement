import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Type,
  Palette,
  AlignLeft,
  AlignCenter,
  AlignRight,
  X,
  ArrowLeft,
  List
} from 'lucide-react';

function StylePanel({ isActive }) {
  const { state, updateElementStyle, deselectElement, setCurrentPanel } = useApp();
  const selected = state.selectedElement;

  // 如果面板没激活或没有选中元素，不显示
  if (!isActive || !selected) return null;

  const currentStyles = state.elementStyles[selected.id] || {};

  // 提取动态组件 ID（支持 ID 中包含小数点）
  const extractComponentId = (element) => {
    if (!element) return null;
    // 使用正则匹配 dynamicComponents.{id}.content 格式
    const match = element.match(/^dynamicComponents\.(.+)\.content$/);
    return match ? match[1] : null;
  };

  // 检测是否是动态组件，如果是，获取其类型
  const getDynamicComponentType = () => {
    if (selected.element && selected.element.startsWith('dynamicComponents.')) {
      const componentId = extractComponentId(selected.element);
      if (componentId) {
        const component = state.dynamicComponents?.find(c => String(c.id) === String(componentId));
        return component?.type;
      }
    }
    return null;
  };

  const dynamicType = getDynamicComponentType();

  // 🔍 检测是否是图片类型的元素
  const isImageElement = () => {
    // 1. 检查动态组件类型
    if (dynamicType === 'image' || dynamicType === 'icon') {
      return true;
    }
    // 2. 检查 Editable 元素路径
    const imagePaths = ['appInfo.icon', 'productHuntInfo.icon'];
    const isImagePath = selected.element && (
      imagePaths.includes(selected.element) ||
      selected.element.includes('icon') ||
      selected.element.includes('image')
    );
    return isImagePath;
  };

  // 🔄 如果是图片元素，自动切换到图片侧边栏
  React.useEffect(() => {
    if (isImageElement() && isActive) {
      console.log('🖼️ 检测到图片元素，自动切换到图片侧边栏');
      setCurrentPanel('image');
    }
  }, [selected, isActive]);

  // 如果是图片元素，不显示样式面板（会自动切换到图片侧边栏）
  if (isImageElement()) {
    return null;
  }
  
  // 辅助函数：解析数值
  const parseValue = (value, defaultValue) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseInt(value);
      return isNaN(parsed) ? defaultValue : parsed;
    }
    return defaultValue;
  };
  
  const updateStyle = (property, value) => {
    updateElementStyle(selected.id, { [property]: value });
  };
  
  const handleBack = () => {
    deselectElement();
    setCurrentPanel('design'); // 返回设计面板
  };
  
  const renderTextControls = () => {
    // 字体预设
    const fontPresets = [
      { name: '现代简约', family: 'Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' },
      { name: '优雅衬线', family: 'Playfair Display, Georgia, Times New Roman, serif' },
      { name: '友好手写', family: 'Caveat, Nunito, Comic Sans MS, cursive, sans-serif' },
    ];

    return (
      <div className="space-y-4">
        {/* 字体选择 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            字体
          </label>
          <div className="space-y-2">
            {fontPresets.map((preset, index) => (
              <button
                key={index}
                className={`w-full p-3 text-left border rounded-lg transition-all hover:border-blue-300 ${
                  currentStyles.fontFamily === preset.family
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
                onClick={() => updateStyle('fontFamily', preset.family)}
              >
                <div className="font-medium text-gray-900 text-sm">{preset.name}</div>
                <div
                  className="text-xs text-gray-500 mt-1"
                  style={{ fontFamily: preset.family }}
                >
                  The quick brown fox jumps
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 字体大小 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            字体大小
          </label>
          <div className="flex items-center gap-2">
            <input
              type="range"
              min="12"
              max="72"
              value={parseValue(currentStyles.fontSize, 16)}
              onChange={(e) => updateStyle('fontSize', `${e.target.value}px`)}
              className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-600 min-w-[40px]">
              {parseValue(currentStyles.fontSize, 16)}px
            </span>
          </div>
        </div>
      
      {/* 字体粗细 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          字体粗细
        </label>
        <div className="grid grid-cols-3 gap-2">
          {[
            { value: '300', label: '细' },
            { value: '400', label: '正常' },
            { value: '500', label: '中等' },
            { value: '600', label: '半粗' },
            { value: '700', label: '粗' },
            { value: '800', label: '超粗' }
          ].map((weight) => (
            <button
              key={weight.value}
              onClick={() => updateStyle('fontWeight', weight.value)}
              className={`p-2 text-xs rounded-lg border transition-all ${
                String(parseValue(currentStyles.fontWeight, 400)) === weight.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {weight.label}
            </button>
          ))}
        </div>
      </div>
      
      {/* 文字颜色 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          文字颜色
        </label>
        <div className="flex gap-2 flex-wrap">
          {[
            '#000000', '#333333', '#666666', '#999999',
            '#ffffff', '#3b82f6', '#ef4444', '#10b981',
            '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'
          ].map((color) => (
            <button
              key={color}
              onClick={() => updateStyle('color', color)}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                currentStyles.color === color ? 'border-gray-800' : 'border-gray-300'
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <input
          type="color"
          value={currentStyles.color || '#000000'}
          onChange={(e) => updateStyle('color', e.target.value)}
          className="mt-2 w-full h-8 rounded border border-gray-300"
        />
      </div>
      
      {/* 文字对齐 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          文字对齐
        </label>
        <div className="flex gap-1">
          {[
            { value: 'left', icon: AlignLeft, label: '左对齐' },
            { value: 'center', icon: AlignCenter, label: '居中' },
            { value: 'right', icon: AlignRight, label: '右对齐' }
          ].map((align) => (
            <button
              key={align.value}
              onClick={() => updateStyle('textAlign', align.value)}
              className={`flex-1 p-2 rounded-lg border transition-all flex items-center justify-center ${
                (currentStyles.textAlign || 'center') === align.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              title={align.label}
            >
              <align.icon size={16} />
            </button>
          ))}
        </div>
      </div>
    </div>
    );
  };

  const renderListControls = () => {
    // 列表预设样式模板
    const listTemplates = [
      {
        id: 'bullets',
        name: '无序列表',
        description: '经典圆点列表',
        icon: '•',
        styles: {
          listStyleType: 'disc',
          paddingLeft: '28px',
          gap: '16px',
          fontSize: '18px',
          lineHeight: '1.6',
          backgroundColor: 'transparent'
        }
      },
      {
        id: 'numbered',
        name: '有序列表',
        description: '数字编号列表',
        icon: '1.',
        styles: {
          listStyleType: 'decimal',
          paddingLeft: '28px',
          gap: '16px',
          fontSize: '18px',
          lineHeight: '1.6',
          fontWeight: '500',
          backgroundColor: 'transparent'
        }
      },
      {
        id: 'cards',
        name: '卡片列表',
        description: 'Product Hunt 风格',
        icon: '▢',
        styles: {
          listStyleType: 'none',
          paddingLeft: '0px',
          gap: '12px',
          fontSize: '17px',
          lineHeight: '1.5',
          backgroundColor: 'transparent',
          // 列表项会有单独的背景
          listItemBackground: '#ffffff',
          listItemPadding: '20px',
          listItemBorderRadius: '16px',
          listItemBorder: '1px solid #e5e7eb',
          listItemShadow: '0 1px 3px rgba(0,0,0,0.08)'
        }
      },
      {
        id: 'checkmarks',
        name: '勾选列表',
        description: '功能点展示',
        icon: '✓',
        styles: {
          listStyleType: 'none',
          paddingLeft: '0px',
          gap: '16px',
          fontSize: '18px',
          lineHeight: '1.6',
          backgroundColor: 'transparent',
          // 通过伪元素添加勾号
          listItemBefore: '✓',
          listItemBeforeColor: '#10b981',
          listItemBeforeSize: '20px',
          listItemBeforeMargin: '12px'
        }
      },
      {
        id: 'arrows',
        name: '箭头列表',
        description: '步骤引导',
        icon: '→',
        styles: {
          listStyleType: 'none',
          paddingLeft: '0px',
          gap: '20px',
          fontSize: '18px',
          lineHeight: '1.6',
          fontWeight: '500',
          backgroundColor: 'transparent',
          listItemBefore: '→',
          listItemBeforeColor: '#3b82f6',
          listItemBeforeSize: '20px',
          listItemBeforeMargin: '12px'
        }
      },
      {
        id: 'minimal',
        name: '极简列表',
        description: '无标记、大间距',
        icon: '—',
        styles: {
          listStyleType: 'none',
          paddingLeft: '0px',
          gap: '24px',
          fontSize: '19px',
          lineHeight: '1.7',
          fontWeight: '400',
          backgroundColor: 'transparent'
        }
      }
    ];

    const currentTemplateId = currentStyles.listTemplate || 'bullets';

    return (
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            选择列表样式
          </label>
          <div className="grid grid-cols-2 gap-3">
            {listTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => {
                  // 应用模板样式
                  updateStyle('listTemplate', template.id);
                  Object.keys(template.styles).forEach(key => {
                    updateStyle(key, template.styles[key]);
                  });
                }}
                className={`p-3 rounded-xl border-2 transition-all text-left ${
                  currentTemplateId === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`text-2xl ${currentTemplateId === template.id ? 'text-blue-600' : 'text-gray-400'}`}>
                    {template.icon}
                  </div>
                  <div className="flex-1">
                    <div className={`text-sm font-medium ${currentTemplateId === template.id ? 'text-blue-700' : 'text-gray-900'}`}>
                      {template.name}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {template.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  const renderBackgroundControls = () => (
    <div className="space-y-4">
      {/* 背景颜色 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          背景颜色
        </label>
        <div className="flex gap-2 flex-wrap">
          {[
            'transparent', '#ffffff', '#f8fafc', '#f1f5f9',
            '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
            '#8b5cf6', '#ec4899', '#06b6d4', '#000000'
          ].map((color) => (
            <button
              key={color}
              onClick={() => updateStyle('backgroundColor', color)}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${
                currentStyles.backgroundColor === color ? 'border-gray-800' : 'border-gray-300'
              } ${color === 'transparent' ? 'bg-gradient-to-br from-red-500 to-red-500 relative' : ''}`}
              style={{
                backgroundColor: color === 'transparent' ? 'white' : color,
                backgroundImage: color === 'transparent' ? 'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)' : 'none',
                backgroundSize: color === 'transparent' ? '4px 4px' : 'auto',
                backgroundPosition: color === 'transparent' ? '0 0, 0 2px, 2px -2px, -2px 0px' : 'auto'
              }}
            >
              {color === 'transparent' && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-0.5 h-8 bg-red-500 transform rotate-45"></div>
                </div>
              )}
            </button>
          ))}
        </div>
        <input
          type="color"
          value={currentStyles.backgroundColor || '#ffffff'}
          onChange={(e) => updateStyle('backgroundColor', e.target.value)}
          className="mt-2 w-full h-8 rounded border border-gray-300"
        />
      </div>

      {/* 圆角 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          圆角
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="24"
            value={parseValue(currentStyles.borderRadius, 0)}
            onChange={(e) => updateStyle('borderRadius', `${e.target.value}px`)}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-gray-600 min-w-[40px]">
            {parseValue(currentStyles.borderRadius, 0)}px
          </span>
        </div>
      </div>

      {/* 内边距 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          内边距
        </label>
        <div className="flex items-center gap-2">
          <input
            type="range"
            min="0"
            max="48"
            value={parseValue(currentStyles.padding, 0)}
            onChange={(e) => updateStyle('padding', `${e.target.value}px`)}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <span className="text-sm text-gray-600 min-w-[40px]">
            {parseValue(currentStyles.padding, 0)}px
          </span>
        </div>
      </div>
    </div>
  );

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
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            {dynamicType === 'list' ? (
              <List size={16} className="text-blue-600" />
            ) : (
              <Type size={16} className="text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="font-medium text-gray-900">样式编辑</h3>
            <p className="text-xs text-gray-500">
              编辑 {dynamicType ? (dynamicType === 'list' ? '列表' : dynamicType === 'text' ? '文本' : '组件') : selected.type}
            </p>
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
        {/* 列表类型：显示预设模板 + 文字和背景样式 */}
        {dynamicType === 'list' && (
          <>
            {renderListControls()}

            {/* 提示文字 */}
            <div className="text-xs text-gray-500 bg-gray-50 rounded-lg p-3">
              💡 选择一个预设样式，快速美化你的列表
            </div>
          </>
        )}

        {/* 文字样式控制 - 所有元素都可以配置 */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Type size={14} />
            文字样式
          </h4>
          {renderTextControls()}
        </div>

        {/* 背景样式控制 */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Palette size={14} />
            背景样式
          </h4>
          {renderBackgroundControls()}
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

export default StylePanel;