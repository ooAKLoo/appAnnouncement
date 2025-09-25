import React from 'react';
import { Plus, X, Eye, EyeOff } from 'lucide-react';

function OptionalContentSection({ 
  title, 
  icon, 
  description, 
  isVisible, 
  onToggle, 
  children, 
  className = "" 
}) {
  
  if (!isVisible) {
    // 未启用状态 - 显示添加按钮
    return (
      <div className={`border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-gray-300 hover:bg-gray-50/50 transition-all duration-200 ${className}`}>
        <div className="text-gray-400 mb-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
            {icon}
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">{title}</h3>
          <p className="text-xs text-gray-500 mb-4">{description}</p>
        </div>
        
        <button
          onClick={onToggle}
          className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-medium rounded-lg hover:shadow-md hover:scale-105 transition-all duration-200"
        >
          <Plus size={16} />
          <span>添加{title}</span>
        </button>
      </div>
    );
  }

  // 已启用状态 - 显示内容和隐藏按钮
  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="text-base font-medium text-gray-700 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-primary-blue"></div>
          {title}
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={onToggle}
            className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
            title={`隐藏${title}`}
          >
            <EyeOff size={16} />
          </button>
        </div>
      </div>
      
      {children}
    </div>
  );
}

export default OptionalContentSection;