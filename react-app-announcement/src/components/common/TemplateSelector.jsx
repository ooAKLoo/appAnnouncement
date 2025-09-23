import React from 'react';

const templateConfigs = {
  classic: {
    name: '经典布局',
    description: '左文右图，适合突出产品特性',
    preview: (
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 space-y-1">
          <div className="w-6 h-1.5 bg-gray-400 rounded"></div>
          <div className="w-8 h-1 bg-gray-300 rounded"></div>
          <div className="w-5 h-0.5 bg-primary-blue rounded"></div>
        </div>
        <div className="w-4 h-8 bg-gray-400 rounded"></div>
      </div>
    )
  },
  center: {
    name: '居中布局',
    description: '内容居中，简洁现代',
    preview: (
      <div className="flex flex-col items-center gap-1 w-full">
        <div className="w-6 h-1.5 bg-gray-400 rounded"></div>
        <div className="w-8 h-1 bg-gray-300 rounded"></div>
        <div className="w-5 h-0.5 bg-primary-blue rounded"></div>
        <div className="w-3 h-5 bg-gray-400 rounded mt-1"></div>
      </div>
    )
  },
  minimal: {
    name: '极简布局',
    description: '突出产品，最小干扰',
    preview: (
      <div className="flex flex-row-reverse items-center gap-2 w-full">
        <div className="w-5 h-8 bg-gray-400 rounded"></div>
        <div className="flex-1 space-y-1">
          <div className="w-8 h-1.5 bg-gray-400 rounded"></div>
          <div className="w-5 h-0.5 bg-primary-blue rounded"></div>
        </div>
      </div>
    )
  },
  elegant: {
    name: '优雅布局',
    description: '精致设计，商务感强',
    preview: (
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 space-y-1">
          <div className="w-4 h-1 bg-gray-300 rounded"></div>
          <div className="w-8 h-1.5 bg-gray-400 rounded"></div>
          <div className="w-5 h-0.5 bg-yellow-500 rounded"></div>
        </div>
        <div className="w-4 h-8 bg-gray-400 rounded transform rotate-12"></div>
      </div>
    )
  },
  light: {
    name: '轻盈布局',
    description: '卡片式设计，现代简约',
    preview: (
      <div className="flex flex-col gap-1 w-full">
        <div className="w-8 h-1.5 bg-gray-400 rounded mx-auto"></div>
        <div className="w-5 h-0.5 bg-primary-blue rounded mx-auto"></div>
        <div className="grid grid-cols-2 gap-1 mt-1">
          <div className="h-2 bg-white rounded border border-gray-200"></div>
          <div className="h-2 bg-white rounded border border-gray-200"></div>
        </div>
      </div>
    )
  },
  premium: {
    name: '高级布局',
    description: '奢华质感，突出品质',
    preview: (
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 space-y-1">
          <div className="w-2 h-0.5 bg-yellow-500 rounded"></div>
          <div className="w-8 h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded"></div>
          <div className="w-5 h-0.5 bg-yellow-500 rounded"></div>
        </div>
        <div className="w-4 h-8 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded shadow-sm"></div>
      </div>
    )
  }
};

function TemplateSelector({ templates, selectedTemplate, onSelect }) {
  return (
    <div className="space-y-3">
      {templates.map((templateId) => {
        const config = templateConfigs[templateId];
        if (!config) return null;
        
        return (
          <div 
            key={templateId}
            className={`cursor-pointer border-2 rounded-xl p-4 transition-all duration-200 hover:shadow-md ${
              selectedTemplate === templateId 
                ? 'border-primary-blue bg-primary-blue/5 shadow-md' 
                : 'border-gray-200 hover:border-primary-blue/50'
            }`}
            onClick={() => onSelect(templateId)}
          >
            <div className="h-12 bg-gray-50 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
              <div className="scale-75 transform-gpu w-full">
                {config.preview}
              </div>
            </div>
            <div className="font-medium text-gray-800 text-sm">{config.name}</div>
            <div className="text-xs text-gray-500 mt-1">{config.description}</div>
          </div>
        );
      })}
    </div>
  );
}

export default TemplateSelector;