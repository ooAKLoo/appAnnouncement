import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Palette, Droplets, Type, Palette as PaletteIcon, X, Maximize2, ArrowLeftRight, ArrowUpDown } from 'lucide-react';
import { generateSecondaryColor, colorSchemeTypes } from '../../data/styleConfig';

function DesignPanel({ isActive }) {
  const { state, updateDesign, updateTypography, setCurrentPanel } = useApp();
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
    { name: '粉紫渐', bg: '#f093fb', gradient: '#f5576c' },
    { name: '天空蓝', bg: '#4facfe', gradient: '#00f2fe' },
    { name: '薰衣草', bg: '#a8edea', gradient: '#fed6e3' },
    { name: '晨曦暖', bg: '#ffecd2', gradient: '#fcb69f' },
    { name: '活力橙', bg: '#F97316', gradient: '#f5576c' },
  ];

  // 字体预设
  const fontPresets = [
    { name: '现代简约', family: 'Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif' },
    { name: '优雅衬线', family: 'Playfair Display, Georgia, Times New Roman, serif' },
    { name: '友好手写', family: 'Caveat, Nunito, Comic Sans MS, cursive, sans-serif' },
  ];

  // 尺寸预设
  const sizePresets = [
    { name: '正方形 1:1', width: 1080, height: 1080, ratio: '1:1', desc: '社交媒体通用' },
    { name: '横向 16:9', width: 1920, height: 1080, ratio: '16:9', desc: '视频/演示文稿' },
    { name: '横向 4:3', width: 1600, height: 1200, ratio: '4:3', desc: '经典横屏' },
    { name: '横向 21:9', width: 2560, height: 1080, ratio: '21:9', desc: '超宽屏显示' },
    { name: '竖向 9:16', width: 1080, height: 1920, ratio: '9:16', desc: '移动端视频' },
    { name: '竖向 3:4', width: 1200, height: 1600, ratio: '3:4', desc: '移动端竖屏' },
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

  const handleSizePresetSelect = (preset) => {
    // 更新导出框尺寸，并重置位置和缩放
    updateDesign({
      exportWidth: preset.width,
      exportHeight: preset.height,
      exportX: null,      // 重置为居中
      exportY: null,      // 重置为居中
      exportScale: 1      // 重置缩放
    });
  };

  return (
    <div className="fixed left-4 top-20 bottom-4 w-80 bg-white rounded-xl shadow-xl border border-gray-200/50 flex flex-col overflow-hidden z-50">
      {/* Panel Header */}
      <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <Palette size={20} className="text-purple-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">视觉设计</h2>
              <p className="text-sm text-gray-500">调整色彩、字体和视觉风格</p>
            </div>
          </div>
          <button
            onClick={() => setCurrentPanel(null)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
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
          <div className="flex items-center gap-3">
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
        </section>

        {/* 尺寸布局 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Maximize2 size={16} className="text-gray-600" />
            <h3 className="font-medium text-gray-900">尺寸布局</h3>
          </div>

          {/* 提示信息 */}
          <div className="mb-4 p-3 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="text-amber-600 mt-0.5">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-xs text-amber-800 leading-relaxed">
                选择尺寸后将在画布中心显示导出框预览
              </p>
            </div>
          </div>

          {/* 尺寸预设 - 网格布局 */}
          <div className="grid grid-cols-2 gap-2">
            {sizePresets.map((preset, index) => {
              const aspectRatio = preset.width / preset.height;
              const isSelected = state.design.exportWidth === preset.width && state.design.exportHeight === preset.height;

              return (
                <button
                  key={index}
                  className={`p-2.5 text-left border rounded-lg transition-all hover:shadow-md hover:-translate-y-0.5 ${
                    isSelected
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 hover:border-blue-300 bg-white'
                  }`}
                  onClick={() => handleSizePresetSelect(preset)}
                >
                  {/* 形状预览 */}
                  <div className="flex items-center justify-center h-12 bg-gray-50 rounded mb-2">
                    <div
                      className={`rounded transition-all ${
                        isSelected
                          ? 'bg-gradient-to-br from-blue-400 to-indigo-500'
                          : 'bg-gradient-to-br from-gray-300 to-gray-400'
                      }`}
                      style={{
                        width: aspectRatio >= 1
                          ? `${Math.min(40, aspectRatio * 24)}px`
                          : '24px',
                        height: aspectRatio < 1
                          ? `${Math.min(40, (1/aspectRatio) * 24)}px`
                          : '24px'
                      }}
                    />
                  </div>

                  {/* 名称和比例 */}
                  <div className="mb-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-xs font-semibold ${isSelected ? 'text-blue-700' : 'text-gray-900'}`}>
                        {preset.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className={`text-xs font-mono px-1 py-0.5 rounded ${
                        isSelected ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {preset.ratio}
                      </span>
                    </div>
                  </div>

                  {/* 描述和尺寸 */}
                  <div className="text-xs text-gray-500 truncate">{preset.desc}</div>
                  <div className="text-xs text-gray-400 font-mono mt-0.5">{preset.width}×{preset.height}</div>
                </button>
              );
            })}
          </div>

          {/* 自定义尺寸 */}
          <div className="mt-4">
            <div className="text-sm font-medium text-gray-700 mb-3">自定义导出尺寸</div>
            <div className="space-y-3">
              {/* 宽度输入 */}
              <div className="relative">
                <label className="block text-xs text-gray-600 mb-2">宽度</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors">
                    <ArrowLeftRight size={16} />
                  </div>
                  <input
                    type="number"
                    value={state.design.exportWidth || 1920}
                    onChange={(e) => updateDesign({ exportWidth: parseInt(e.target.value) || 1920 })}
                    className="w-full pl-10 pr-12 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900
                             hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    min="320"
                    max="4096"
                    placeholder="1920"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                    px
                  </span>
                </div>
              </div>

              {/* 高度输入 */}
              <div className="relative">
                <label className="block text-xs text-gray-600 mb-2">高度</label>
                <div className="relative group">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-blue-500 transition-colors">
                    <ArrowUpDown size={16} />
                  </div>
                  <input
                    type="number"
                    value={state.design.exportHeight || 1080}
                    onChange={(e) => updateDesign({ exportHeight: parseInt(e.target.value) || 1080 })}
                    className="w-full pl-10 pr-12 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-900
                             hover:border-blue-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all outline-none"
                    min="320"
                    max="4096"
                    placeholder="1080"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">
                    px
                  </span>
                </div>
              </div>

              {/* 快捷尺寸调整按钮 */}
              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => {
                    const temp = state.design.exportWidth;
                    updateDesign({
                      exportWidth: state.design.exportHeight,
                      exportHeight: temp
                    });
                  }}
                  className="flex-1 px-3 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-medium rounded-lg transition-colors flex items-center justify-center gap-1"
                >
                  <ArrowLeftRight size={12} className="rotate-90" />
                  旋转尺寸
                </button>
                <button
                  onClick={() => updateDesign({
                    exportWidth: null,
                    exportHeight: null,
                    exportX: null,
                    exportY: null,
                    exportScale: 1
                  })}
                  className="flex-1 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg transition-colors"
                >
                  隐藏框
                </button>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

export default DesignPanel;