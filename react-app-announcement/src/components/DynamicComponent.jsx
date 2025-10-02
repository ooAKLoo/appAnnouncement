import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Move } from 'lucide-react';
import EditableWrapper from './EditableWrapper';

function DynamicComponent({ component }) {
  const { updateDynamicComponent, deleteDynamicComponent } = useApp();
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  const { id, type, content, position, styles } = component;
  
  // 处理拖拽开始
  const handleMouseDown = (e) => {
    if (e.target.closest('.component-control')) return; // 如果点击的是控制按钮，不启动拖拽
    
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
    
    e.preventDefault();
  };
  
  // 处理拖拽过程
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const newPosition = {
      x: e.clientX - dragOffset.x,
      y: e.clientY - dragOffset.y
    };
    
    updateDynamicComponent(id, { position: newPosition });
  };
  
  // 处理拖拽结束
  const handleMouseUp = () => {
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
  
  // 渲染不同类型的内容
  const renderContent = () => {
    switch (type) {
      case 'text':
        return (
          <div style={styles}>
            {content}
          </div>
        );
        
      case 'heading':
        return (
          <h2 style={styles}>
            {content}
          </h2>
        );
        
      case 'list':
        return (
          <ul style={styles} className="list-disc pl-6">
            {Array.isArray(content) ? content.map((item, index) => (
              <li key={index}>{item}</li>
            )) : <li>{content}</li>}
          </ul>
        );
        
      case 'button':
        return (
          <button 
            style={{
              ...styles,
              border: '1px solid #ccc',
              cursor: 'pointer'
            }}
            className="px-4 py-2 rounded hover:bg-gray-50 transition-colors"
          >
            {content}
          </button>
        );
        
      default:
        return <div style={styles}>{content}</div>;
    }
  };
  
  return (
    <div
      className={`absolute select-none group ${isDragging ? 'z-50' : 'z-20'}`}
      style={{
        left: position.x,
        top: position.y,
        cursor: isDragging ? 'grabbing' : 'grab'
      }}
      onMouseDown={handleMouseDown}
    >
      {/* 组件控制栏 */}
      <div className="absolute -top-8 left-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-1 bg-gray-800 text-white text-xs px-2 py-1 rounded-md shadow-lg component-control">
        <Move size={12} />
        <span className="capitalize">{type}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteDynamicComponent(id);
          }}
          className="ml-2 p-0.5 hover:bg-gray-700 rounded"
        >
          <X size={10} />
        </button>
      </div>
      
      {/* 可编辑包装器 */}
      <EditableWrapper
        elementType={`dynamic-${type}`}
        elementId={`dynamic-${id}`}
        elementPath={`dynamicComponents.${id}.content`}
        className="min-w-[100px] min-h-[30px]"
      >
        {renderContent()}
      </EditableWrapper>
      
      {/* 拖拽时的半透明覆盖层 */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/20 border-2 border-blue-500 border-dashed rounded pointer-events-none" />
      )}
    </div>
  );
}

export default DynamicComponent;