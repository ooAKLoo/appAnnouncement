import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, ArrowLeft, Edit3, Type, Palette, Maximize2, Settings } from 'lucide-react';
import {
  COMPONENT_TYPES,
  COLOR_THEMES,
  SIZES,
  BORDER_STYLES,
  generateComponentStyles
} from '../../data/componentLibrary';

function ComponentPropertiesPanel({ isActive }) {
  const { state, updateDynamicComponent, deselectElement, setCurrentPanel } = useApp();
  const selected = state.selectedElement;

  // 如果面板没激活或没有选中元素，不显示
  if (!isActive || !selected) return null;

  // 提取动态组件 ID
  const extractComponentId = (element) => {
    if (!element) return null;
    const match = element.match(/^dynamicComponents\.(.+)\.content$/);
    return match ? match[1] : null;
  };

  // 获取当前选中的动态组件
  const getDynamicComponent = () => {
    if (selected.element && selected.element.startsWith('dynamicComponents.')) {
      const componentId = extractComponentId(selected.element);
      if (componentId) {
        return state.dynamicComponents?.find(c => String(c.id) === String(componentId));
      }
    }
    return null;
  };

  const dynamicComponent = getDynamicComponent();

  // 如果不是text类型的组件，不显示此面板
  if (!dynamicComponent || dynamicComponent.type !== 'text') {
    return null;
  }

  const [editedContent, setEditedContent] = useState(dynamicComponent.content || '');

  // 获取组件类型
  const componentType = dynamicComponent.componentType
    ? COMPONENT_TYPES[dynamicComponent.componentType]
    : null;

  // 获取当前props
  const currentProps = dynamicComponent.props || (componentType ? componentType.defaultProps : {});

  // 当选中组件变化时，更新编辑内容
  useEffect(() => {
    setEditedContent(dynamicComponent.content || '');
  }, [dynamicComponent.id, dynamicComponent.content]);

  const handleContentChange = (newContent) => {
    setEditedContent(newContent);
    updateDynamicComponent(dynamicComponent.id, {
      content: newContent
    });
  };

  // 更新组件属性
  const handlePropChange = (propName, value) => {
    const newProps = { ...currentProps, [propName]: value };

    // 重新生成样式
    const newStyles = generateComponentStyles(dynamicComponent.componentType, newProps);

    updateDynamicComponent(dynamicComponent.id, {
      props: newProps,
      styles: newStyles
    });
  };

  const handleBack = () => {
    deselectElement();
    setCurrentPanel('design');
  };

  return (
    <div
      className="fixed left-4 top-20 bottom-4 w-80 bg-white rounded-xl shadow-xl border border-gray-200/50 flex flex-col overflow-hidden z-50"
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
            <Edit3 size={16} className="text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">内容编辑</h3>
            <p className="text-xs text-gray-500">
              {componentType ? componentType.name : '文本组件'}
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
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* 组件信息提示 */}
        {componentType && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-center gap-2 mb-1">
              {React.createElement(componentType.icon, { size: 14, className: "text-blue-600" })}
              <span className="text-xs font-semibold text-blue-900">
                {componentType.name}
              </span>
            </div>
            <p className="text-xs text-blue-700">
              {componentType.description}
            </p>
          </div>
        )}

        {/* 文本内容编辑 */}
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Type size={14} />
            文本内容
          </label>
          <textarea
            value={editedContent}
            onChange={(e) => handleContentChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            rows={3}
            placeholder="输入文本内容..."
          />
        </div>

        {/* 属性配置（仅对来自组件库的组件显示） */}
        {componentType && (
          <>
            <div className="border-t border-gray-200 pt-4">
              <h4 className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                <Settings size={14} />
                组件属性
              </h4>

              {/* 颜色主题 */}
              <div className="mb-4">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-2">
                  <Palette size={12} />
                  颜色主题
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(COLOR_THEMES).map(([themeId, theme]) => (
                    <button
                      key={themeId}
                      onClick={() => handlePropChange('theme', themeId)}
                      className={`p-2 rounded-lg border-2 transition-all text-left ${
                        currentProps.theme === themeId
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: theme.bg, border: `2px solid ${theme.border}` }}
                        />
                        <span className="text-xs font-medium text-gray-700">{theme.name}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 尺寸 */}
              <div className="mb-4">
                <label className="flex items-center gap-2 text-xs font-medium text-gray-700 mb-2">
                  <Maximize2 size={12} />
                  尺寸
                </label>
                <div className="grid grid-cols-5 gap-1">
                  {Object.entries(SIZES).map(([sizeId, size]) => (
                    <button
                      key={sizeId}
                      onClick={() => handlePropChange('size', sizeId)}
                      className={`py-2 px-1 rounded-lg border transition-all text-xs font-medium ${
                        currentProps.size === sizeId
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 圆角样式 */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  圆角样式
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.entries(BORDER_STYLES).map(([styleId, style]) => (
                    <button
                      key={styleId}
                      onClick={() => handlePropChange('borderStyle', styleId)}
                      className={`py-2 px-3 rounded-lg border transition-all text-xs font-medium ${
                        currentProps.borderStyle === styleId
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {style.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* 字重 */}
              <div className="mb-4">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  字体粗细
                </label>
                <div className="grid grid-cols-4 gap-1">
                  {['400', '500', '600', '700'].map((weight) => (
                    <button
                      key={weight}
                      onClick={() => handlePropChange('fontWeight', weight)}
                      className={`py-2 rounded-lg border transition-all text-xs ${
                        currentProps.fontWeight === weight
                          ? 'border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ fontWeight: weight }}
                    >
                      {weight === '400' ? '常规' : weight === '500' ? '中等' : weight === '600' ? '半粗' : '粗体'}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {/* 实时预览 */}
        <div className="border-t border-gray-200 pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            实时预览
          </label>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-center">
              <div style={dynamicComponent.styles}>
                {editedContent || '(空白内容)'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 底部操作 */}
      <div className="p-4 border-t border-gray-100 space-y-2">
        {componentType && (
          <button
            onClick={() => {
              // 重置为默认值
              const defaultProps = componentType.defaultProps;
              const newStyles = generateComponentStyles(dynamicComponent.componentType, defaultProps);

              updateDynamicComponent(dynamicComponent.id, {
                content: componentType.defaultContent,
                props: defaultProps,
                styles: newStyles
              });
              setEditedContent(componentType.defaultContent);
            }}
            className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm"
          >
            重置为默认
          </button>
        )}
        <button
          onClick={() => setCurrentPanel('style')}
          className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium"
        >
          高级样式编辑 →
        </button>
      </div>
    </div>
  );
}

export default ComponentPropertiesPanel;
