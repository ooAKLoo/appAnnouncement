import React, { useState, useEffect, useRef } from 'react';
import { Lightbulb, Check, X } from 'lucide-react';
import { generateGradientColor, getGradientDirection } from '../../data/styleConfig';
import FormField from './FormField';

function SmartColorPicker({ 
  currentStyle, 
  colorMode, 
  bgColor, 
  gradientColor, 
  onColorChange, 
  onColorModeChange 
}) {
  const [showRecommendation, setShowRecommendation] = useState(false);
  const [recommendedColor, setRecommendedColor] = useState('');
  const [recommendationApplied, setRecommendationApplied] = useState(false);
  const [lastCalculatedColor, setLastCalculatedColor] = useState('');
  const debounceTimer = useRef(null);

  // 只在风格改变时立即重新计算
  useEffect(() => {
    if (colorMode === 'gradient' && bgColor && lastCalculatedColor === bgColor) {
      calculateRecommendation(bgColor);
    }
  }, [currentStyle]);

  const calculateRecommendation = (color) => {
    if (colorMode !== 'gradient' || !color) return;
    
    const { gradientColor: recommended } = generateGradientColor(color, currentStyle);
    setRecommendedColor(recommended);
    setLastCalculatedColor(color);
    
    // 检查当前渐变色是否与推荐色相同（或接近）
    const isRecommendationApplied = Math.abs(
      parseInt(gradientColor.slice(1), 16) - parseInt(recommended.slice(1), 16)
    ) < 1000; // 允许小幅差异
    
    setRecommendationApplied(isRecommendationApplied);
    setShowRecommendation(!isRecommendationApplied && gradientColor !== recommended);
  };

  const handleMainColorChange = (color) => {
    onColorChange('bgColor', color);
    
    // 清除之前的定时器
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // 隐藏当前的推荐（如果有）
    setShowRecommendation(false);
    
    if (colorMode === 'gradient') {
      // 延迟计算推荐，等待用户停止选择
      debounceTimer.current = setTimeout(() => {
        calculateRecommendation(color);
      }, 500); // 500ms 延迟
    }
  };

  // 组件卸载时清除定时器
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, []);

  const handleGradientColorChange = (color) => {
    onColorChange('gradientColor', color);
    
    // 清除定时器和隐藏推荐
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    setShowRecommendation(false);
    setRecommendationApplied(false);
  };

  const applyRecommendation = () => {
    onColorChange('gradientColor', recommendedColor);
    setShowRecommendation(false);
    setRecommendationApplied(true);
  };

  const dismissRecommendation = () => {
    setShowRecommendation(false);
  };

  const getStyleDescription = () => {
    const descriptions = {
      minimal: '简约风格建议使用单色调渐变，降低饱和度营造平和感',
      handdrawn: '手绘风格建议使用临近色渐变，营造柔和自然的感觉',
      vibrant: '活力撞色建议使用互补色渐变，形成强烈的视觉对比',
      retro: '复古风格建议使用分裂互补色，营造经典怀旧的氛围'
    };
    return descriptions[currentStyle] || '';
  };

  return (
    <div className="space-y-6">
      {/* Main Color Picker */}
      <div>
        <FormField
          type="color"
          label={colorMode === 'solid' ? '颜色' : '主色调'}
          value={bgColor}
          onChange={handleMainColorChange}
          className="mb-3"
        />
        
        {/* Style Description */}
        {colorMode === 'gradient' && (
          <div className="text-xs text-gray-500 mb-3 leading-relaxed">
            {getStyleDescription()}
          </div>
        )}
      </div>

      {/* Gradient Color Picker with Smart Recommendation */}
      {colorMode === 'gradient' && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-700">渐变色</span>
            {recommendationApplied && (
              <div className="flex items-center text-xs text-green-600">
                <Check size={12} className="mr-1" />
                已应用推荐
              </div>
            )}
          </div>
          
          {/* Smart Recommendation Banner */}
          {showRecommendation && (
            <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2 flex-1">
                  <Lightbulb size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-blue-800 mb-1">
                      智能推荐色彩
                    </div>
                    <div className="text-xs text-blue-600 mb-2">
                      基于{currentStyle === 'minimal' ? '简约' : 
                             currentStyle === 'handdrawn' ? '手绘' :
                             currentStyle === 'vibrant' ? '活力撞色' : '复古'}风格为您推荐的配色
                    </div>
                    <div className="flex items-center space-x-2">
                      <div 
                        className="w-6 h-6 rounded border border-gray-300"
                        style={{ backgroundColor: recommendedColor }}
                      />
                      <span className="text-xs text-gray-600">{recommendedColor}</span>
                    </div>
                  </div>
                </div>
                <div className="flex space-x-1 ml-2">
                  <button
                    onClick={applyRecommendation}
                    className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                    title="应用推荐"
                  >
                    <Check size={14} />
                  </button>
                  <button
                    onClick={dismissRecommendation}
                    className="p-1 text-gray-400 hover:bg-gray-100 rounded"
                    title="忽略推荐"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Gradient Color Input */}
          <FormField
            type="color"
            value={gradientColor}
            onChange={handleGradientColorChange}
          />
        </div>
      )}
    </div>
  );
}

export default SmartColorPicker;