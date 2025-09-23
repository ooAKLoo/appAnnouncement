import React from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import TemplateSection from './config/TemplateSection';
import AppConfigSection from './config/AppConfigSection';
import DesignSection from './config/DesignSection';
import ProjectsSection from './config/ProjectsSection';

function LeftConfigPanel() {
  const { state, toggleConfigPanel } = useApp();

  return (
    <div className={`left-config-panel ${state.configPanelOpen ? 'open' : ''}`}>
      <button 
        className="config-panel-close-btn" 
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