import React from 'react';
import { LayoutTemplate, Smartphone, Palette, Folder } from 'lucide-react';

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
  
  if (!isActive) return null;
  
  const IconComponent = config.icon;

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 text-xl font-medium text-gray-800 mb-6 pb-3 border-b border-gray-100">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-blue/10 to-primary-blue/20 flex items-center justify-center">
          <IconComponent size={20} className="text-primary-blue" />
        </div>
        <span className="tracking-tight">{config.title}</span>
      </div>
      <div className="space-y-6">
        {children}
      </div>
    </div>
  );
}

export default ConfigPanel;