import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Move } from 'lucide-react';

function DynamicComponent({ component }) {
  const { state, updateDynamicComponent, deleteDynamicComponent, selectElement, setCurrentPanel, clearSelection, updateAppInfo, updateProductHuntInfo, generateTemplateCode } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentSize, setCurrentSize] = useState({ width: 0, height: 0 });
  const elementRef = React.useRef(null);

  // 使用 ref 存储缩放相关的状态，避免闭包问题
  const resizeStateRef = React.useRef({
    isResizing: false,
    direction: '',
    startX: 0,
    startY: 0,
    startWidth: 0,
    startHeight: 0,
    startPosX: 0,
    startPosY: 0
  });

  // 使用 ref 存储旋转相关的状态
  const rotateStateRef = React.useRef({
    isRotating: false,
    startAngle: 0,
    currentRotation: 0
  });

  const [currentRotation, setCurrentRotation] = React.useState(0);

  // 使用 ref 存储拖拽相关的状态
  const dragStateRef = React.useRef({
    startX: 0,
    startY: 0,
    offsetX: 0,
    offsetY: 0,
    isMultiDrag: false,
    initialPositions: {}
  });

  const { id, type, content, position, styles, dataPath } = component;

  // 🔧 根据 dataPath 实时获取当前内容
  const getCurrentContent = () => {
    if (!dataPath) return content;

    const pathParts = dataPath.split('.');
    if (pathParts[0] === 'appInfo') {
      return state.appInfo[pathParts[1]] || content;
    } else if (pathParts[0] === 'productHuntInfo') {
      return state.productHuntInfo[pathParts[1]] || content;
    } else if (pathParts[0] === 'downloads') {
      // downloads 只是控制显示/隐藏，不需要内容
      return content;
    }
    return content;
  };

  const currentContent = getCurrentContent();

  // 从 state.elementStyles 获取当前元素的样式
  const elementId = `dynamicComponents-${id}-content`;
  const elementStyles = state.elementStyles?.[elementId] || {};

  // 合并样式：elementStyles 优先
  const mergedStyles = { ...styles, ...elementStyles };

  // 提取 transform 到最外层，让选中框也能跟随旋转
  const { transform, ...contentStyles } = mergedStyles;

  // 检查是否被选中
  const isSelected = state.selectedElements?.some(el => el.id === elementId) || false;

  // 🔍 调试：监听选中状态变化
  React.useEffect(() => {
    console.log(`🎯 [DynamicComponent ${id}] 选中状态变化:`, {
      isSelected,
      elementId,
      selectedElements: state.selectedElements.map(el => el.id),
      totalSelected: state.selectedElements.length
    });
  }, [isSelected, state.selectedElements]);


  // 处理拖拽开始
  const handleMouseDown = (e) => {
    // 如果点击的是控制按钮、调整尺寸手柄、旋转手柄或正在编辑，不启动拖拽
    if (e.target.closest('.component-control') || e.target.closest('.resize-handle') || e.target.closest('.rotate-handle') || isEditing) return;
    // 如果点击的是输入框等交互元素，不启动拖拽
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    setIsDragging(true);

    // 检查是否是多选拖拽
    const isMultiDrag = isSelected && state.selectedElements.length > 1;

    // 如果是多选模式，记录所有选中的动态组件的初始位置
    const positions = {};
    if (isMultiDrag) {
      state.selectedElements.forEach(element => {
        // 修复：使用 (.+) 匹配任何 ID（包括小数点、字母等）
        const match = element.id.match(/^dynamicComponents-(.+)-content$/);
        if (match) {
          const componentId = match[1]; // 保持原始 ID，不用 parseInt
          const comp = state.dynamicComponents.find(c => String(c.id) === componentId);
          if (comp) {
            positions[componentId] = { ...comp.position };
          }
        }
      });
    }

    // 将所有拖拽状态存储到 ref 中
    dragStateRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - position.x,
      offsetY: e.clientY - position.y,
      isMultiDrag: isMultiDrag,
      initialPositions: positions
    };

    console.log(`🖱️ [DynamicComponent ${id}] DragStart:`, {
      isMultiDrag,
      selectedCount: state.selectedElements.length,
      initialPositions: positions
    });

    // 阻止事件传播到 EditManager
    e.stopPropagation();
    e.preventDefault();
  };

  // 处理拖拽过程 - 支持批量拖拽
  const handleDragMove = (e) => {
    const ds = dragStateRef.current;
    const deltaX = e.clientX - ds.startX;
    const deltaY = e.clientY - ds.startY;

    // 如果是多选拖拽，移动所有选中的动态组件
    if (ds.isMultiDrag) {
      Object.entries(ds.initialPositions).forEach(([componentId, initialPos]) => {
        const newPosition = {
          x: initialPos.x + deltaX,
          y: initialPos.y + deltaY
        };
        // 查找组件时使用字符串比较
        const comp = state.dynamicComponents.find(c => String(c.id) === componentId);
        if (comp) {
          updateDynamicComponent(comp.id, { position: newPosition });
        }
      });
    } else {
      // 单个组件拖拽
      const newPosition = {
        x: e.clientX - ds.offsetX,
        y: e.clientY - ds.offsetY
      };
      updateDynamicComponent(id, { position: newPosition });
    }
  };

  // 处理拖拽结束
  const handleMouseUp = (e) => {
    const wasResizing = resizeStateRef.current.isResizing;
    const wasDragging = isDragging;
    const wasRotating = rotateStateRef.current.isRotating;

    if (!wasDragging && !wasResizing && !wasRotating) return;

    // 检查是否真的移动了（移动距离小于 5px 算作点击）
    const startX = wasDragging ? dragStateRef.current.startX : (wasRotating ? 0 : resizeStateRef.current.startX);
    const startY = wasDragging ? dragStateRef.current.startY : (wasRotating ? 0 : resizeStateRef.current.startY);

    const moveDistance = Math.sqrt(
      Math.pow(e.clientX - startX, 2) +
      Math.pow(e.clientY - startY, 2)
    );

    if (moveDistance < 5 && !wasResizing && !wasRotating) {
      // 没有移动，当作点击处理 - 选中元素
      // 检查是否按住了 Ctrl/Cmd 键进行多选
      const isMultiSelect = e.ctrlKey || e.metaKey;
      console.log('📝 单击选中动态组件:', id, '多选模式:', isMultiSelect);
      selectElement('element', `dynamicComponents-${id}-content`, `dynamicComponents.${id}.content`, isMultiSelect);

      // 🖼️ 如果是图片类型，自动打开图片侧边栏
      if (type === 'image' || type === 'icon') {
        console.log('🖼️ 单击图片元素，打开图片侧边栏');
        setCurrentPanel('image');
      }

      // 模板编辑模式下，点击也生成代码
      if (state.templateEditMode) {
        setTimeout(() => generateTemplateCode(), 50);
      }
    } else {
      // 移动、调整大小或旋转后，在模板编辑模式下生成配置代码
      console.log(`🔄 [DynamicComponent ${id}] 移动/调整/旋转完成，生成代码...`);
      if (state.templateEditMode) {
        setTimeout(() => generateTemplateCode(), 50);
      }
    }

    setIsDragging(false);
    resizeStateRef.current.isResizing = false;
    rotateStateRef.current.isRotating = false;
  };
  
  // 处理调整尺寸开始
  const handleResizeMouseDown = (direction) => (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();

    resizeStateRef.current = {
      isResizing: true,
      direction: direction,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: rect.width,
      startHeight: rect.height,
      startPosX: position.x,
      startPosY: position.y
    };

    console.log(`📏 [DynamicComponent ${id}] ResizeStart:`, {
      direction,
      startSize: { width: rect.width, height: rect.height },
      startPosition: { x: position.x, y: position.y }
    });

    // 立即绑定全局事件监听器
    const handleMove = (e) => {
      handleResizeMove(e);
    };

    const handleUp = (e) => {
      resizeStateRef.current.isResizing = false;
      handleMouseUp(e);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  // 提取当前旋转角度（从 transform 中）
  const getCurrentRotation = () => {
    if (!transform) return 0;
    const match = transform.match(/rotate\((-?\d+\.?\d*)deg\)/);
    return match ? parseFloat(match[1]) : 0;
  };

  // 处理旋转开始
  const handleRotateMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // 计算初始角度
    const startAngle = Math.atan2(e.clientY - centerY, e.clientX - centerX) * (180 / Math.PI);
    const currentRot = getCurrentRotation();

    rotateStateRef.current = {
      isRotating: true,
      startAngle: startAngle,
      currentRotation: currentRot,
      centerX: centerX,
      centerY: centerY
    };

    setCurrentRotation(currentRot);

    console.log(`🔄 [DynamicComponent ${id}] RotateStart:`, {
      startAngle,
      currentRotation: currentRot
    });

    // 立即绑定全局事件监听器
    const handleMove = (e) => {
      handleRotateMove(e);
    };

    const handleUp = (e) => {
      rotateStateRef.current.isRotating = false;
      handleMouseUp(e);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  // 处理旋转过程
  const handleRotateMove = (e) => {
    const rs = rotateStateRef.current;
    if (!rs.isRotating) return;

    const currentAngle = Math.atan2(e.clientY - rs.centerY, e.clientX - rs.centerX) * (180 / Math.PI);
    const deltaAngle = currentAngle - rs.startAngle;
    const newRotation = rs.currentRotation + deltaAngle;

    setCurrentRotation(Math.round(newRotation));

    updateDynamicComponent(id, {
      styles: {
        ...styles,
        transform: `rotate(${newRotation}deg)`
      }
    });
  };

  // 处理调整尺寸过程
  const handleResizeMove = (e) => {
    const rs = resizeStateRef.current;
    if (!rs.isResizing) return;

    const deltaX = e.clientX - rs.startX;
    const deltaY = e.clientY - rs.startY;

    let newWidth = rs.startWidth;
    let newHeight = rs.startHeight;
    let newX = rs.startPosX;
    let newY = rs.startPosY;

    // 根据拖拽方向调整尺寸和位置
    switch (rs.direction) {
      case 'nw': // 左上角
        newWidth = Math.max(50, rs.startWidth - deltaX);
        newHeight = Math.max(20, rs.startHeight - deltaY);
        newX = rs.startPosX + (rs.startWidth - newWidth);
        newY = rs.startPosY + (rs.startHeight - newHeight);
        break;
      case 'n': // 上边
        newHeight = Math.max(20, rs.startHeight - deltaY);
        newY = rs.startPosY + (rs.startHeight - newHeight);
        break;
      case 'ne': // 右上角
        newWidth = Math.max(50, rs.startWidth + deltaX);
        newHeight = Math.max(20, rs.startHeight - deltaY);
        newY = rs.startPosY + (rs.startHeight - newHeight);
        break;
      case 'e': // 右边
        newWidth = Math.max(50, rs.startWidth + deltaX);
        break;
      case 'se': // 右下角
        newWidth = Math.max(50, rs.startWidth + deltaX);
        newHeight = Math.max(20, rs.startHeight + deltaY);
        break;
      case 's': // 下边
        newHeight = Math.max(20, rs.startHeight + deltaY);
        break;
      case 'sw': // 左下角
        newWidth = Math.max(50, rs.startWidth - deltaX);
        newHeight = Math.max(20, rs.startHeight + deltaY);
        newX = rs.startPosX + (rs.startWidth - newWidth);
        break;
      case 'w': // 左边
        newWidth = Math.max(50, rs.startWidth - deltaX);
        newX = rs.startPosX + (rs.startWidth - newWidth);
        break;
    }

    // 更新尺寸显示
    setCurrentSize({ width: Math.round(newWidth), height: Math.round(newHeight) });

    updateDynamicComponent(id, {
      position: { x: newX, y: newY },
      styles: {
        ...styles,
        width: `${Math.round(newWidth)}px`,
        height: `${Math.round(newHeight)}px`
      }
    });
  };

  // 监听全局鼠标事件
  React.useEffect(() => {
    const handleMove = (e) => {
      if (isDragging) {
        console.log(`🔄 [DynamicComponent ${id}] 拖拽移动中...`, {
          isDragging,
          isMultiDrag: dragStateRef.current.isMultiDrag,
          delta: {
            x: e.clientX - dragStateRef.current.startX,
            y: e.clientY - dragStateRef.current.startY
          }
        });
        handleDragMove(e);
      } else if (resizeStateRef.current.isResizing) {
        handleResizeMove(e);
      } else if (rotateStateRef.current.isRotating) {
        handleRotateMove(e);
      }
    };

    const handleUp = (e) => {
      if (isDragging || resizeStateRef.current.isResizing || rotateStateRef.current.isRotating) {
        console.log(`🔚 [DynamicComponent ${id}] 拖拽/缩放/旋转结束`);
        handleMouseUp(e);
      }
    };

    if (isDragging || resizeStateRef.current.isResizing || rotateStateRef.current.isRotating) {
      console.log(`📌 [DynamicComponent ${id}] 绑定拖拽事件监听器`, {
        isDragging,
        isResizing: resizeStateRef.current.isResizing,
        isRotating: rotateStateRef.current.isRotating
      });
      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);

      return () => {
        console.log(`🗑️ [DynamicComponent ${id}] 移除拖拽事件监听器`);
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
      };
    }
  }, [isDragging]); // 只依赖 isDragging，resizing 和 rotating 用 ref 管理
  
  // 处理双击 - 文本/组件类型进入编辑模式，图片类型打开图片侧边栏，其他类型打开样式面板
  const handleDoubleClick = (e) => {
    e.stopPropagation();

    if (type === 'text' || type === 'component') {
      console.log('📝 双击进入编辑模式:', id);
      setIsEditing(true);
    } else if (type === 'image' || type === 'icon') {
      console.log('🖼️ 双击打开图片侧边栏:', id);
      setCurrentPanel('image');
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
          value={currentContent}
          onChange={handleContentChange}
          onBlur={handleBlur}
          autoFocus
          className="w-full bg-transparent border-b-2 border-blue-500 outline-none"
          style={contentStyles}
        />
      );
    }

    // 显示模式
    switch (type) {
      case 'text':
        return (
          <div style={contentStyles}>
            {currentContent}
          </div>
        );

      case 'icon':
        // 图标类型：可以是图片URL、blob URL、data URL或者emoji/文字
        const isImageUrl = currentContent && (
          currentContent.startsWith('http') ||
          currentContent.startsWith('/') ||
          currentContent.startsWith('blob:') ||
          currentContent.startsWith('data:image/')
        );

        return (
          <div style={contentStyles}>
            {isImageUrl ? (
              <img src={currentContent} alt="Icon" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              currentContent
            )}
          </div>
        );

      case 'image':
        // 图片类型：显示用户上传的截图
        // 提取需要应用到 img 的样式
        const { objectFit, ...containerStyles } = contentStyles;

        return (
          <div style={containerStyles}>
            <img
              src={currentContent}
              alt="Screenshot"
              style={{
                width: '100%',
                height: contentStyles.height || 'auto',
                objectFit: objectFit || 'contain',
                display: 'block'
              }}
            />
          </div>
        );

      case 'component':
        return (
          <div style={contentStyles}>
            {currentContent}
          </div>
        );

      case 'list':
        // 列表项样式
        const listItemStyle = {
          ...(contentStyles?.listItemBackground && {
            background: contentStyles.listItemBackground,
            padding: contentStyles.listItemPadding,
            borderRadius: contentStyles.listItemBorderRadius,
            border: contentStyles.listItemBorder,
            boxShadow: contentStyles.listItemShadow
          }),
          ...(contentStyles?.listItemBefore && {
            display: 'flex',
            alignItems: 'flex-start',
            gap: contentStyles.listItemBeforeMargin || '12px'
          })
        };

        return (
          <ul
            style={{
              listStyleType: contentStyles?.listStyleType || 'disc',
              paddingLeft: contentStyles?.paddingLeft || '24px',
              display: 'flex',
              flexDirection: 'column',
              gap: contentStyles?.gap || '8px',
              fontSize: contentStyles?.fontSize,
              lineHeight: contentStyles?.lineHeight,
              fontWeight: contentStyles?.fontWeight,
              backgroundColor: contentStyles?.backgroundColor
            }}

          >
            {Array.isArray(content) ? content.map((item, index) => (
              <li key={index} style={listItemStyle}>
                {contentStyles?.listItemBefore && (
                  <span style={{
                    color: contentStyles.listItemBeforeColor,
                    fontSize: contentStyles.listItemBeforeSize,
                    flexShrink: 0,
                    fontWeight: 'bold'
                  }}>
                    {contentStyles.listItemBefore}
                  </span>
                )}
                <span style={{ flex: 1 }}>{item}</span>
              </li>
            )) : (
              <li style={listItemStyle}>
                {contentStyles?.listItemBefore && (
                  <span style={{
                    color: contentStyles.listItemBeforeColor,
                    fontSize: contentStyles.listItemBeforeSize,
                    flexShrink: 0,
                    fontWeight: 'bold'
                  }}>
                    {contentStyles.listItemBefore}
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
              ...contentStyles,
              cursor: 'pointer'
            }}
          >
            {renderButtonIcon()}
            <span>{currentContent}</span>
          </button>
        );

      default:
        return <div style={contentStyles}>{content}</div>;
    }
  };
  
  // 处理删除 - 支持批量删除
  const handleDelete = (e) => {
    e.stopPropagation();

    // 如果当前元素是选中的多个元素之一，删除所有选中的动态组件
    if (isSelected && state.selectedElements.length > 1) {
      state.selectedElements.forEach(element => {
        // 从 elementId 提取动态组件 ID - 修复：匹配任何 ID
        const match = element.id.match(/^dynamicComponents-(.+)-content$/);
        if (match) {
          const componentId = match[1];
          const comp = state.dynamicComponents.find(c => String(c.id) === componentId);
          if (comp) {
            deleteDynamicComponent(comp.id);
          }
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
      ref={elementRef}
      className={`absolute select-none group inline-block ${isDragging || rotateStateRef.current.isRotating ? 'z-50' : 'z-20'} ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''
      }`}
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : (rotateStateRef.current.isRotating ? 'grabbing' : 'grab'),
        transform: transform // 应用 transform 到外层容器
      }}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
      data-draggable="true"
      data-component-id={id}
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

      {/* 尺寸信息浮标 - 只在调整尺寸时显示 */}
      {resizeStateRef.current.isResizing && (
        <div className="absolute -top-8 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap">
          {currentSize.width} × {currentSize.height}
        </div>
      )}

      {/* 旋转角度浮标 - 只在旋转时显示 */}
      {rotateStateRef.current.isRotating && (
        <div className="absolute -top-8 left-0 bg-purple-500 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap">
          {currentRotation}°
        </div>
      )}

      {/* 内容区域 */}
      <div
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
      {isSelected && !isDragging && !rotateStateRef.current.isRotating && (
        <div className="absolute inset-0 bg-blue-500/10 border-2 border-blue-500 rounded pointer-events-none" />
      )}

      {/* 拖拽时的半透明覆盖层 */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 border-dashed rounded pointer-events-none" />
      )}

      {/* 旋转时的半透明覆盖层 */}
      {rotateStateRef.current.isRotating && (
        <div className="absolute inset-0 bg-purple-500/20 border-2 border-purple-500 border-dashed rounded pointer-events-none" />
      )}

      {/* 模板编辑模式 - 8个调整尺寸手柄（Figma/Canva风格）*/}
      {state.templateEditMode && isSelected && !isEditing && (
        <>
          {/* 四个角的调整尺寸手柄 */}
          <div
            className="resize-handle absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-sm cursor-nwse-resize hover:bg-blue-100 transition-colors z-50"
            style={{ top: '-8px', left: '-8px' }}
            onMouseDown={handleResizeMouseDown('nw')}
          />
          <div
            className="resize-handle absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-sm cursor-nesw-resize hover:bg-blue-100 transition-colors z-50"
            style={{ top: '-8px', right: '-8px' }}
            onMouseDown={handleResizeMouseDown('ne')}
          />
          <div
            className="resize-handle absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-sm cursor-nesw-resize hover:bg-blue-100 transition-colors z-50"
            style={{ bottom: '-8px', left: '-8px' }}
            onMouseDown={handleResizeMouseDown('sw')}
          />
          <div
            className="resize-handle absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-sm cursor-nwse-resize hover:bg-blue-100 transition-colors z-50"
            style={{ bottom: '-8px', right: '-8px' }}
            onMouseDown={handleResizeMouseDown('se')}
          />

          {/* 四条边的中点 */}
          <div
            className="resize-handle absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-sm cursor-ns-resize hover:bg-blue-100 transition-colors z-50"
            style={{ top: '-8px', left: '50%', transform: 'translateX(-50%)' }}
            onMouseDown={handleResizeMouseDown('n')}
          />
          <div
            className="resize-handle absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-sm cursor-ns-resize hover:bg-blue-100 transition-colors z-50"
            style={{ bottom: '-8px', left: '50%', transform: 'translateX(-50%)' }}
            onMouseDown={handleResizeMouseDown('s')}
          />
          <div
            className="resize-handle absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-sm cursor-ew-resize hover:bg-blue-100 transition-colors z-50"
            style={{ top: '50%', left: '-8px', transform: 'translateY(-50%)' }}
            onMouseDown={handleResizeMouseDown('w')}
          />
          <div
            className="resize-handle absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-sm cursor-ew-resize hover:bg-blue-100 transition-colors z-50"
            style={{ top: '50%', right: '-8px', transform: 'translateY(-50%)' }}
            onMouseDown={handleResizeMouseDown('e')}
          />

          {/* 四个角的旋转手柄（Figma 风格 - 在角外侧）*/}
          <div
            className="rotate-handle absolute w-3 h-3 bg-white border-2 border-purple-500 rounded-full cursor-grab hover:bg-purple-100 transition-colors z-50"
            style={{ top: '-20px', left: '-20px' }}
            onMouseDown={handleRotateMouseDown}
            title="旋转"
          />
          <div
            className="rotate-handle absolute w-3 h-3 bg-white border-2 border-purple-500 rounded-full cursor-grab hover:bg-purple-100 transition-colors z-50"
            style={{ top: '-20px', right: '-20px' }}
            onMouseDown={handleRotateMouseDown}
            title="旋转"
          />
          <div
            className="rotate-handle absolute w-3 h-3 bg-white border-2 border-purple-500 rounded-full cursor-grab hover:bg-purple-100 transition-colors z-50"
            style={{ bottom: '-20px', left: '-20px' }}
            onMouseDown={handleRotateMouseDown}
            title="旋转"
          />
          <div
            className="rotate-handle absolute w-3 h-3 bg-white border-2 border-purple-500 rounded-full cursor-grab hover:bg-purple-100 transition-colors z-50"
            style={{ bottom: '-20px', right: '-20px' }}
            onMouseDown={handleRotateMouseDown}
            title="旋转"
          />
        </>
      )}
    </div>
  );
}

export default DynamicComponent;