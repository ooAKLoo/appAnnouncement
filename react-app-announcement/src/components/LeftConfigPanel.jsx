import React from 'react';
import { X, LayoutTemplate } from 'lucide-react';
import { useApp } from '../context/AppContext';
import AppConfigSection from './config/AppConfigSection';
import DesignSection from './config/DesignSection';
import ProjectsSection from './config/ProjectsSection';
import ThemeSelector from './common/ThemeSelector';
import StyleSelector from './common/StyleSelector';
import TemplateLayoutSelector from './common/TemplateLayoutSelector';
import { themes } from '../data/templateConfig';

function LeftConfigPanel() {
  const { state, toggleConfigPanel, updateTheme, updateStyle, updateDesign, updateAppInfo } = useApp();

  if (!state.configPanelOpen) return null;

  return (
    <div className="fixed left-5 top-1/2 transform -translate-y-1/2 w-80 max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl border border-white/20 z-40 overflow-y-auto overflow-hidden">
      {state.currentTab === 'template' && (
        <div className="p-6">
          <div className="flex items-center justify-between text-xl font-medium text-gray-800 mb-6 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-blue/10 to-primary-blue/20 flex items-center justify-center">
                <LayoutTemplate size={20} className="text-primary-blue" />
              </div>
              <span className="tracking-tight">模板选择</span>
            </div>
            <button 
              className="w-8 h-8 bg-white/80 hover:bg-gray-100 rounded-full cursor-pointer flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-300 hover:shadow-md hover:scale-105" 
              onClick={toggleConfigPanel}
            >
              <X size={18} />
            </button>
          </div>
          <div className="space-y-6">
            <div>
              <div className="text-sm font-medium text-gray-600 mb-3">选择主题</div>
            <ThemeSelector 
              selectedTheme={state.currentTheme || 'launch'}
              onThemeChange={(theme) => updateTheme(theme)}
            />
          </div>
          
          <div>
            <div className="text-sm font-medium text-gray-600 mb-3">选择风格</div>
            <StyleSelector 
              selectedStyle={state.currentStyle || 'minimal'}
              onStyleChange={(style) => updateStyle(style)}
            />
          </div>
          
          <div>
            <div className="text-sm font-medium text-gray-600 mb-3">布局样式</div>
            <TemplateLayoutSelector 
              currentTheme={state.currentTheme || 'launch'}
              selectedTemplate={state.design.template}
              onTemplateSelect={(templateId) => {
                updateDesign({ template: templateId });
                
                const themeData = themes[state.currentTheme || 'launch'];
                if (themeData && themeData.defaultConfig) {
                  updateAppInfo({
                    title: themeData.defaultConfig.title,
                    subtitle: themeData.defaultConfig.subtitle
                  });
                }
              }}
            />
          </div>
          </div>
        </div>
      )}

      <AppConfigSection 
        isActive={state.currentTab === 'app'} 
      />
      
      <DesignSection 
        isActive={state.currentTab === 'design'} 
      />
      
      <ProjectsSection 
        isActive={state.currentTab === 'projects'} 
      />
    </div>
  );
}

export default LeftConfigPanel;