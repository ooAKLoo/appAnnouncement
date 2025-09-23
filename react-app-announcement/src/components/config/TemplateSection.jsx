import React from 'react';
import { useApp } from '../../context/AppContext';
import ConfigPanel from '../common/ConfigPanel';
import TemplateSelector from '../common/TemplateSelector';

const availableTemplates = ['classic', 'center', 'minimal', 'elegant', 'light', 'premium'];

function TemplateSection({ isActive }) {
  const { state, updateDesign } = useApp();

  const handleTemplateSelect = (templateId) => {
    updateDesign({ template: templateId });
  };

  return (
    <ConfigPanel type="template" isActive={isActive}>
      <div className="config-group">
        <div className="config-group-label">布局样式</div>
        <TemplateSelector
          templates={availableTemplates}
          selectedTemplate={state.design.template}
          onSelect={handleTemplateSelect}
        />
      </div>
    </ConfigPanel>
  );
}

export default TemplateSection;