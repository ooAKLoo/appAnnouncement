import React, { useEffect, useState, useCallback } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PhoneModel from './PhoneModel';
import PhoneModel2D from './PhoneModel2D';
import { getStyleById } from '../data/styleConfig';
import { getTemplateComponent, getTemplateConfig, templateSupports } from '../data/templateConfig';
import StyledText from './common/StyledText';

function MainContent() {
  const { state, updateDesign, toggleToolbars } = useApp();
  
  // 获取当前模板配置
  const currentTemplate = state.design.template || 'classic';
  const templateConfig = getTemplateConfig(currentTemplate);
  
  // 获取当前风格配置
  const currentStyle = getStyleById(state.currentStyle || 'minimal');



  // 直接从templateConfig获取布局配置
  const layout = templateConfig.layoutConfig;

  // 统一的模板渲染器
  const renderTemplate = () => {
    // 直接从配置获取组件
    const TemplateComponent = getTemplateComponent(currentTemplate);
    
    // 统一的模板props
    const templateProps = {
      appInfo: state.appInfo,
      features: state.features,
      contentSections: state.contentSections,
      alignment: state.design.alignment || 'left',
      layout: layout,
      template: currentTemplate  // 传递模板ID给StyledText使用
    };
    
    // 统一渲染所有模板
    return <TemplateComponent {...templateProps} />;
  };

  // 渲染功能列表
  const renderFeatures = () => {
    const featureStyle = currentStyle.featureCard;
    const isCenter = state.design.template === 'center';
    const featureCount = state.features.length;
    
    // 根据用户选择的样式渲染不同的布局
    if (state.featureStyle === 'markdown') {
      // Markdown风格：简洁的无序列表
      if (isCenter) {
        // 居中布局下的智能排版
        let gridClass = '';
        if (featureCount <= 3) {
          gridClass = 'grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2';
        } else if (featureCount === 4) {
          gridClass = 'grid grid-cols-2 gap-x-8 gap-y-4';
        } else {
          gridClass = 'grid grid-cols-3 gap-x-8 gap-y-4';
        }
        
        return (
          <div className={gridClass}>
            {state.features.map((feature, index) => {
              // 5个功能时，最后2个需要特殊处理
              const isLastTwo = featureCount === 5 && index >= 3;
              return (
                <div 
                  key={index} 
                  className={`
                    text-left
                    ${isLastTwo && index === 3 ? 'col-start-1 col-end-2' : ''}
                    ${isLastTwo && index === 4 ? 'col-start-3 col-end-4' : ''}
                  `}
                >
                  <StyledText variant="text" className="inline-flex items-start gap-2">
                    <span className="opacity-60 mt-0.5">•</span>
                    <span>{feature.title}</span>
                  </StyledText>
                </div>
              );
            })}
          </div>
        );
      } else {
        // 非居中布局保持原样
        return (
          <ul className="space-y-2">
            {state.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <StyledText variant="text" className="flex items-start gap-2">
                  <span className="opacity-60 mt-0.5">•</span>
                  <span>{feature.title}</span>
                </StyledText>
              </li>
            ))}
          </ul>
        );
      }
    } else {
      // 默认卡片样式：根据功能数量动态调整布局
      if (isCenter) {
        // 居中布局下，根据功能数量动态调整网格列数
        let dynamicGridClass = '';
        if (featureCount === 1) {
          dynamicGridClass = 'grid grid-cols-1 gap-6 mb-8';
        } else if (featureCount === 2) {
          dynamicGridClass = 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-8';
        } else if (featureCount === 3) {
          dynamicGridClass = 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-8';
        } else {
          // 4个或更多使用2列布局保持卡片宽度
          dynamicGridClass = 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-8';
        }
        
        return (
          <div className={dynamicGridClass}>
            {state.features.map((feature, index) => (
              <div 
                key={index} 
                className={`${featureStyle.background} backdrop-blur-sm ${featureStyle.border} ${featureStyle.padding} ${featureStyle.radius} hover:bg-white/15 transition-all duration-300 ${featureStyle.layout}`}
              >
                <div className={`${featureStyle.icon} flex-shrink-0`}>{feature.icon}</div>
                <div className={featureStyle.layout.includes('text-center') ? 'text-center' : ''}>
                  <StyledText variant="subtitle" element="h3" className={`${featureStyle.title} mb-2`}>{feature.title}</StyledText>
                  {feature.description && (
                    <StyledText variant="text" element="p" className={`${featureStyle.description} leading-relaxed`}>{feature.description}</StyledText>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      } else {
        // 非居中布局使用原有配置
        return (
          <div className={layout.features}>
            {state.features.map((feature, index) => (
              <div 
                key={index} 
                className={`${featureStyle.background} backdrop-blur-sm ${featureStyle.border} ${featureStyle.padding} ${featureStyle.radius} hover:bg-white/15 transition-all duration-300 ${featureStyle.layout}`}
              >
                <div className={`${featureStyle.icon} flex-shrink-0`}>{feature.icon}</div>
                <div className={featureStyle.layout.includes('text-center') ? 'text-center' : ''}>
                  <StyledText variant="subtitle" element="h3" className={`${featureStyle.title} mb-2`}>{feature.title}</StyledText>
                  {feature.description && (
                    <StyledText variant="text" element="p" className={`${featureStyle.description} leading-relaxed`}>{feature.description}</StyledText>
                  )}
                </div>
              </div>
            ))}
          </div>
        );
      }
    }
  };

  // 渲染活动信息
  const renderEvent = () => {
    const eventStyle = currentStyle.eventCard;
    const alignment = state.design.alignment || 'left';
    const eventAlignment = {
      'left': 'text-left',
      'center': 'text-center',
      'right': 'text-right'
    }[alignment];
    
    return (
      <div className={`${eventStyle.background} backdrop-blur-md ${eventStyle.border} ${eventStyle.padding} ${eventStyle.radius}`}>
        <div className={eventAlignment}>
          <StyledText variant="title" className={`${eventStyle.title} mb-3`}>{state.eventInfo.eventTitle}</StyledText>
          <StyledText variant="text" className={`${eventStyle.description} mb-4`}>{state.eventInfo.eventDescription}</StyledText>
          
          {state.eventInfo.discount && (
            <div className={`${eventStyle.discount} mb-4`}>{state.eventInfo.discount} OFF</div>
          )}
          
          {state.eventInfo.endDate && (
            <StyledText variant="text" className="text-sm mb-4 opacity-70">截止日期：{state.eventInfo.endDate}</StyledText>
          )}
          
          {state.eventInfo.promoCode && (
            <div className={`inline-block bg-white/20 rounded-lg px-4 py-2 ${alignment === 'center' ? 'mx-auto' : alignment === 'right' ? 'ml-auto' : ''}`}>
              <StyledText variant="text" className="text-xs mb-1 opacity-70">优惠码</StyledText>
              <StyledText variant="text" className="text-lg font-mono font-bold">{state.eventInfo.promoCode}</StyledText>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 渲染下载按钮（装饰性展示）
  const renderDownloads = () => {
    // 获取对齐设置来调整按钮容器的对齐方式
    const alignment = state.design.alignment || 'left';
    const buttonAlignment = {
      'left': 'justify-start',
      'center': 'justify-center',
      'right': 'justify-end'
    }[alignment];

    return (
      <div className={`${layout.buttons} ${buttonAlignment}`}>
        {state.downloads.showAppStore && (
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg backdrop-blur-sm cursor-default">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <StyledText variant="text" className="font-medium">App Store</StyledText>
          </div>
        )}
        {state.downloads.showGooglePlay && (
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg backdrop-blur-sm cursor-default">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            <StyledText variant="text" className="font-medium">Google Play</StyledText>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={layout.container}>
      {/* Eye Toggle Button */}
      <button 
        onClick={toggleToolbars}
        className="fixed top-5 right-5 z-50 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-105"
        title={state.toolbarsVisible ? '隐藏工具栏' : '显示工具栏'}
      >
        {state.toolbarsVisible ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>


      <div className={layout.wrapper} style={layout.wrapperStyle}>
        {/* Left Content */}
        <div className={layout.leftContent} style={layout.leftContentStyle}>
          {/* 统一模板渲染 */}
          {renderTemplate()}
          
          {/* 功能列表 - 根据模板配置和contentSections.features控制显示 */}
          {templateSupports(currentTemplate, 'features') && state.contentSections.features && (
            <div className="mb-8">
              {renderFeatures()}
            </div>
          )}
          
          {/* 活动信息 - 根据模板配置和contentSections.event控制显示 */}
          {templateSupports(currentTemplate, 'event') && state.contentSections.event && (
            <div className="mb-8">
              {renderEvent()}
            </div>
          )}
          
          {/* 下载按钮 - 根据模板配置控制显示 */}
          {templateSupports(currentTemplate, 'downloads') && renderDownloads()}
        </div>

        {/* 手机占位元素 - 保持布局平衡 */}
        {currentTemplate !== 'diagonal' && (
          <div 
            className={layout.phoneContainer}
            style={{
              pointerEvents: 'none',
              minWidth: currentTemplate === 'center' ? '400px' : '350px',
              minHeight: '600px',
              ...(layout.phoneContainerStyle || {})
            }}
          />
        )}

        {/* Right Side Phone Model */}
        <div 
          className="fixed inset-0 w-screen h-screen pointer-events-none"
          style={{
            zIndex: 1, // 确保在背景之上，但低于侧边面板
          }}
        >
          <div className="w-full h-full pointer-events-auto">
            {state.modelType === '2d' ? <PhoneModel2D /> : <PhoneModel />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainContent;