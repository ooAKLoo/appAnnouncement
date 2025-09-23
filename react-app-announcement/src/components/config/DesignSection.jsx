import React from 'react';
import { useApp } from '../../context/AppContext';
import ConfigPanel from '../common/ConfigPanel';
import ColorSchemeSelector from '../common/ColorSchemeSelector';
import FormField from '../common/FormField';

function DesignSection({ isActive }) {
  const { state, updateDesign } = useApp();

  const handleColorSchemeSelect = (scheme) => {
    updateDesign({
      colorScheme: scheme.id,
      bgColor: scheme.bgColor,
      gradientColor: scheme.gradientColor
    });
  };

  const handleColorChange = (field, value) => {
    updateDesign({ [field]: value });
  };

  return (
    <ConfigPanel type="design" isActive={isActive}>
      <div className="config-group">
        <div className="config-group-label">配色方案</div>
        <ColorSchemeSelector
          selectedScheme={state.design.colorScheme}
          onSelect={handleColorSchemeSelect}
        />
      </div>

      <div className="config-group">
        <div className="config-group-label">自定义颜色</div>
        <FormField
          type="color"
          label="主色调"
          value={state.design.bgColor}
          onChange={(value) => handleColorChange('bgColor', value)}
          style={{marginBottom: '12px'}}
        />
        <FormField
          type="color"
          label="渐变色"
          value={state.design.gradientColor}
          onChange={(value) => handleColorChange('gradientColor', value)}
        />
      </div>
    </ConfigPanel>
  );
}

export default DesignSection;