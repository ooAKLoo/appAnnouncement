import React from 'react';
import { getTemplateById } from '../../data/templateConfig.jsx';

function TemplateSelector({ templates, selectedTemplate, onSelect }) {
  return (
    <div className="space-y-3">
      {templates.map((templateId) => {
        const config = getTemplateById(templateId);
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