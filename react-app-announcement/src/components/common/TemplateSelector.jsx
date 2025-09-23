import React from 'react';

const templateConfigs = {
  classic: {
    name: '经典布局',
    description: '左文右图，适合突出产品特性',
    preview: (
      <>
        <div className="template-preview-left">
          <div className="template-preview-logo"></div>
          <div className="template-preview-title"></div>
          <div className="template-preview-desc"></div>
          <div className="template-preview-btns"></div>
        </div>
        <div className="template-preview-phone"></div>
      </>
    )
  },
  center: {
    name: '居中布局',
    description: '内容居中，简洁现代',
    preview: (
      <div className="template-preview-center">
        <div className="template-preview-logo"></div>
        <div className="template-preview-title"></div>
        <div className="template-preview-desc"></div>
        <div className="template-preview-btns"></div>
        <div className="template-preview-phone-small"></div>
      </div>
    )
  },
  minimal: {
    name: '极简布局',
    description: '突出产品，最小干扰',
    preview: (
      <>
        <div className="template-preview-minimal">
          <div className="template-preview-title"></div>
          <div className="template-preview-btns"></div>
        </div>
        <div className="template-preview-phone-large"></div>
      </>
    )
  },
  elegant: {
    name: '优雅布局',
    description: '精致设计，商务感强',
    preview: (
      <>
        <div className="template-preview-elegant">
          <div className="template-preview-logo-small"></div>
          <div className="template-preview-title-elegant"></div>
          <div className="template-preview-desc-elegant"></div>
          <div className="template-preview-btns-elegant"></div>
        </div>
        <div className="template-preview-phone-float"></div>
      </>
    )
  },
  light: {
    name: '轻盈布局',
    description: '卡片式设计，现代简约',
    preview: (
      <div className="template-preview-light">
        <div className="template-preview-title-light"></div>
        <div className="template-preview-desc-light"></div>
        <div className="template-preview-btns-light"></div>
        <div className="template-preview-cards"></div>
      </div>
    )
  },
  premium: {
    name: '高级布局',
    description: '奢华质感，突出品质',
    preview: (
      <>
        <div className="template-preview-premium">
          <div className="template-preview-badge"></div>
          <div className="template-preview-title-premium"></div>
          <div className="template-preview-features"></div>
          <div className="template-preview-btns-premium"></div>
        </div>
        <div className="template-preview-phone-premium"></div>
      </>
    )
  }
};

function TemplateSelector({ templates, selectedTemplate, onSelect }) {
  return (
    <div className="template-grid">
      {templates.map((templateId) => {
        const config = templateConfigs[templateId];
        if (!config) return null;
        
        return (
          <div 
            key={templateId}
            className={`template-item ${selectedTemplate === templateId ? 'active' : ''}`}
            data-template={templateId}
            onClick={() => onSelect(templateId)}
          >
            <div className="template-preview">
              {config.preview}
            </div>
            <div className="template-name">{config.name}</div>
            <div className="template-desc">{config.description}</div>
          </div>
        );
      })}
    </div>
  );
}

export default TemplateSelector;