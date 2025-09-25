import React from 'react';
import { useApp } from '../../context/AppContext';
import ConfigPanel from '../common/ConfigPanel';
import ColorSchemeSelector from '../common/ColorSchemeSelector';
import SmartColorPicker from '../common/SmartColorPicker';

function DesignSection({ isActive }) {
  const { state, updateDesign, updateTypography } = useApp();

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

  const handleGradientAngleChange = (angle) => {
    updateDesign({ gradientAngle: `${angle}deg` });
  };

  const handleTypographyChange = (field, value) => {
    updateTypography({ [field]: value });
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

      {/* 渐变角度控制 */}
      {state.design.colorMode === 'gradient' && (
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-600 mb-4">渐变角度</div>
          <div className="space-y-3">
            <input
              type="range"
              min="0"
              max="360"
              step="15"
              value={parseInt(state.design.gradientAngle) || 135}
              onChange={(e) => handleGradientAngleChange(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>0°</span>
              <span className="font-medium">{state.design.gradientAngle}</span>
              <span>360°</span>
            </div>
            <div className="grid grid-cols-4 gap-2 mt-3">
              {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                <button
                  key={angle}
                  className={`px-3 py-2 text-xs rounded-lg transition-all ${
                    parseInt(state.design.gradientAngle) === angle
                      ? 'bg-primary-blue text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => handleGradientAngleChange(angle)}
                >
                  {angle}°
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 字体配置 */}
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-600 mb-4">字体配置</div>
        <div className="space-y-4">
          {/* 字体族选择 */}
          <div>
            <label className="text-xs text-gray-500 mb-2 block">字体族</label>
            <select
              value={state.typography.fontFamily}
              onChange={(e) => handleTypographyChange('fontFamily', e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary-blue focus:border-transparent"
            >
              <option value="Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif">
                Inter (简约)
              </option>
              <option value="Caveat, Nunito, Comic Sans MS, cursive, sans-serif">
                Caveat (手绘)
              </option>
              <option value="Poppins, Helvetica Neue, Arial, sans-serif">
                Poppins (活力)
              </option>
              <option value="Playfair Display, Georgia, Times New Roman, serif">
                Playfair Display (复古)
              </option>
            </select>
          </div>

          {/* 字重配置 */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-gray-500 mb-1 block">标题字重</label>
              <select
                value={state.typography.titleWeight}
                onChange={(e) => handleTypographyChange('titleWeight', parseInt(e.target.value))}
                className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-primary-blue"
              >
                <option value={400}>Regular</option>
                <option value={500}>Medium</option>
                <option value={600}>SemiBold</option>
                <option value={700}>Bold</option>
                <option value={800}>ExtraBold</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">副标题</label>
              <select
                value={state.typography.subtitleWeight}
                onChange={(e) => handleTypographyChange('subtitleWeight', parseInt(e.target.value))}
                className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-primary-blue"
              >
                <option value={300}>Light</option>
                <option value={400}>Regular</option>
                <option value={500}>Medium</option>
                <option value={600}>SemiBold</option>
                <option value={700}>Bold</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1 block">正文</label>
              <select
                value={state.typography.bodyWeight}
                onChange={(e) => handleTypographyChange('bodyWeight', parseInt(e.target.value))}
                className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs focus:ring-1 focus:ring-primary-blue"
              >
                <option value={300}>Light</option>
                <option value={400}>Regular</option>
                <option value={500}>Medium</option>
                <option value={600}>SemiBold</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </ConfigPanel>
  );
}

export default DesignSection;