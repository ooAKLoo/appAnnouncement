import React from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TemplateSection from './config/TemplateSection';
import AppConfigSection from './config/AppConfigSection';
import DesignSection from './config/DesignSection';
import ProjectsSection from './config/ProjectsSection';
import ThemeSelector from './common/ThemeSelector';
import StyleSelector from './common/StyleSelector';

function LeftConfigPanel() {
  const { state, toggleConfigPanel, updateTheme, updateStyle } = useApp();

  if (!state.configPanelOpen) return null;

  return (
    <div className="fixed left-5 top-1/2 transform -translate-y-1/2 w-80 max-h-[calc(100vh-120px)] bg-white rounded-2xl shadow-2xl border border-white/20 z-40 overflow-y-auto overflow-hidden">
      <button 
        className="sticky top-4 right-4 w-8 h-8 bg-white/80 hover:bg-white/95 rounded-full cursor-pointer flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-300 hover:shadow-lg hover:scale-105 z-50 ml-auto" 
        onClick={toggleConfigPanel}
      >
        <X size={18} />
      </button>
      
      {state.currentTab === 'template' && (
        <div className="p-4 pb-0 space-y-6">
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
        </div>
      )}

      <TemplateSection 
        isActive={state.currentTab === 'template'} 
      />
      
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