import React from 'react';
import { LayoutTemplate, Smartphone, Palette, Folder, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

const panelConfigs = {
  template: {
    icon: LayoutTemplate,
    title: '模板选择'
  },
  app: {
    icon: Smartphone,
    title: 'APP配置'
  },
  design: {
    icon: Palette,
    title: '设计配置'
  },
  projects: {
    icon: Folder,
    title: '我的作品'
  }
};

function ConfigPanel({ type, isActive, children }) {
  const config = panelConfigs[type];
  const { toggleConfigPanel } = useApp();
  
  if (!isActive) return null;
  
  const IconComponent = config.icon;

  return (
    <>
      <div className="sticky top-0 bg-white px-6 pt-6 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between text-xl font-medium text-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-blue/10 to-primary-blue/20 flex items-center justify-center">
              <IconComponent size={20} className="text-primary-blue" />
            </div>
            <span className="tracking-tight">{config.title}</span>
          </div>
          <button 
            className="w-8 h-8 bg-white/80 hover:bg-gray-100 rounded-full cursor-pointer flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-300 hover:shadow-md hover:scale-105" 
            onClick={toggleConfigPanel}
          >
            <X size={18} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-6 mt-6">
          {children}
        </div>
      </div>
    </>
  );
}

export default ConfigPanel;