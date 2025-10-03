import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Move } from 'lucide-react';

function DynamicComponent({ component }) {
  const { state, updateDynamicComponent, deleteDynamicComponent, selectElement, setCurrentPanel, clearSelection, updateAppInfo, updateProductHuntInfo } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [initialPositions, setInitialPositions] = useState({});

  const { id, type, content, position, styles, dataPath } = component;

  // 从 state.elementStyles 获取当前元素的样式
  const elementId = `dynamicComponents-${id}-content`;
  const elementStyles = state.elementStyles?.[elementId] || {};

  // 合并样式：elementStyles 优先
  const mergedStyles = { ...styles, ...elementStyles };

  // 检查是否被选中
  const isSelected = state.selectedElements?.some(el => el.id === elementId) || false;

  // 处理拖拽开始
  const handleMouseDown = (e) => {
    // 如果点击的是控制按钮或正在编辑，不启动拖拽
    if (e.target.closest('.component-control') || isEditing) return;
    // 如果点击的是输入框等交互元素，不启动拖拽
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    setIsDragging(true);
    setDragStartPos({ x: e.clientX, y: e.clientY });

    // 记录鼠标相对于当前元素位置的偏移
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });

    // 如果是多选模式，记录所有选中的动态组件的初始位置
    if (isSelected && state.selectedElements.length > 1) {
      const positions = {};
      state.selectedElements.forEach(element => {
        const match = element.id.match(/^dynamicComponents-(\d+)-content$/);
        if (match) {
          const componentId = parseInt(match[1]);
          const comp = state.dynamicComponents.find(c => c.id === componentId);
          if (comp) {
            positions[componentId] = { ...comp.position };
          }
        }
      });
      setInitialPositions(positions);
    }

    // 阻止事件传播到 EditManager
    e.stopPropagation();
    e.preventDefault();
  };

  // 处理拖拽过程 - 支持批量拖拽
  const handleMouseMove = (e) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartPos.x;
    const deltaY = e.clientY - dragStartPos.y;

    // 如果当前元素是多选中的一个，移动所有选中的动态组件
    if (isSelected && state.selectedElements.length > 1) {
      state.selectedElements.forEach(element => {
        const match = element.id.match(/^dynamicComponents-(\d+)-content$/);
        if (match) {
          const componentId = parseInt(match[1]);
          const initialPos = initialPositions[componentId];
          if (initialPos) {
            const newPosition = {
              x: initialPos.x + deltaX,
              y: initialPos.y + deltaY
            };
            updateDynamicComponent(componentId, { position: newPosition });
          }
        }
      });
    } else {
      // 单个组件拖拽
      const newPosition = {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      };
      updateDynamicComponent(id, { position: newPosition });
    }
  };

  // 处理拖拽结束
  const handleMouseUp = (e) => {
    if (!isDragging) return;

    // 检查是否真的移动了（移动距离小于 5px 算作点击）
    const moveDistance = Math.sqrt(
      Math.pow(e.clientX - dragStartPos.x, 2) +
      Math.pow(e.clientY - dragStartPos.y, 2)
    );

    if (moveDistance < 5) {
      // 没有移动，当作点击处理 - 只选中，不打开样式面板
      // 检查是否按住了 Ctrl/Cmd 键进行多选
      const isMultiSelect = e.ctrlKey || e.metaKey;
      console.log('📝 单击选中动态组件:', id, '多选模式:', isMultiSelect);
      selectElement('element', `dynamicComponents-${id}-content`, `dynamicComponents.${id}.content`, isMultiSelect);
      // 注意：这里不调用 setCurrentPanel，只选中不打开面板
    }

    setIsDragging(false);
  };
  
  // 监听全局鼠标事件
  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);
  
  // 处理双击 - 文本/组件类型进入编辑模式，其他类型打开样式面板
  const handleDoubleClick = (e) => {
    e.stopPropagation();

    if (type === 'text' || type === 'component') {
      console.log('📝 双击进入编辑模式:', id);
      setIsEditing(true);
    } else {
      console.log('📝 双击打开样式面板:', id);
      setCurrentPanel('style');
    }
  };

  // 处理内容变化
  const handleContentChange = (e) => {
    const newValue = e.target.value;

    // 如果有 dataPath，同时更新 state 中的对应数据
    if (dataPath) {
      const pathParts = dataPath.split('.');
      if (pathParts[0] === 'appInfo') {
        updateAppInfo({ [pathParts[1]]: newValue });
      } else if (pathParts[0] === 'productHuntInfo') {
        updateProductHuntInfo({ [pathParts[1]]: newValue });
      }
    }

    updateDynamicComponent(id, { content: newValue });
  };

  // 处理编辑完成
  const handleBlur = () => {
    setIsEditing(false);
  };

  // 渲染不同类型的内容
  const renderContent = () => {
    if (isEditing && (type === 'text' || type === 'component')) {
      // 编辑模式：显示输入框
      return (
        <input
          type="text"
          value={content}
          onChange={handleContentChange}
          onBlur={handleBlur}
          autoFocus
          className="w-full bg-transparent border-b-2 border-blue-500 outline-none"
          style={mergedStyles}
        />
      );
    }

    // 显示模式
    switch (type) {
      case 'text':
        return (
          <div style={mergedStyles}>
            {content}
          </div>
        );

      case 'icon':
        // 图标类型：可以是图片URL或者emoji/文字
        return (
          <div style={mergedStyles}>
            {content && content.startsWith('http') || content && content.startsWith('/') ? (
              <img src={content} alt="Icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              content
            )}
          </div>
        );

      case 'component':
        return (
          <div style={mergedStyles}>
            {content}
          </div>
        );

      case 'list':
        // 列表项样式
        const listItemStyle = {
          ...(mergedStyles?.listItemBackground && {
            background: mergedStyles.listItemBackground,
            padding: mergedStyles.listItemPadding,
            borderRadius: mergedStyles.listItemBorderRadius,
            border: mergedStyles.listItemBorder,
            boxShadow: mergedStyles.listItemShadow
          }),
          ...(mergedStyles?.listItemBefore && {
            display: 'flex',
            alignItems: 'flex-start',
            gap: mergedStyles.listItemBeforeMargin || '12px'
          })
        };

        return (
          <ul
            style={{
              listStyleType: mergedStyles?.listStyleType || 'disc',
              paddingLeft: mergedStyles?.paddingLeft || '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: mergedStyles?.gap || '8px',
              fontSize: mergedStyles?.fontSize,
              lineHeight: mergedStyles?.lineHeight,
              fontWeight: mergedStyles?.fontWeight,
              backgroundColor: mergedStyles?.backgroundColor
            }}

          >
            {Array.isArray(content) ? content.map((item, index) => (
              <li key={index} style={listItemStyle}>
                {mergedStyles?.listItemBefore && (
                  <span style={{
                    color: mergedStyles.listItemBeforeColor,
                    fontSize: mergedStyles.listItemBeforeSize,
                    flexShrink: 0,
                    fontWeight: 'bold'
                  }}>
                    {mergedStyles.listItemBefore}
                  </span>
                )}
                <span style={{ flex: 1 }}>{item}</span>
              </li>
            )) : (
              <li style={listItemStyle}>
                {mergedStyles?.listItemBefore && (
                  <span style={{
                    color: mergedStyles.listItemBeforeColor,
                    fontSize: mergedStyles.listItemBeforeSize,
                    flexShrink: 0,
                    fontWeight: 'bold'
                  }}>
                    {mergedStyles.listItemBefore}
                  </span>
                )}
                <span style={{ flex: 1 }}>{content}</span>
              </li>
            )}
          </ul>
        );

      case 'button':
        // 品牌图标 SVG
        const renderButtonIcon = () => {
          if (component.icon === 'appstore') {
            return (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            );
          } else if (component.icon === 'googleplay') {
            return (
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
              </svg>
            );
          }
          return null;
        };

        return (
          <button
            style={{
              ...mergedStyles,
              cursor: 'pointer'
            }}
          >
            {renderButtonIcon()}
            <span>{content}</span>
          </button>
        );

      default:
        return <div style={mergedStyles}>{content}</div>;
    }
  };
  
  // 处理删除 - 支持批量删除
  const handleDelete = (e) => {
    e.stopPropagation();

    // 如果当前元素是选中的多个元素之一，删除所有选中的动态组件
    if (isSelected && state.selectedElements.length > 1) {
      state.selectedElements.forEach(element => {
        // 从 elementId 提取动态组件 ID
        const match = element.id.match(/^dynamicComponents-(\d+)-content$/);
        if (match) {
          const componentId = parseInt(match[1]);
          deleteDynamicComponent(componentId);
        }
      });
      clearSelection();
    } else {
      // 否则只删除当前元素
      deleteDynamicComponent(id);
    }
  };

  return (
    <div
      className={`absolute select-none group ${isDragging ? 'z-50' : 'z-20'} ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      data-draggable="true"
    >
      {/* 控制栏 */}
      <div className={`absolute -top-8 right-0 ${
        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      } transition-opacity duration-200 flex items-center gap-1 bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow-lg component-control`}>
        <Move size={12} />
        <button
          onClick={handleDelete}
          className="p-0.5 hover:bg-gray-700 rounded"
          title={isSelected && state.selectedElements.length > 1 ? `删除 ${state.selectedElements.length} 个元素` : '删除'}
        >
          <X size={10} />
        </button>
        {isSelected && state.selectedElements.length > 1 && (
          <span className="text-xs ml-1">({state.selectedElements.length})</span>
        )}
      </div>

      {/* 内容区域 */}
      <div
        className="min-w-[100px] min-h-[30px]"
        onClick={(e) => {
          // 如果正在编辑，阻止事件传播到 EditManager
          if (isEditing) {
            e.stopPropagation();
          }
        }}
      >
        {renderContent()}
      </div>

      {/* 选中状态的覆盖层 */}
      {isSelected && !isDragging && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 rounded pointer-events-none" />
      )}

      {/* 拖拽时的半透明覆盖层 */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 border-dashed rounded pointer-events-none" />
      )}
    </div>
  );
}

export default DynamicComponent;