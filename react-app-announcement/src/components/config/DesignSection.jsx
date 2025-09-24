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
      gradientColor: scheme.gradientColor,
      colorMode: scheme.type
    });
  };

  const handleColorModeToggle = (mode) => {
    updateDesign({ colorMode: mode });
  };

  const handleColorChange = (field, value) => {
    updateDesign({ [field]: value });
  };

  return (
    <ConfigPanel type="design" isActive={isActive}>
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-600 mb-4">配色方案</div>
        
        {/* Color mode toggle */}
        <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              state.design.colorMode === 'gradient'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleColorModeToggle('gradient')}
          >
            渐变色
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
              state.design.colorMode === 'solid'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => handleColorModeToggle('solid')}
          >
            纯色
          </button>
        </div>

        <ColorSchemeSelector
          selectedScheme={state.design.colorScheme}
          colorMode={state.design.colorMode}
          onSelect={handleColorSchemeSelect}
        />
      </div>

      <div className="mb-6">
        <div className="text-sm font-medium text-gray-600 mb-4">自定义颜色</div>
        <FormField
          type="color"
          label={state.design.colorMode === 'solid' ? '颜色' : '主色调'}
          value={state.design.bgColor}
          onChange={(value) => handleColorChange('bgColor', value)}
          className="mb-3"
        />
        {state.design.colorMode === 'gradient' && (
          <FormField
            type="color"
            label="渐变色"
            value={state.design.gradientColor}
            onChange={(value) => handleColorChange('gradientColor', value)}
          />
        )}
      </div>
    </ConfigPanel>
  );
}

export default DesignSection;