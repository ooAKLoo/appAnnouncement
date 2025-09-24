import React from 'react';
import TemplateSelector from './TemplateSelector';
import { getTemplatesForTheme, themes } from '../../data/templateConfig';

function TemplateLayoutSelector({ currentTheme, selectedTemplate, onTemplateSelect }) {
  const themeData = themes[currentTheme];
  const availableTemplates = getTemplatesForTheme(currentTheme);
  const templateIds = availableTemplates.map(t => t.id);

  if (availableTemplates.length === 0) {
    return (
      <div className="text-sm text-gray-500 text-center py-4">
        暂无适合当前主题的模板
      </div>
    );
  }

  return (
    <TemplateSelector
      templates={templateIds}
      selectedTemplate={selectedTemplate}
      onSelect={onTemplateSelect}
    />
  );
}

export default TemplateLayoutSelector;