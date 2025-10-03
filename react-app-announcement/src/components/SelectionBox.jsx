import React from 'react';

/**
 * 框选组件 - 显示鼠标拖拽的选择框
 */
function SelectionBox({ start, end, isActive }) {
  if (!isActive || !start || !end) return null;

  // 计算选框的位置和尺寸
  const left = Math.min(start.x, end.x);
  const top = Math.min(start.y, end.y);
  const width = Math.abs(end.x - start.x);
  const height = Math.abs(end.y - start.y);

  return (
    <div
      className="absolute pointer-events-none z-50"
      style={{
        left: `${left}px`,
        top: `${top}px`,
        width: `${width}px`,
        height: `${height}px`,
        border: '2px solid #3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        transition: 'none'
      }}
    />
  );
}

export default SelectionBox;
