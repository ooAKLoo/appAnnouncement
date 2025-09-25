import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Palette, Droplets, Type, Palette as PaletteIcon } from 'lucide-react';
import { generateSecondaryColor, colorSchemeTypes } from '../../data/styleConfig';

function DesignPanel({ isActive }) {
  const { state, updateDesign, updateTypography } = useApp();
  const [selectedSchemeType, setSelectedSchemeType] = useState('monochromatic');

  if (!isActive) return null;

  // 当方案类型改变时，自动更新辅色
  const handleSchemeChange = (schemeType) => {
    setSelectedSchemeType(schemeType);
    const newSecondaryColor = generateSecondaryColor(state.design.bgColor, schemeType);
    updateDesign({ gradientColor: newSecondaryColor });
  };

  // 预设颜色方案
  const colorPresets = [
    { name: '海洋蓝', bg: '#667eea', gradient: '#764ba2' },
    { name: '夕阳橙', bg: '#f093fb', gradient: '#f5576c' },
    { name: '森林绿', bg: '#4facfe', gradient: '#00f2fe' },
    { name: '薰衣草', bg: '#a8edea', gradient: '#fed6e3' },
    { name: '火焰红', bg: '#ffecd2', gradient: '#fcb69f' },
    { name: '极光紫', bg: '#667db6', gradient: '#0082c8' },
  ];

  // 字体预设
  const fontPresets = [
    { name: '现代简约', family: 'Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' },
    { name: '优雅衬线', family: 'Playfair Display, Georgia, Times New Roman, serif' },
    { name: '友好手写', family: 'Caveat, Nunito, Comic Sans MS, cursive, sans-serif' },
    { name: '活力无衬', family: 'Poppins, Helvetica Neue, Arial, sans-serif' },
  ];

  const handleColorPresetSelect = (preset) => {
    updateDesign({
      bgColor: preset.bg,
      gradientColor: preset.gradient,
      // 保持当前的颜色模式，不强制切换到渐变
    });
  };

  const handleFontPresetSelect = (preset) => {
    updateTypography({
      fontFamily: preset.family
    });
  };

  return (
    <div className="fixed left-4 top-20 bottom-4 w-80 bg-white rounded-xl shadow-xl border border-gray-200/50 flex flex-col overflow-hidden">
      {/* Panel Header */}
      <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
            <Palette size={20} className="text-purple-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">视觉设计</h2>
            <p className="text-sm text-gray-500">调整色彩、字体和视觉风格</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        
        {/* 配色方案 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Droplets size={16} className="text-gray-600" />
            <h3 className="font-medium text-gray-900">背景色</h3>
          </div>
          
          {/* 色彩模式切换 */}
          <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                state.design.colorMode === 'gradient'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => updateDesign({ colorMode: 'gradient' })}
            >
              渐变色
            </button>
            <button
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                state.design.colorMode === 'solid'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => updateDesign({ colorMode: 'solid' })}
            >
              纯色
            </button>
          </div>

          {/* 预设配色 */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {colorPresets.map((preset, index) => (
              <button
                key={index}
                className="group relative w-full h-12 rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-300 transition-all"
                onClick={() => handleColorPresetSelect(preset)}
              >
                <div 
                  className="w-full h-full"
                  style={{
                    background: state.design.colorMode === 'solid' 
                      ? preset.bg
                      : `linear-gradient(135deg, ${preset.bg} 0%, ${preset.gradient} 100%)`
                  }}
                ></div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"></div>
                <div className="absolute bottom-1 left-1 right-1 text-xs text-white font-medium opacity-0 group-hover:opacity-100 transition-all">
                  {preset.name}
                </div>
              </button>
            ))}
          </div>

          {/* 自定义颜色 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-16">主色</label>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="color"
                  value={state.design.bgColor}
                  onChange={(e) => updateDesign({ bgColor: e.target.value })}
                  className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={state.design.bgColor}
                  onChange={(e) => updateDesign({ bgColor: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent font-mono"
                />
              </div>
            </div>
            {state.design.colorMode === 'gradient' && (
              <>
                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700 w-16">辅色</label>
                  <div className="flex items-center gap-2 flex-1">
                    <input
                      type="color"
                      value={state.design.gradientColor}
                      onChange={(e) => updateDesign({ gradientColor: e.target.value })}
                      className="w-8 h-8 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={state.design.gradientColor}
                      onChange={(e) => updateDesign({ gradientColor: e.target.value })}
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 focus:border-transparent font-mono"
                    />
                  </div>
                </div>
                
                {/* 配色方案选择 */}
                <div className="mt-3">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">配色方案</label>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(colorSchemeTypes).map(([type, info]) => (
                      <button
                        key={type}
                        className={`px-3 py-1 text-xs rounded-full border transition-all ${
                          selectedSchemeType === type
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                        }`}
                        onClick={() => handleSchemeChange(type)}
                        title={info.description}
                      >
                        {info.name}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* 渐变角度 */}
          {state.design.colorMode === 'gradient' && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium text-gray-700">渐变角度</label>
                <span className="text-sm text-gray-500">{state.design.gradientAngle}</span>
              </div>
              <input
                type="range"
                min="0"
                max="360"
                step="15"
                value={parseInt(state.design.gradientAngle) || 135}
                onChange={(e) => updateDesign({ gradientAngle: `${e.target.value}deg` })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="grid grid-cols-4 gap-1 mt-3">
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                  <button
                    key={angle}
                    className={`px-2 py-1 text-xs rounded transition-all ${
                      parseInt(state.design.gradientAngle) === angle
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                    onClick={() => updateDesign({ gradientAngle: `${angle}deg` })}
                  >
                    {angle}°
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* 字体排版 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Type size={16} className="text-gray-600" />
            <h3 className="font-medium text-gray-900">字体排版</h3>
          </div>
          
          {/* 字体预设 */}
          <div className="space-y-2 mb-4">
            {fontPresets.map((preset, index) => (
              <button
                key={index}
                className={`w-full p-3 text-left border rounded-lg transition-all hover:border-blue-300 ${
                  state.typography.fontFamily === preset.family
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200'
                }`}
                onClick={() => handleFontPresetSelect(preset)}
              >
                <div className="font-medium text-gray-900 text-sm">{preset.name}</div>
                <div 
                  className="text-xs text-gray-500 mt-1"
                  style={{ fontFamily: preset.family }}
                >
                  The quick brown fox jumps
                </div>
              </button>
            ))}
          </div>

          {/* 字体颜色 */}
          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm font-medium text-gray-700">字体颜色</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={state.typography.textColor || '#333333'}
                onChange={(e) => updateTypography({ textColor: e.target.value })}
                className="w-6 h-6 rounded border border-gray-300 cursor-pointer"
              />
              <span className="text-xs text-gray-500 font-mono">
                {state.typography.textColor || '#333333'}
              </span>
            </div>
          </div>

          {/* 字重调节 */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-12">标题</label>
              <select
                value={state.typography.titleWeight}
                onChange={(e) => updateTypography({ titleWeight: parseInt(e.target.value) })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500"
              >
                <option value={400}>Regular</option>
                <option value={500}>Medium</option>
                <option value={600}>SemiBold</option>
                <option value={700}>Bold</option>
                <option value={800}>ExtraBold</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <label className="text-sm font-medium text-gray-700 w-12">副标题</label>
              <select
                value={state.typography.subtitleWeight}
                onChange={(e) => updateTypography({ subtitleWeight: parseInt(e.target.value) })}
                className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500"
              >
                <option value={300}>Light</option>
                <option value={400}>Regular</option>
                <option value={500}>Medium</option>
                <option value={600}>SemiBold</option>
              </select>
            </div>
          </div>
        </section>


      </div>
    </div>
  );
}

export default DesignPanel;