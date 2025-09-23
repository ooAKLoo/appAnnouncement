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
  
  if (!config || !isActive) return null;

  const IconComponent = config.icon;

  return (
    <div className="config-section active" data-section={type}>
      <div className="config-section-title">
        <IconComponent size={16} />
        {config.title}
      </div>
      {children}
    </div>
  );
}

export default ConfigPanel;