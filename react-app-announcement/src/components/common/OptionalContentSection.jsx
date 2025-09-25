import React from 'react';

function OptionalContentSection({ 
  title, 
  icon, 
  description, 
  isVisible, 
  onToggle, 
  children, 
  className = "" 
}) {
  
  return (
    <div className={className}>
      {/* Checkbox控制区域 - 精简设计 */}
      <div className="flex items-center gap-3 mb-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
        <input
          type="checkbox"
          id={`toggle-${title}`}
          checked={isVisible}
          onChange={onToggle}
          className="w-4 h-4 text-primary-blue border-gray-300 rounded focus:ring-primary-blue"
        />
        <label htmlFor={`toggle-${title}`} className="flex-1 flex items-center gap-2 cursor-pointer">
          <div className="w-5 h-5 flex items-center justify-center text-gray-600">
            {icon}
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-700">{title}</div>
            <div className="text-xs text-gray-500">{description}</div>
          </div>
        </label>
      </div>
      
      {/* 内容区域 - 只有勾选时才显示 */}
      {isVisible && (
        <div className="border-l-2 border-primary-blue pl-4 ml-2">
          {children}
        </div>
      )}
    </div>
  );
}

export default OptionalContentSection;