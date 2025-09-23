import React from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TemplateSection from './config/TemplateSection';
import AppConfigSection from './config/AppConfigSection';
import DesignSection from './config/DesignSection';
import ProjectsSection from './config/ProjectsSection';

function LeftConfigPanel() {
  const { state, toggleConfigPanel } = useApp();

  if (!state.configPanelOpen) return null;

  return (
    <div className="fixed left-5 top-1/2 transform -translate-y-1/2 w-72 max-h-[calc(100vh-120px)] bg-white/95 backdrop-blur-xl rounded-xl shadow-xl border border-white/20 z-40 overflow-y-auto">
      <button 
        className="absolute top-3 right-3 w-7 h-7 bg-white/90 hover:bg-white rounded-md cursor-pointer flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:shadow-sm z-50" 
        onClick={toggleConfigPanel}
      >
        <X size={16} />
      </button>

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