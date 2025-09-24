import React from 'react';
import { useApp } from '../../context/AppContext';
import ConfigPanel from '../common/ConfigPanel';
import TemplateSelector from '../common/TemplateSelector';
import { getTemplatesForTheme, themes } from '../../data/templateConfig.jsx';

function TemplateSection({ isActive }) {
  const { state, updateDesign, updateAppInfo } = useApp();
  
  // 获取当前主题
  const currentTheme = state.currentTheme || 'launch';
  const themeData = themes[currentTheme];
  
  // 获取适合当前主题的模板
  const availableTemplates = getTemplatesForTheme(currentTheme);
  const templateIds = availableTemplates.map(t => t.id);

  const handleTemplateSelect = (templateId) => {
    updateDesign({ template: templateId });
    
    // 如果选择了新主题的第一个模板，应用默认配置
    if (themeData && themeData.defaultConfig) {
      updateAppInfo({
        title: themeData.defaultConfig.title,
        subtitle: themeData.defaultConfig.subtitle
      });
    }
  };

  return (
    <ConfigPanel type="template" isActive={isActive}>
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-600 mb-4">
          {themeData ? `${themeData.name} - 布局样式` : '布局样式'}
        </div>
        
        {availableTemplates.length > 0 ? (
          <TemplateSelector
            templates={templateIds}
            selectedTemplate={state.design.template}
            onSelect={handleTemplateSelect}
          />
        ) : (
          <div className="text-sm text-gray-500 text-center py-8">
            暂无适合当前主题的模板
          </div>
        )}
        
      </div>
    </ConfigPanel>
  );
}

export default TemplateSection;