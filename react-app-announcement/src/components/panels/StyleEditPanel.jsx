import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Type, 
  Palette, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Bold,
  Italic,
  X
} from 'lucide-react';

function StyleEditPanel() {
  const { state, updateElementStyle, deselectElement } = useApp();
  const selected = state.selectedElement;
  
  console.log('StyleEditPanel render:', { selected, hasSelected: !!selected });
  
  if (!selected) return null;
  
  const currentStyles = state.elementStyles[selected.id] || {};
  
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
  
  const renderTextControls = () => (
    <div className="space-y-4">
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
    <div className="fixed right-4 top-20 w-80 bg-white rounded-xl shadow-xl border border-gray-200/50 z-50 max-h-[calc(100vh-120px)] overflow-hidden style-edit-panel">
      {/* 标题栏 */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
            <Type size={16} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">样式编辑</h3>
            <p className="text-xs text-gray-500">编辑 {selected.type}</p>
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
      <div className="p-4 overflow-y-auto max-h-96">
        {/* 文字样式控制 */}
        {(selected.type === 'title' || selected.type === 'subtitle' || selected.type === 'feature') && (
          <div className="mb-6">
            <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
              <Type size={14} />
              文字样式
            </h4>
            {renderTextControls()}
          </div>
        )}
        
        {/* 背景样式控制 */}
        <div>
          <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
            <Palette size={14} />
            背景样式
          </h4>
          {renderBackgroundControls()}
        </div>
        
        {/* 重置按钮 */}
        <div className="mt-6 pt-4 border-t border-gray-100">
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

export default StyleEditPanel;