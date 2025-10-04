import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Palette, Droplets, Type, X, Maximize2 } from 'lucide-react';
import { generateSecondaryColor, colorSchemeTypes } from '../../data/styleConfig';

function DesignPanel({ isActive }) {
  const { state, updateDesign, updateTypography, setCurrentPanel } = useApp();
  const [selectedSchemeType, setSelectedSchemeType] = useState('monochromatic');
  const [activeTab, setActiveTab] = useState('background');

  if (!isActive) return null;

  const handleSchemeChange = (schemeType) => {
    setSelectedSchemeType(schemeType);
    const newSecondaryColor = generateSecondaryColor(state.design.bgColor, schemeType);
    updateDesign({ gradientColor: newSecondaryColor });
  };

  const colorPresets = [
    { name: '海洋蓝', bg: '#667eea', gradient: '#764ba2' },
    { name: '粉紫渐', bg: '#f093fb', gradient: '#f5576c' },
    { name: '天空蓝', bg: '#4facfe', gradient: '#00f2fe' },
    { name: '薰衣草', bg: '#a8edea', gradient: '#fed6e3' },
    { name: '晨曦暖', bg: '#ffecd2', gradient: '#fcb69f' },
    { name: '活力橙', bg: '#F97316', gradient: '#f5576c' },
  ];

  const fontPresets = [
    { name: '现代简约', family: 'Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' },
    { name: '优雅衬线', family: 'Playfair Display, Georgia, Times New Roman, serif' },
    { name: '友好手写', family: 'Caveat, Nunito, Comic Sans MS, cursive, sans-serif' },
  ];

  const sizePresets = [
    { name: '正方形', width: 1080, height: 1080, ratio: '1:1' },
    { name: '横向宽屏', width: 1920, height: 1080, ratio: '16:9' },
    { name: '横向标准', width: 1600, height: 1200, ratio: '4:3' },
    { name: '竖向视频', width: 1080, height: 1920, ratio: '9:16' },
    { name: '竖向标准', width: 1200, height: 1600, ratio: '3:4' },
    { name: '超宽屏', width: 2560, height: 1080, ratio: '21:9' },
  ];

  return (
    <div className="fixed left-4 top-20 bottom-4 w-80 bg-white rounded-xl shadow-xl border border-gray-200/50 flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <Palette size={16} className="text-blue-600" />
          <h2 className="text-sm font-semibold text-gray-900">设计</h2>
        </div>
        <button
          onClick={() => setCurrentPanel(null)}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
        >
          <X size={16} className="text-gray-500" />
        </button>
      </div>

      {/* Tabs - Figma Style */}
      <div className="flex border-b border-gray-100 bg-gray-50/50">
        {[
          { id: 'background', label: '背景', icon: Droplets },
          { id: 'typography', label: '字体', icon: Type },
          { id: 'size', label: '尺寸', icon: Maximize2 }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs font-medium transition-colors relative ${
              activeTab === tab.id
                ? 'text-blue-600 bg-white'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <tab.icon size={13} />
            {tab.label}
            {activeTab === tab.id && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600" />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">

        {/* Background Tab */}
        {activeTab === 'background' && (
          <div className="p-4 space-y-4">
            {/* Color Mode Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button
                className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
                  state.design.colorMode === 'gradient'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500'
                }`}
                onClick={() => updateDesign({ colorMode: 'gradient' })}
              >
                渐变
              </button>
              <button
                className={`flex-1 py-1.5 px-3 rounded-md text-xs font-medium transition-all ${
                  state.design.colorMode === 'solid'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500'
                }`}
                onClick={() => updateDesign({ colorMode: 'solid' })}
              >
                纯色
              </button>
            </div>

            {/* Color Presets - Compact Grid */}
            <div className="grid grid-cols-6 gap-2">
              {colorPresets.map((preset, index) => (
                <button
                  key={index}
                  className="group relative w-full aspect-square rounded-lg overflow-hidden border-2 border-transparent hover:border-gray-300 transition-all hover:scale-110"
                  onClick={() => updateDesign({ bgColor: preset.bg, gradientColor: preset.gradient })}
                  title={preset.name}
                >
                  <div
                    className="w-full h-full"
                    style={{
                      background: state.design.colorMode === 'solid'
                        ? preset.bg
                        : `linear-gradient(135deg, ${preset.bg}, ${preset.gradient})`
                    }}
                  />
                </button>
              ))}
            </div>

            {/* Custom Colors - Compact */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-10">主色</span>
                <input
                  type="color"
                  value={state.design.bgColor}
                  onChange={(e) => updateDesign({ bgColor: e.target.value })}
                  className="w-7 h-7 rounded border border-gray-300 cursor-pointer"
                />
                <input
                  type="text"
                  value={state.design.bgColor}
                  onChange={(e) => updateDesign({ bgColor: e.target.value })}
                  className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs font-mono"
                />
              </div>

              {state.design.colorMode === 'gradient' && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600 w-10">辅色</span>
                    <input
                      type="color"
                      value={state.design.gradientColor}
                      onChange={(e) => updateDesign({ gradientColor: e.target.value })}
                      className="w-7 h-7 rounded border border-gray-300 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={state.design.gradientColor}
                      onChange={(e) => updateDesign({ gradientColor: e.target.value })}
                      className="flex-1 px-2 py-1 border border-gray-200 rounded text-xs font-mono"
                    />
                  </div>

                  {/* Gradient Angle - Compact */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-xs text-gray-600">角度</span>
                      <span className="text-xs font-mono text-gray-500">{state.design.gradientAngle}</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      step="15"
                      value={parseInt(state.design.gradientAngle) || 135}
                      onChange={(e) => updateDesign({ gradientAngle: `${e.target.value}deg` })}
                      className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="grid grid-cols-8 gap-1 mt-2">
                      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
                        <button
                          key={angle}
                          className={`px-1 py-0.5 text-xs rounded transition-all ${
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

                  {/* Color Scheme Types - Original Design */}
                  <div>
                    <label className="text-xs font-medium text-gray-700 mb-2 block">配色方案</label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(colorSchemeTypes).map(([type, info]) => (
                        <button
                          key={type}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
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
          </div>
        )}

        {/* Typography Tab */}
        {activeTab === 'typography' && (
          <div className="p-4 space-y-3">
            {/* Font Presets - Compact */}
            {fontPresets.map((preset, index) => (
              <button
                key={index}
                className={`w-full p-2.5 text-left border rounded-lg transition-all ${
                  state.typography.fontFamily === preset.family
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => updateTypography({ fontFamily: preset.family })}
              >
                <div className="text-xs font-semibold text-gray-900 mb-1">{preset.name}</div>
                <div
                  className="text-xs text-gray-500"
                  style={{ fontFamily: preset.family }}
                >
                  The quick brown fox
                </div>
              </button>
            ))}

            {/* Text Color - Compact */}
            <div className="flex items-center gap-2 pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-600">字体颜色</span>
              <input
                type="color"
                value={state.typography.textColor || '#333333'}
                onChange={(e) => updateTypography({ textColor: e.target.value })}
                className="w-7 h-7 rounded border border-gray-300 cursor-pointer"
              />
              <span className="text-xs text-gray-500 font-mono">
                {state.typography.textColor || '#333333'}
              </span>
            </div>
          </div>
        )}

        {/* Size Tab */}
        {activeTab === 'size' && (
          <div className="p-4 space-y-3">
            {/* Info */}
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800">
                选择尺寸后将在画布中心显示导出框预览
              </p>
            </div>

            {/* Size Presets - Compact 2-column Grid */}
            <div className="grid grid-cols-2 gap-2">
              {sizePresets.map((preset, index) => {
                const aspectRatio = preset.width / preset.height;
                const isSelected = state.design.exportWidth === preset.width && state.design.exportHeight === preset.height;

                return (
                  <button
                    key={index}
                    className={`p-2 text-left border rounded-lg transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => updateDesign({
                      exportWidth: preset.width,
                      exportHeight: preset.height,
                      exportX: null,
                      exportY: null,
                      exportScale: 1
                    })}
                  >
                    {/* Preview Shape */}
                    <div className="flex items-center justify-center h-10 bg-gray-50 rounded mb-1.5">
                      <div
                        className={`rounded ${
                          isSelected ? 'bg-blue-400' : 'bg-gray-300'
                        }`}
                        style={{
                          width: aspectRatio >= 1 ? `${Math.min(32, aspectRatio * 20)}px` : '20px',
                          height: aspectRatio < 1 ? `${Math.min(32, (1/aspectRatio) * 20)}px` : '20px'
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div className="text-xs font-semibold text-gray-900 mb-0.5">{preset.name}</div>
                    <div className="flex items-center gap-1">
                      <span className={`text-xs px-1 py-0.5 rounded font-mono ${
                        isSelected ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {preset.ratio}
                      </span>
                    </div>
                    <div className="text-xs text-gray-400 font-mono mt-0.5">{preset.width}×{preset.height}</div>
                  </button>
                );
              })}
            </div>

            {/* Custom Size - Compact */}
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <span className="text-xs font-medium text-gray-700 block">自定义尺寸</span>
              <div className="flex gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-500 block mb-1">宽</label>
                  <input
                    type="number"
                    value={state.design.exportWidth || ''}
                    onChange={(e) => updateDesign({ exportWidth: parseInt(e.target.value) || null })}
                    placeholder="1920"
                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-500 block mb-1">高</label>
                  <input
                    type="number"
                    value={state.design.exportHeight || ''}
                    onChange={(e) => updateDesign({ exportHeight: parseInt(e.target.value) || null })}
                    placeholder="1080"
                    className="w-full px-2 py-1.5 border border-gray-200 rounded text-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default DesignPanel;
