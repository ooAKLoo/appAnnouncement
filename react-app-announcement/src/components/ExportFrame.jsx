import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Move } from 'lucide-react';

// 导出框显示配置常量
const EXPORT_FRAME_MARGIN = 100;
const EXPORT_FRAME_SCALE = 0.9;

function ExportFrame() {
  const { state, updateDesign } = useApp();
  const frameRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeCorner, setResizeCorner] = useState(null);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 拖拽手柄开始
  const handleDragHandleMouseDown = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const defaultX = window.innerWidth / 2;
    const defaultY = window.innerHeight / 2;
    const currentX = state.design.exportX !== null ? state.design.exportX : defaultX;
    const currentY = state.design.exportY !== null ? state.design.exportY : defaultY;

    setIsDragging(true);
    setDragStart({
      x: e.clientX - currentX,
      y: e.clientY - currentY
    });
  };

  // 缩放开始
  const handleResizeStart = (corner, e) => {
    e.stopPropagation();
    setIsResizing(true);
    setResizeCorner(corner);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      startScale: state.design.exportScale || 1
    });
  };

  // 鼠标移动
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDragging) {
        const newX = e.clientX - dragStart.x;
        const newY = e.clientY - dragStart.y;
        updateDesign({
          exportX: newX,
          exportY: newY
        });
      } else if (isResizing && resizeCorner) {
        // 计算缩放
        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        // 根据角的位置判断缩放方向
        let scaleFactor = 0;

        // 判断拖拽方向与角的关系
        // 左上角/右下角：向外（负负或正正）= 放大，向内 = 缩小
        // 右上角/左下角：向外（负正或正负）= 放大，向内 = 缩小
        if (resizeCorner === 'tl') {
          // 左上角：往左上拖拽（deltaX负 deltaY负）= 放大
          scaleFactor = -(deltaX + deltaY);
        } else if (resizeCorner === 'tr') {
          // 右上角：往右上拖拽（deltaX正 deltaY负）= 放大
          scaleFactor = (deltaX - deltaY);
        } else if (resizeCorner === 'bl') {
          // 左下角：往左下拖拽（deltaX负 deltaY正）= 放大
          scaleFactor = (-deltaX + deltaY);
        } else if (resizeCorner === 'br') {
          // 右下角：往右下拖拽（deltaX正 deltaY正）= 放大
          scaleFactor = (deltaX + deltaY);
        }

        // 缩放系数变化（每 500px 变化 1 倍）
        const scaleChange = scaleFactor / 500;
        const newScale = Math.max(0.1, Math.min(3, dragStart.startScale + scaleChange));

        updateDesign({
          exportScale: newScale
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeCorner(null);
    };

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);

      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing, dragStart, resizeCorner, state.design.exportScale, updateDesign]);

  // 在所有 Hooks 之后再做条件判断
  if (!state.design.exportWidth || !state.design.exportHeight) {
    return null;
  }

  // 计算显示尺寸和位置
  const canvasWidth = window.innerWidth - EXPORT_FRAME_MARGIN;
  const canvasHeight = window.innerHeight - EXPORT_FRAME_MARGIN;

  const scaleX = canvasWidth / state.design.exportWidth;
  const scaleY = canvasHeight / state.design.exportHeight;
  const baseScale = Math.min(scaleX, scaleY, 1);
  const autoScale = baseScale * EXPORT_FRAME_SCALE;

  // 应用用户的额外缩放
  const finalScale = autoScale * (state.design.exportScale || 1);

  const displayWidth = state.design.exportWidth * finalScale;
  const displayHeight = state.design.exportHeight * finalScale;

  // 计算位置（默认居中）
  const defaultX = window.innerWidth / 2;
  const defaultY = window.innerHeight / 2;
  const frameX = state.design.exportX !== null ? state.design.exportX : defaultX;
  const frameY = state.design.exportY !== null ? state.design.exportY : defaultY;

  return (
    <div
      ref={frameRef}
      className="absolute select-none pointer-events-none"
      style={{
        left: `${frameX}px`,
        top: `${frameY}px`,
        transform: 'translate(-50%, -50%)',
        width: `${displayWidth}px`,
        height: `${displayHeight}px`,
        border: '2px dashed rgba(59, 130, 246, 0.6)',
        zIndex: 1000
      }}
    >
      {/* 尺寸标签 */}
      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-3 py-1 bg-blue-600 text-white text-xs font-mono rounded shadow-lg whitespace-nowrap pointer-events-none">
        {state.design.exportWidth} × {state.design.exportHeight}
        <span className="ml-2 opacity-75">
          ({Math.round(finalScale * 100)}%)
        </span>
      </div>

      {/* 拖拽手柄 - 右上角 */}
      <div
        className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg flex items-center justify-center cursor-move transition-all hover:scale-110 pointer-events-auto"
        onMouseDown={handleDragHandleMouseDown}
        title="拖拽移动导出框"
      >
        <Move size={16} />
      </div>

      {/* 四个角的缩放控制点 */}
      <div
        className="resize-handle absolute -top-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize hover:scale-125 transition-transform pointer-events-auto"
        onMouseDown={(e) => handleResizeStart('tl', e)}
      />
      <div
        className="resize-handle absolute -top-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize hover:scale-125 transition-transform pointer-events-auto"
        onMouseDown={(e) => handleResizeStart('tr', e)}
      />
      <div
        className="resize-handle absolute -bottom-2 -left-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nesw-resize hover:scale-125 transition-transform pointer-events-auto"
        onMouseDown={(e) => handleResizeStart('bl', e)}
      />
      <div
        className="resize-handle absolute -bottom-2 -right-2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full cursor-nwse-resize hover:scale-125 transition-transform pointer-events-auto"
        onMouseDown={(e) => handleResizeStart('br', e)}
      />

      {/* 四个角的装饰线 */}
      <div className="absolute -top-1 -left-1 w-6 h-6 border-l-2 border-t-2 border-blue-500 pointer-events-none"></div>
      <div className="absolute -top-1 -right-1 w-6 h-6 border-r-2 border-t-2 border-blue-500 pointer-events-none"></div>
      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-l-2 border-b-2 border-blue-500 pointer-events-none"></div>
      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-r-2 border-b-2 border-blue-500 pointer-events-none"></div>
    </div>
  );
}

export default ExportFrame;
