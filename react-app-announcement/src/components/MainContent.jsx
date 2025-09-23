import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import PhoneModel from './PhoneModel';
import { getContentTypesForTheme } from '../data/templateConfig';
import { getStyleById } from '../data/styleConfig';

function MainContent() {
  const { state, hideImagePreview } = useApp();

  // 自动隐藏截图预览窗口（但保留iPhone上的显示）
  useEffect(() => {
    if (state.showImagePreview) {
      const timer = setTimeout(() => {
        hideImagePreview();
      }, 3000); // 3秒后自动隐藏预览窗口

      return () => clearTimeout(timer);
    }
  }, [state.showImagePreview, hideImagePreview]);

  // 获取当前主题需要的内容类型
  const contentTypes = getContentTypesForTheme(state.currentTheme || 'launch');
  
  // 获取当前风格配置
  const currentStyle = getStyleById(state.currentStyle || 'minimal');

  // 根据模板类型决定布局方式
  const getLayoutClasses = () => {
    const template = state.design.template;
    
    switch (template) {
      case 'center':
        return {
          container: 'min-h-screen max-w-4xl mx-auto px-5 flex flex-col items-center justify-center relative text-center',
          wrapper: 'flex flex-col items-center gap-12 w-full',
          leftContent: 'max-w-2xl order-1',
          phoneContainer: 'min-h-[600px] order-2 w-full max-w-xl flex justify-center items-center relative',
          logo: 'flex items-center justify-center gap-4 mb-8',
          title: 'text-4xl md:text-5xl font-bold leading-tight mb-5',
          subtitle: 'text-lg opacity-85 mb-8',
          features: 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-8',
          event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 mb-8',
          buttons: 'flex flex-col sm:flex-row gap-4 justify-center'
        };
      
      case 'minimal':
        return {
          container: 'min-h-screen max-w-6xl mx-auto px-5 flex items-center justify-center relative',
          wrapper: 'flex flex-row-reverse items-center justify-between w-full gap-15 z-10',
          leftContent: 'flex-1 max-w-md text-white',
          phoneContainer: 'flex-1 max-w-md min-h-[600px] flex justify-center items-center relative',
          logo: 'hidden', // 隐藏logo
          title: 'text-4xl font-bold leading-tight mb-6',
          subtitle: 'hidden', // 隐藏副标题
          features: 'space-y-4 mb-6',
          event: 'bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-6',
          buttons: 'flex flex-col sm:flex-row gap-4'
        };
      
      case 'elegant':
        return {
          container: 'min-h-screen max-w-6xl mx-auto px-5 py-15 flex items-center justify-center relative',
          wrapper: 'flex items-center justify-between w-full gap-20 z-10',
          leftContent: 'flex-1 max-w-lg text-white',
          phoneContainer: 'flex-1 max-w-md min-h-[600px] flex justify-center items-center relative',
          logo: 'flex items-center gap-4 mb-10',
          title: 'text-4xl font-bold leading-tight mb-6',
          subtitle: 'text-lg text-white/90 leading-relaxed mb-10',
          features: 'space-y-6 mb-10',
          event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 mb-10',
          buttons: 'flex flex-col sm:flex-row gap-4'
        };
      
      case 'hero':
        return {
          container: 'min-h-screen max-w-7xl mx-auto px-5 py-16 flex flex-col items-center justify-center relative text-center',
          wrapper: 'flex flex-col items-center w-full',
          leftContent: 'max-w-4xl mb-16',
          phoneContainer: 'max-w-md min-h-[600px] flex justify-center items-center relative',
          logo: 'flex items-center justify-center gap-6 mb-12',
          title: 'text-6xl font-bold leading-tight mb-8',
          subtitle: 'text-2xl text-white/90 leading-relaxed mb-12',
          features: 'grid grid-cols-1 md:grid-cols-3 gap-8 mb-16',
          event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-3xl p-12 mb-16',
          buttons: 'flex flex-col sm:flex-row gap-6 justify-center'
        };
      
      case 'grid':
        return {
          container: 'min-h-screen max-w-7xl mx-auto px-5 py-16 flex flex-col items-center justify-center relative',
          wrapper: 'w-full',
          leftContent: 'text-center mb-16',
          phoneContainer: 'max-w-md min-h-[600px] flex justify-center items-center relative mx-auto mb-16',
          logo: 'flex items-center justify-center gap-4 mb-8',
          title: 'text-5xl font-bold leading-tight mb-6',
          subtitle: 'text-xl text-white/90 leading-relaxed mb-12',
          features: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16',
          event: 'max-w-2xl mx-auto bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-10 mb-16',
          buttons: 'flex flex-col sm:flex-row gap-4 justify-center'
        };
      
      default: // classic
        return {
          container: 'min-h-screen max-w-6xl mx-auto px-5 flex items-center justify-center relative',
          wrapper: 'flex items-center justify-between w-full gap-15 z-10',
          leftContent: 'flex-1 max-w-lg text-white animate-fadeInLeft',
          phoneContainer: 'flex-1 max-w-md min-h-[600px] flex justify-center items-center relative',
          logo: 'flex items-center gap-4 mb-12',
          title: 'text-5xl font-bold leading-tight mb-6 animate-fadeInUp',
          subtitle: 'text-lg text-white/90 leading-relaxed mb-10 animate-fadeInUp',
          features: 'space-y-6 mb-10',
          event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 mb-10',
          buttons: 'flex flex-col sm:flex-row gap-4 animate-fadeInUp'
        };
    }
  };

  const layout = getLayoutClasses();

  // 渲染基本信息（logo + 标题 + 副标题）
  const renderBasicInfo = () => (
    <>
      <div className={layout.logo}>
        <div className="w-15 h-15 rounded-2xl overflow-hidden bg-white/20 flex items-center justify-center text-2xl font-bold">
          {state.appInfo.iconImage ? (
            <img 
              src={state.appInfo.iconImage} 
              alt="App Icon" 
              className="w-full h-full object-cover"
            />
          ) : (
            state.appInfo.icon
          )}
        </div>
        <div className="text-xl font-semibold">{state.appInfo.name}</div>
      </div>

      <h1 className={layout.title}>{state.appInfo.title}</h1>

      <p className={layout.subtitle}>
        {state.appInfo.subtitle}
      </p>
    </>
  );

  // 渲染功能列表
  const renderFeatures = () => {
    const featureStyle = currentStyle.featureCard;
    
    return (
      <div className={layout.features}>
        {state.features.map((feature, index) => (
          <div 
            key={index} 
            className={`${featureStyle.background} backdrop-blur-sm ${featureStyle.border} ${featureStyle.padding} ${featureStyle.radius} hover:bg-white/15 transition-all duration-300 ${featureStyle.layout}`}
          >
            <div className={`${featureStyle.icon} flex-shrink-0`}>{feature.icon}</div>
            <div className={featureStyle.layout.includes('text-center') ? 'text-center' : ''}>
              <h3 className={`${featureStyle.title} mb-2 text-white`}>{feature.title}</h3>
              <p className={`${featureStyle.description} leading-relaxed`}>{feature.description}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // 渲染活动信息
  const renderEvent = () => {
    const eventStyle = currentStyle.eventCard;
    
    return (
      <div className={`${eventStyle.background} backdrop-blur-md ${eventStyle.border} ${eventStyle.padding} ${eventStyle.radius}`}>
        <div className="text-center">
          <div className={`${eventStyle.title} mb-3 text-white`}>{state.eventInfo.eventTitle}</div>
          <div className={`${eventStyle.description} mb-4 text-white/90`}>{state.eventInfo.eventDescription}</div>
          
          {state.eventInfo.discount && (
            <div className={`${eventStyle.discount} mb-4`}>{state.eventInfo.discount} OFF</div>
          )}
          
          {state.eventInfo.endDate && (
            <div className="text-sm text-white/70 mb-4">截止日期：{state.eventInfo.endDate}</div>
          )}
          
          {state.eventInfo.promoCode && (
            <div className="inline-block bg-white/20 rounded-lg px-4 py-2">
              <div className="text-xs text-white/70 mb-1">优惠码</div>
              <div className="text-lg font-mono font-bold text-white">{state.eventInfo.promoCode}</div>
            </div>
          )}
        </div>
      </div>
    );
  };

  // 渲染下载按钮（装饰性展示）
  const renderDownloads = () => (
    <div className={layout.buttons}>
      {state.downloads.showAppStore && (
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg backdrop-blur-sm cursor-default">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
          </svg>
          <span className="font-medium">App Store</span>
        </div>
      )}
      {state.downloads.showGooglePlay && (
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg backdrop-blur-sm cursor-default">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
          </svg>
          <span className="font-medium">Google Play</span>
        </div>
      )}
    </div>
  );

  return (
    <div className={layout.container}>
      {/* Image Preview */}
      {state.showImagePreview && state.screenImage && (
        <div className="fixed top-20 right-5 z-30 bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 max-w-xs animate-fadeInRight" id="imagePreview">
          <img 
            id="previewImg" 
            src={state.screenImage} 
            alt="APP截图预览"
            className="w-full rounded-lg shadow-md"
          />
          <div className="text-center text-sm text-gray-600 mt-2">APP截图预览</div>
        </div>
      )}

      <div className={layout.wrapper}>
        {/* Left Content */}
        <div className={layout.leftContent}>
          {/* 基本信息 - 所有主题都有 */}
          {contentTypes.includes('basic') && renderBasicInfo()}
          
          {/* 功能列表 - 只有功能介绍主题有 */}
          {contentTypes.includes('features') && renderFeatures()}
          
          {/* 活动信息 - 只有运营活动主题有 */}
          {contentTypes.includes('event') && renderEvent()}
          
          {/* 下载按钮 - 所有主题都有 */}
          {contentTypes.includes('downloads') && renderDownloads()}
        </div>

        {/* Right Side 3D Phone Model */}
        <div className={layout.phoneContainer}>
          <PhoneModel />
        </div>
      </div>
    </div>
  );
}

export default MainContent;