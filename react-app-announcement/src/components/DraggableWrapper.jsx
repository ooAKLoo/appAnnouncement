import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GripVertical } from 'lucide-react';

function DraggableWrapper({ 
  children, 
  index, 
  onReorder, 
  dragType = 'feature',
  className = '',
  disabled = false 
}) {
  const { state } = useApp();
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragPosition, setDragPosition] = useState(null); // 'top' | 'bottom'
  
  if (disabled) {
    return <div className={className}>{children}</div>;
  }
  
  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', index.toString());
    e.dataTransfer.setData('dragType', dragType);
    e.dataTransfer.effectAllowed = 'move';
    
    // 添加拖拽样式
    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };
  
  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setIsDragOver(false);
    setDragPosition(null);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    const rect = e.currentTarget.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const height = rect.height;
    
    // 判断拖拽位置（上半部分还是下半部分）
    const position = y < height / 2 ? 'top' : 'bottom';
    setDragPosition(position);
    setIsDragOver(true);
  };
  
  const handleDragLeave = (e) => {
    // 只有当鼠标真正离开当前元素时才清除状态
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false);
      setDragPosition(null);
    }
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    
    const draggedIndex = parseInt(e.dataTransfer.getData('text/plain'));
    const dropType = e.dataTransfer.getData('dragType');
    
    // 确保拖拽类型匹配
    if (dropType !== dragType) {
      setIsDragOver(false);
      setDragPosition(null);
      return;
    }
    
    let targetIndex = index;
    
    // 根据拖拽位置调整目标索引
    if (dragPosition === 'bottom') {
      targetIndex = index + 1;
    }
    
    // 如果拖拽的元素在目标位置之前，需要调整索引
    if (draggedIndex < targetIndex) {
      targetIndex -= 1;
    }
    
    if (draggedIndex !== targetIndex && onReorder) {
      onReorder(draggedIndex, targetIndex);
    }
    
    setIsDragOver(false);
    setDragPosition(null);
  };
  
  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        ${className}
        group relative cursor-move transition-all duration-200
        ${isDragOver ? 'scale-105' : ''}
      `}
    >
      {/* 拖拽指示线 */}
      {isDragOver && (
        <div className={`
          absolute left-0 right-0 h-0.5 bg-blue-500 z-10 rounded-full
          ${dragPosition === 'top' ? '-top-1' : '-bottom-1'}
        `} />
      )}
      
      {/* 拖拽手柄 - 始终显示 */}
      <div className="absolute -left-8 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
        <div className="w-6 h-6 bg-gray-300 hover:bg-gray-400 rounded cursor-grab active:cursor-grabbing flex items-center justify-center transition-colors">
          <GripVertical size={12} className="text-gray-600" />
        </div>
      </div>
      
      {/* 内容 */}
      <div className={`transition-all duration-200 ${isDragOver ? 'bg-blue-50/50 rounded-lg' : ''}`}>
        {children}
      </div>
    </div>
  );
}

export default DraggableWrapper;