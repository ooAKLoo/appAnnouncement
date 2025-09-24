import React from 'react';
import { useApp } from '../../context/AppContext';
import ConfigPanel from '../common/ConfigPanel';
import ColorSchemeSelector from '../common/ColorSchemeSelector';
import SmartColorPicker from '../common/SmartColorPicker';

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

  const handleSmartColorChange = (field, value) => {
    updateDesign({ [field]: value });
  };

  const handleSmartColorModeChange = (mode) => {
    updateDesign({ colorMode: mode });
  };

  return (
    <ConfigPanel type="design" isActive={isActive}>
      {/* 配色模式选择 */}
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-600 mb-4">配色方案</div>
        <div className="flex bg-gray-100 rounded-lg p-1">
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
      </div>

      {/* 快速配色方案 */}
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-600 mb-4">快速配色</div>
        <ColorSchemeSelector
          selectedScheme={state.design.colorScheme}
          colorMode={state.design.colorMode}
          onSelect={handleColorSchemeSelect}
        />
      </div>

      {/* 智能颜色选择器 */}
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-600 mb-4 flex items-center">
          <span>自定义颜色</span>
          <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">智能推荐</span>
        </div>
        <SmartColorPicker
          currentStyle={state.currentStyle}
          colorMode={state.design.colorMode}
          bgColor={state.design.bgColor}
          gradientColor={state.design.gradientColor}
          onColorChange={handleSmartColorChange}
          onColorModeChange={handleSmartColorModeChange}
        />
      </div>
    </ConfigPanel>
  );
}

export default DesignSection;