import React from 'react';
import { useApp } from '../context/AppContext';

function EditableWrapper({ 
  children, 
  elementType, 
  elementId, 
  elementPath, 
  className = '',
  style = {},
  allowDrag = false 
}) {
  const { state, selectElement } = useApp();
  
  const isSelected = state.selectedElement?.id === elementId;
  const customStyles = state.elementStyles[elementId] || {};
  
  const handleClick = (e) => {
    e.stopPropagation();
    selectElement(elementType, elementId, elementPath);
  };
  
  return (
    <div
      onClick={handleClick}
      style={{ ...style, ...customStyles }}
      className={`
        ${className}
        relative cursor-pointer transition-all duration-200
        ${isSelected ? 'ring-2 ring-blue-500 ring-offset-2' : ''}
        ${!isSelected ? 'hover:ring-2 hover:ring-blue-300 hover:ring-offset-1' : ''}
      `}
      data-editable-type={elementType}
      data-editable-id={elementId}
    >
      {/* 选中指示器 */}
      {isSelected && (
        <div className="absolute -top-8 left-0 z-50 bg-blue-500 text-white text-xs px-2 py-1 rounded-md shadow-lg whitespace-nowrap">
          正在编辑 {elementType}
        </div>
      )}
      
      {/* 悬停指示器 */}
      {!isSelected && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          <div className="absolute -top-6 left-0 bg-gray-700 text-white text-xs px-2 py-1 rounded shadow-lg whitespace-nowrap">
            点击编辑 {elementType}
          </div>
        </div>
      )}
      
      {children}
    </div>
  );
}

export default EditableWrapper;