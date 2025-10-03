import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

/**
 * 多选边界框组件 - 显示所有选中元素的包围框并支持整体缩放
 */
function MultiSelectionBox() {
  const { state, updateDynamicComponent, updateElementStyle } = useApp();
  const [isResizing, setIsResizing] = useState(false);
  const [currentSize, setCurrentSize] = useState({ width: 0, height: 0 });
  const resizeStateRef = useRef({
    isResizing: false,
    direction: '',
    startX: 0,
    startY: 0,
    startBounds: null,
    elementsData: [] // 存储所有元素的初始位置和尺寸
  });

  console.log('🔷 MultiSelectionBox 渲染:', {
    selectedCount: state.selectedElements.length,
    isResizing,
    selectedIds: state.selectedElements.map(el => el.id)
  });

  // 只在多选时显示
  if (state.selectedElements.length <= 1) {
    console.log('⏹️ MultiSelectionBox 隐藏: 选中元素 <=1');
    return null;
  }

  // 计算所有选中元素的边界框
  const calculateBounds = () => {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    let foundCount = 0;

    state.selectedElements.forEach(element => {
      // 从 DOM 获取元素的实际位置和尺寸
      let domElement = null;

      // 先尝试匹配 Editable 组件
      domElement = document.querySelector(`[data-editable-id="${element.id}"]`);

      // 如果不是 Editable，尝试匹配 DynamicComponent
      if (!domElement) {
        const match = element.id.match(/^dynamicComponents-(.+)-content$/);
        if (match) {
          const componentId = match[1];
          domElement = document.querySelector(`[data-component-id="${componentId}"]`);
        }
      }

      if (!domElement) {
        console.warn('⚠️ 找不到元素:', element.id);
        return;
      }

      const rect = domElement.getBoundingClientRect();
      foundCount++;

      minX = Math.min(minX, rect.left);
      minY = Math.min(minY, rect.top);
      maxX = Math.max(maxX, rect.right);
      maxY = Math.max(maxY, rect.bottom);
    });

    if (minX === Infinity || foundCount === 0) {
      console.warn('⚠️ 没有找到任何元素，无法计算边界框');
      return null;
    }

    console.log('📦 计算边界框:', {
      foundCount,
      bounds: { left: minX, top: minY, width: maxX - minX, height: maxY - minY }
    });

    return {
      left: minX,
      top: minY,
      width: maxX - minX,
      height: maxY - minY
    };
  };

  const bounds = calculateBounds();
  if (!bounds) {
    console.warn('⚠️ MultiSelectionBox: 无法计算 bounds，隐藏组件');
    return null;
  }

  console.log('✅ MultiSelectionBox 显示:', bounds);

  // 处理缩放开始
  const handleResizeMouseDown = (direction) => (e) => {
    e.stopPropagation();
    e.preventDefault();

    // 收集所有选中元素的初始数据
    const elementsData = [];
    state.selectedElements.forEach(element => {
      // 先检查是否是 DynamicComponent
      const match = element.id.match(/^dynamicComponents-(.+)-content$/);

      if (match) {
        // DynamicComponent
        const componentId = match[1];
        const comp = state.dynamicComponents.find(c => String(c.id) === String(componentId));
        if (comp) {
          const domElement = document.querySelector(`[data-component-id="${componentId}"]`);
          if (domElement) {
            const rect = domElement.getBoundingClientRect();
            elementsData.push({
              type: 'dynamic',
              id: comp.id,
              originalPos: { ...comp.position },
              originalSize: { width: rect.width, height: rect.height },
              domRect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
            });
          } else {
            console.warn('⚠️ 找不到 DynamicComponent DOM:', componentId);
          }
        }
      } else {
        // Editable
        const domElement = document.querySelector(`[data-editable-id="${element.id}"]`);
        if (domElement) {
          const rect = domElement.getBoundingClientRect();
          const elementStyles = state.elementStyles?.[element.id] || {};
          const x = elementStyles.left !== undefined ? parseFloat(elementStyles.left) : rect.left;
          const y = elementStyles.top !== undefined ? parseFloat(elementStyles.top) : rect.top;

          elementsData.push({
            type: 'editable',
            id: element.id,
            originalPos: { x, y },
            originalSize: { width: rect.width, height: rect.height },
            domRect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height }
          });
        } else {
          console.warn('⚠️ 找不到 Editable DOM:', element.id);
        }
      }
    });

    resizeStateRef.current = {
      isResizing: true,
      direction,
      startX: e.clientX,
      startY: e.clientY,
      startBounds: { ...bounds },
      elementsData
    };

    setIsResizing(true);

    console.log('📐 多选缩放开始:', {
      direction,
      bounds,
      elementsCount: elementsData.length
    });

    // 立即绑定事件监听器
    const handleMove = (e) => handleResizeMove(e);
    const handleUp = (e) => {
      resizeStateRef.current.isResizing = false;
      setIsResizing(false);
      document.removeEventListener('mousemove', handleMove);
      document.removeEventListener('mouseup', handleUp);
      console.log('📐 多选缩放结束');
    };

    document.addEventListener('mousemove', handleMove);
    document.addEventListener('mouseup', handleUp);
  };

  // 处理缩放过程
  const handleResizeMove = (e) => {
    const rs = resizeStateRef.current;
    if (!rs.isResizing) return;

    const deltaX = e.clientX - rs.startX;
    const deltaY = e.clientY - rs.startY;

    let newWidth = rs.startBounds.width;
    let newHeight = rs.startBounds.height;
    let scaleX = 1;
    let scaleY = 1;
    let anchorX = rs.startBounds.left; // 缩放锚点 X
    let anchorY = rs.startBounds.top;  // 缩放锚点 Y

    // 根据拖拽方向计算缩放比例和锚点
    switch (rs.direction) {
      case 'nw': // 左上角
        newWidth = Math.max(100, rs.startBounds.width - deltaX);
        newHeight = Math.max(50, rs.startBounds.height - deltaY);
        scaleX = newWidth / rs.startBounds.width;
        scaleY = newHeight / rs.startBounds.height;
        anchorX = rs.startBounds.left + rs.startBounds.width; // 右边作为锚点
        anchorY = rs.startBounds.top + rs.startBounds.height;  // 下边作为锚点
        break;
      case 'n': // 上边
        newHeight = Math.max(50, rs.startBounds.height - deltaY);
        scaleY = newHeight / rs.startBounds.height;
        anchorY = rs.startBounds.top + rs.startBounds.height;
        break;
      case 'ne': // 右上角
        newWidth = Math.max(100, rs.startBounds.width + deltaX);
        newHeight = Math.max(50, rs.startBounds.height - deltaY);
        scaleX = newWidth / rs.startBounds.width;
        scaleY = newHeight / rs.startBounds.height;
        anchorX = rs.startBounds.left; // 左边作为锚点
        anchorY = rs.startBounds.top + rs.startBounds.height;
        break;
      case 'e': // 右边
        newWidth = Math.max(100, rs.startBounds.width + deltaX);
        scaleX = newWidth / rs.startBounds.width;
        anchorX = rs.startBounds.left;
        break;
      case 'se': // 右下角
        newWidth = Math.max(100, rs.startBounds.width + deltaX);
        newHeight = Math.max(50, rs.startBounds.height + deltaY);
        scaleX = newWidth / rs.startBounds.width;
        scaleY = newHeight / rs.startBounds.height;
        anchorX = rs.startBounds.left;
        anchorY = rs.startBounds.top;
        break;
      case 's': // 下边
        newHeight = Math.max(50, rs.startBounds.height + deltaY);
        scaleY = newHeight / rs.startBounds.height;
        anchorY = rs.startBounds.top;
        break;
      case 'sw': // 左下角
        newWidth = Math.max(100, rs.startBounds.width - deltaX);
        newHeight = Math.max(50, rs.startBounds.height + deltaY);
        scaleX = newWidth / rs.startBounds.width;
        scaleY = newHeight / rs.startBounds.height;
        anchorX = rs.startBounds.left + rs.startBounds.width;
        anchorY = rs.startBounds.top;
        break;
      case 'w': // 左边
        newWidth = Math.max(100, rs.startBounds.width - deltaX);
        scaleX = newWidth / rs.startBounds.width;
        anchorX = rs.startBounds.left + rs.startBounds.width;
        break;
    }

    // 更新尺寸显示
    setCurrentSize({ width: Math.round(newWidth), height: Math.round(newHeight) });

    // 根据缩放比例调整每个元素
    rs.elementsData.forEach(elementData => {
      // 计算元素相对于锚点的新位置
      const offsetX = elementData.domRect.left - anchorX;
      const offsetY = elementData.domRect.top - anchorY;

      const newX = anchorX + offsetX * scaleX;
      const newY = anchorY + offsetY * scaleY;
      const newElemWidth = elementData.originalSize.width * scaleX;
      const newElemHeight = elementData.originalSize.height * scaleY;

      if (elementData.type === 'dynamic') {
        // 更新 DynamicComponent
        updateDynamicComponent(elementData.id, {
          position: { x: newX, y: newY },
          styles: {
            width: `${Math.round(newElemWidth)}px`,
            height: `${Math.round(newElemHeight)}px`
          }
        });
      } else {
        // 更新 Editable
        updateElementStyle(elementData.id, {
          left: `${newX}px`,
          top: `${newY}px`,
          width: `${Math.round(newElemWidth)}px`,
          height: `${Math.round(newElemHeight)}px`
        });
      }
    });
  };

  return (
    <div
      className="absolute pointer-events-none z-50 multi-selection-box"
      style={{
        left: `${bounds.left}px`,
        top: `${bounds.top}px`,
        width: `${bounds.width}px`,
        height: `${bounds.height}px`,
        border: '2px solid #3b82f6',
        boxShadow: '0 0 0 1px rgba(59, 130, 246, 0.3)',
        backgroundColor: isResizing ? 'rgba(59, 130, 246, 0.05)' : 'transparent'
      }}
    >
      {/* 8个缩放控制点 */}
      {/* 四个角 */}
      <div
        className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-sm cursor-nwse-resize hover:bg-blue-100 transition-colors pointer-events-auto"
        style={{ top: '-8px', left: '-8px' }}
        onMouseDown={handleResizeMouseDown('nw')}
      />
      <div
        className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-sm cursor-nesw-resize hover:bg-blue-100 transition-colors pointer-events-auto"
        style={{ top: '-8px', right: '-8px' }}
        onMouseDown={handleResizeMouseDown('ne')}
      />
      <div
        className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-sm cursor-nesw-resize hover:bg-blue-100 transition-colors pointer-events-auto"
        style={{ bottom: '-8px', left: '-8px' }}
        onMouseDown={handleResizeMouseDown('sw')}
      />
      <div
        className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-sm cursor-nwse-resize hover:bg-blue-100 transition-colors pointer-events-auto"
        style={{ bottom: '-8px', right: '-8px' }}
        onMouseDown={handleResizeMouseDown('se')}
      />

      {/* 四条边的中点 */}
      <div
        className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-sm cursor-ns-resize hover:bg-blue-100 transition-colors pointer-events-auto"
        style={{ top: '-8px', left: '50%', transform: 'translateX(-50%)' }}
        onMouseDown={handleResizeMouseDown('n')}
      />
      <div
        className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-sm cursor-ns-resize hover:bg-blue-100 transition-colors pointer-events-auto"
        style={{ bottom: '-8px', left: '50%', transform: 'translateX(-50%)' }}
        onMouseDown={handleResizeMouseDown('s')}
      />
      <div
        className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-sm cursor-ew-resize hover:bg-blue-100 transition-colors pointer-events-auto"
        style={{ top: '50%', left: '-8px', transform: 'translateY(-50%)' }}
        onMouseDown={handleResizeMouseDown('w')}
      />
      <div
        className="absolute w-4 h-4 bg-white border-2 border-blue-500 rounded-sm cursor-ew-resize hover:bg-blue-100 transition-colors pointer-events-auto"
        style={{ top: '50%', right: '-8px', transform: 'translateY(-50%)' }}
        onMouseDown={handleResizeMouseDown('e')}
      />

      {/* 显示选中数量和尺寸 */}
      <div
        className="absolute -top-8 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded pointer-events-none"
        style={{ whiteSpace: 'nowrap' }}
      >
        {state.selectedElements.length} 个元素
        {isResizing && ` · ${currentSize.width} × ${currentSize.height}`}
      </div>
    </div>
  );
}

export default MultiSelectionBox;
