import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Move, X } from 'lucide-react';

/**
 * 可编辑元素组件 - 画布架构版本
 *
 * Props:
 * - path: 元素路径（如 "appInfo.icon"）
 * - x: 初始 X 坐标（相对于画布左上角）
 * - y: 初始 Y 坐标（相对于画布左上角）
 * - children: 元素内容
 *
 * 核心原则：
 * 1. 从一开始就是 position: absolute
 * 2. 使用传入的 x, y 作为初始位置
 * 3. 拖拽后位置保存在 state.elementStyles
 * 4. 无需任何测量和转换
 */
function Editable({ path, x = 100, y = 100, children, className = '' }) {
  const { state, updateElementStyle, selectElement, setCurrentPanel, clearSelection, updateAppInfo, updateProductHuntInfo, updateTemplateConfigCode } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });
  const [dragStartElementPos, setDragStartElementPos] = useState({ x: 0, y: 0 });
  const [dragStartSize, setDragStartSize] = useState({ width: 0, height: 0 });
  const [currentSize, setCurrentSize] = useState({ width: 0, height: 0 });
  const [initialOffsets, setInitialOffsets] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const elementRef = React.useRef(null);
  const inputRef = React.useRef(null);

  // 缓存初始位置，避免 props 变化导致跳动
  const initialPosition = React.useMemo(() => ({ x, y }), []);

  // 组件挂载时输出日志
  React.useEffect(() => {
    console.log(`📦 [Editable] 组件挂载: path=${path}, templateEditMode=${state.templateEditMode}`);
  }, []);

  // 监听 templateEditMode 变化
  React.useEffect(() => {
    console.log(`🔄 [Editable ${path}] templateEditMode 变化:`, state.templateEditMode);
  }, [state.templateEditMode, path]);

  const id = path.replace(/\./g, '-');
  const customStyles = state.elementStyles?.[id] || {};
  const isSelected = state.selectedElements?.some(el => el.id === id) || false;
  const isDeleted = customStyles.display === 'none';

  // 🔧 首次加载时，如果 elementStyles 中没有位置信息，将初始位置保存进去
  // 这样可以避免后续从 props 位置切换到 elementStyles 位置时的跳动
  const hasInitializedRef = React.useRef(false);
  React.useEffect(() => {
    if (!hasInitializedRef.current &&
        customStyles.left === undefined &&
        customStyles.top === undefined) {
      hasInitializedRef.current = true;
      updateElementStyle(id, {
        left: `${initialPosition.x}px`,
        top: `${initialPosition.y}px`
      });
    }
  }, [id, customStyles.left, customStyles.top, initialPosition.x, initialPosition.y, updateElementStyle]);

  if (isDeleted) return null;

  // 获取位置：优先使用用户拖拽后保存的位置，否则使用缓存的初始位置
  const getPosition = () => {
    if (customStyles.left !== undefined && customStyles.top !== undefined) {
      return {
        x: parseFloat(customStyles.left),
        y: parseFloat(customStyles.top)
      };
    }
    return initialPosition; // 使用缓存的初始位置而不是 props
  };

  const position = getPosition();

  // 生成模板配置代码
  const generateConfigCode = React.useCallback(() => {
    if (!state.templateEditMode) {
      console.log('⚠️ 不在模板编辑模式，跳过代码生成');
      return;
    }

    if (!elementRef.current) {
      console.log('⚠️ 元素引用不存在，跳过代码生成');
      return;
    }

    // 直接从 state 获取最新位置
    const elementStyles = state.elementStyles?.[id] || {};
    const currentX = elementStyles.left !== undefined ? parseFloat(elementStyles.left) : initialPosition.x;
    const currentY = elementStyles.top !== undefined ? parseFloat(elementStyles.top) : initialPosition.y;

    const rect = elementRef.current.getBoundingClientRect();

    // 获取子元素的className
    const childElement = elementRef.current.firstElementChild;
    const childClassName = childElement?.className || '';

    const config = {
      path,
      position: { x: Math.round(currentX), y: Math.round(currentY) },
      size: {
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      },
      className: childClassName,
      styles: customStyles
    };

    const code = `<Editable path="${path}" x={${config.position.x}} y={${config.position.y}}>
  <div className="${childClassName}">
    {/* 元素内容 */}
  </div>
</Editable>

// 数据配置:
{
  id: generateId(),
  type: 'element',
  dataPath: '${path}',
  position: { x: ${config.position.x}, y: ${config.position.y} },
  styles: {
    width: '${config.size.width}px',
    height: '${config.size.height}px',
    // ... 其他样式
  }
}`;

    console.log('📐 生成模板配置代码:', config);
    updateTemplateConfigCode(code);
  }, [state.templateEditMode, state.elementStyles, id, initialPosition, path, customStyles, updateTemplateConfigCode]);

  // 🔍 监听选中状态，打印 APP icon 诊断信息
  React.useEffect(() => {
    if (isSelected && elementRef.current && path === 'appInfo.icon') {
      setTimeout(() => {
        const rect = elementRef.current.getBoundingClientRect();
        const computedStyle = window.getComputedStyle(elementRef.current);

        // 获取实际内容子元素（跳过控制栏等）
        const contentChild = Array.from(elementRef.current.children).find(
          child => !child.classList.contains('component-control') && !child.classList.contains('resize-handle')
        );
        const childRect = contentChild ? contentChild.getBoundingClientRect() : null;
        const childComputedStyle = contentChild ? window.getComputedStyle(contentChild) : null;

        console.log('='.repeat(80));
        console.log('🔍 APP ICON 尺寸诊断报告');
        console.log('='.repeat(80));
        console.log('外层 Editable 容器:');
        console.log('  - 实际渲染尺寸:', rect.width, 'x', rect.height);
        console.log('  - 计算后的width样式:', computedStyle.width);
        console.log('  - 计算后的height样式:', computedStyle.height);
        console.log('  - display:', computedStyle.display);
        console.log('  - boxSizing:', computedStyle.boxSizing);
        console.log('');
        console.log('内层 APP icon div:');
        console.log('  - 实际渲染尺寸:', childRect?.width, 'x', childRect?.height);
        console.log('  - className:', contentChild?.className);
        console.log('');
        console.log('尺寸差异:');
        console.log('  - 宽度差:', rect.width - (childRect?.width || 0), 'px');
        console.log('  - 高度差:', rect.height - (childRect?.height || 0), 'px');
        console.log('='.repeat(80));
      }, 100);
    }

    if (elementRef.current) {
      const rect = elementRef.current.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(elementRef.current);

      // 获取第一个子元素的样式
      const firstChild = elementRef.current.firstElementChild;
      const childComputedStyle2 = firstChild ? window.getComputedStyle(firstChild) : null;

      console.log(`📊 [${path}] 状态变化:`, {
        isSelected,
        position,
        propsXY: { x, y },
        customStyles,
        rect: {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height
        },
        computedStyle: {
          left: computedStyle.left,
          top: computedStyle.top,
          position: computedStyle.position,
          display: computedStyle.display,
          width: computedStyle.width,
          height: computedStyle.height,
          margin: computedStyle.margin,
          padding: computedStyle.padding,
          boxSizing: computedStyle.boxSizing,
          transform: computedStyle.transform
        },
        childStyle: childComputedStyle ? {
          display: childComputedStyle.display,
          width: childComputedStyle.width,
          height: childComputedStyle.height,
          margin: childComputedStyle.margin
        } : null
      });
    }
  }, [isSelected, position.x, position.y, path, x, y, customStyles]);

  // 处理拖拽开始
  const handleMouseDown = (e) => {
    // 如果正在编辑或点击的是控制按钮或输入框，不启动拖拽
    if (e.target.closest('.component-control') || e.target.closest('.resize-handle') || isEditing) return;
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    const currentPos = getPosition();

    console.log(`🖱️ [${path}] MouseDown:`, {
      event: { clientX: e.clientX, clientY: e.clientY },
      currentPos,
      customStyles,
      isSelected,
      selectedCount: state.selectedElements.length
    });

    setIsDragging(true);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setDragStartElementPos({ x: currentPos.x, y: currentPos.y }); // 保存元素的初始位置

    // 多选模式：记录所有元素的初始位置
    if (isSelected && state.selectedElements.length > 1) {
      const offsets = {};
      state.selectedElements.forEach(element => {
        const elementStyles = state.elementStyles?.[element.id] || {};
        const elemX = elementStyles.left !== undefined ? parseFloat(elementStyles.left) : 100;
        const elemY = elementStyles.top !== undefined ? parseFloat(elementStyles.top) : 100;
        offsets[element.id] = { x: elemX, y: elemY };
      });
      setInitialOffsets(offsets);
    }

    e.stopPropagation();
    e.preventDefault();
  };

  // 处理调整尺寸开始
  const handleResizeMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();

    if (!elementRef.current) return;

    const rect = elementRef.current.getBoundingClientRect();
    setIsResizing(true);
    setDragStartPos({ x: e.clientX, y: e.clientY });
    setDragStartSize({ width: rect.width, height: rect.height });

    console.log(`📏 [${path}] ResizeStart:`, {
      startSize: { width: rect.width, height: rect.height },
      startPos: { x: e.clientX, y: e.clientY }
    });
  };

  // 处理拖拽过程
  const handleMouseMove = (e) => {
    if (!isDragging && !isResizing) return;

    const deltaX = e.clientX - dragStartPos.x;
    const deltaY = e.clientY - dragStartPos.y;

    if (isResizing) {
      // 调整尺寸
      const newWidth = Math.max(50, dragStartSize.width + deltaX);
      const newHeight = Math.max(20, dragStartSize.height + deltaY);

      // 更新尺寸显示
      setCurrentSize({ width: Math.round(newWidth), height: Math.round(newHeight) });

      updateElementStyle(id, {
        width: `${newWidth}px`,
        height: `${newHeight}px`
      });
    } else if (isDragging) {
      // 拖拽移动
      if (isSelected && state.selectedElements.length > 1) {
        // 批量移动
        state.selectedElements.forEach(element => {
          const initialOffset = initialOffsets[element.id] || { x: 0, y: 0 };
          updateElementStyle(element.id, {
            left: `${initialOffset.x + deltaX}px`,
            top: `${initialOffset.y + deltaY}px`
          });
        });
      } else {
        // 单个移动 - 使用拖拽开始时的位置
        updateElementStyle(id, {
          left: `${dragStartElementPos.x + deltaX}px`,
          top: `${dragStartElementPos.y + deltaY}px`
        });
      }
    }
  };

  // 处理拖拽结束
  const handleMouseUp = (e) => {
    if (!isDragging && !isResizing) return;

    // 检查是否真的移动了（移动距离小于 5px 算作点击）
    const moveDistance = Math.sqrt(
      Math.pow(e.clientX - dragStartPos.x, 2) +
      Math.pow(e.clientY - dragStartPos.y, 2)
    );

    console.log(`🖱️ [${path}] MouseUp:`, {
      moveDistance,
      dragStartPos,
      currentMousePos: { x: e.clientX, y: e.clientY },
      isClick: moveDistance < 5
    });

    if (moveDistance < 5 && !isResizing) {
      // 没有移动，当作点击处理 - 选中元素
      const isMultiSelect = e.ctrlKey || e.metaKey;

      console.log(`✅ [${path}] 单击选中:`, {
        isMultiSelect,
        beforeSelect: {
          isSelected,
          selectedCount: state.selectedElements.length
        }
      });

      selectElement('element', id, path, isMultiSelect);

      // 🖼️ 如果是图片/图标元素，自动打开图片侧边栏
      const imagePaths = ['appInfo.icon', 'productHuntInfo.icon'];
      const isImagePath = imagePaths.includes(path) || path.includes('icon') || path.includes('image');
      if (isImagePath) {
        console.log(`🖼️ [${path}] 单击图片元素，打开图片侧边栏`);
        setCurrentPanel('image');
      }

      // 模板编辑模式下，点击也生成代码
      if (state.templateEditMode) {
        setTimeout(() => generateConfigCode(), 50);
      }
    } else {
      // 移动或调整大小后，在模板编辑模式下生成配置代码
      console.log(`🔄 [${path}] 移动/调整完成，生成代码...`);
      if (state.templateEditMode) {
        setTimeout(() => generateConfigCode(), 50);
      }
    }

    setIsDragging(false);
    setIsResizing(false);
  };

  // 处理双击 - 进入编辑模式或打开样式面板
  const handleDoubleClick = (e) => {
    e.stopPropagation();

    // 检查是否是文本类型的元素（可以编辑内容）
    const textPaths = ['appInfo.name', 'appInfo.title', 'appInfo.subtitle', 'productHuntInfo.badge',
                       'productHuntInfo.name', 'productHuntInfo.tagline', 'productHuntInfo.description'];

    // 检查是否是图片/图标类型的元素
    const imagePaths = ['appInfo.icon', 'productHuntInfo.icon'];
    const isImagePath = imagePaths.includes(path) || path.includes('icon') || path.includes('image');

    if (textPaths.includes(path)) {
      console.log(`✅ [${path}] 双击进入编辑模式`);
      setIsEditing(true);
    } else if (isImagePath) {
      console.log(`🖼️ [${path}] 双击打开图片侧边栏`);
      setCurrentPanel('image');
    } else {
      console.log(`✅ [${path}] 双击打开样式面板`);
      setCurrentPanel('style');
    }
  };

  // 处理内容变化
  const handleContentChange = (e) => {
    const newValue = e.target.value;
    const pathParts = path.split('.');

    if (pathParts[0] === 'appInfo') {
      updateAppInfo({ [pathParts[1]]: newValue });
    } else if (pathParts[0] === 'productHuntInfo') {
      updateProductHuntInfo({ [pathParts[1]]: newValue });
    }
  };

  // 处理编辑完成
  const handleBlur = () => {
    setIsEditing(false);
  };

  // 获取当前文本内容
  const getTextContent = () => {
    const pathParts = path.split('.');
    if (pathParts[0] === 'appInfo') {
      return state.appInfo[pathParts[1]] || '';
    } else if (pathParts[0] === 'productHuntInfo') {
      return state.productHuntInfo[pathParts[1]] || '';
    }
    return '';
  };

  // 编辑模式自动聚焦
  React.useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  // 监听全局鼠标事件
  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStartPos, dragStartElementPos, dragStartSize, isSelected, state.selectedElements, initialOffsets]);

  // 处理删除
  const handleDelete = (e) => {
    e.stopPropagation();

    if (isSelected && state.selectedElements.length > 1) {
      state.selectedElements.forEach(element => {
        updateElementStyle(element.id, { display: 'none' });
      });
      clearSelection();
    } else {
      updateElementStyle(id, { display: 'none' });
    }
  };

  // 构建最终样式 - 始终使用 absolute 定位
  // 分离用户样式和关键定位样式，确保定位样式不会被覆盖
  const userStyles = { ...customStyles };
  delete userStyles.position;
  delete userStyles.left;
  delete userStyles.top;
  delete userStyles.display;

  const finalStyle = {
    // 用户自定义样式
    ...userStyles,
    // 关键定位样式 - 放在最后确保不被覆盖
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    // 🔧 如果用户没有自定义宽度，使用 fit-content 让容器收缩到内容大小
    width: customStyles.width || 'fit-content',
    height: customStyles.height || 'fit-content',
    // 🔧 使用 inline-block 确保 fit-content 能正确计算尺寸
    display: customStyles.display || 'inline-block',
    cursor: isDragging ? 'grabbing' : 'grab',
    zIndex: isDragging ? 50 : (customStyles.zIndex || 10),
    // 选中时使用 box-shadow 和背景色，避免影响布局
    ...(isSelected ? {
      boxShadow: '0 0 0 2px #3b82f6, 0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      outline: 'none'
    } : {}),
    // 拖拽时额外的视觉反馈
    ...(isDragging ? {
      opacity: 0.8
    } : {})
  };

  return (
    <div
      ref={elementRef}
      data-editable="true"
      data-draggable="true"
      data-editable-id={id}
      data-editable-path={path}
      className={`${className} group ${isDragging ? 'z-50' : ''}`}
      style={finalStyle}
      onMouseDown={handleMouseDown}
      onDoubleClick={handleDoubleClick}
    >
      {/* 控制栏 */}
      <div className={`absolute -top-8 right-0 ${
        isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
      } transition-opacity duration-200 flex items-center gap-1 bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow-lg z-50 component-control`}>
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
      {isResizing && (
        <div className="absolute -top-8 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded shadow-lg pointer-events-none whitespace-nowrap z-50">
          {currentSize.width} × {currentSize.height}
        </div>
      )}

      {/* 内容区域 - 根据编辑状态切换 */}
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={getTextContent()}
          onChange={handleContentChange}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleBlur();
            } else if (e.key === 'Escape') {
              setIsEditing(false);
            }
          }}
          className="w-full bg-transparent border-b-2 border-blue-500 outline-none px-1"
          style={{
            fontSize: 'inherit',
            fontFamily: 'inherit',
            fontWeight: 'inherit',
            color: 'inherit',
            ...customStyles
          }}
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        children
      )}

      {/* 模板编辑模式 - 调整尺寸手柄 */}
      {state.templateEditMode && isSelected && !isEditing && (
        <div
          className="resize-handle absolute bottom-0 right-0 w-4 h-4 bg-blue-500 hover:bg-blue-600 cursor-nwse-resize rounded-tl transition-colors"
          onMouseDown={handleResizeMouseDown}
        />
      )}
    </div>
  );
}

export default Editable;
