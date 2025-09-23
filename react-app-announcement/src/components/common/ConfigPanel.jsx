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
    <div className="p-5">
      <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 mb-4">
        <IconComponent size={18} className="text-primary-blue" />
        {config.title}
      </div>
      {children}
    </div>
  );
}

export default ConfigPanel;