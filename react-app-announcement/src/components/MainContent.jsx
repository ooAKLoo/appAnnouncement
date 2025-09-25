import React, { useEffect, useState, useCallback } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PhoneModel from './PhoneModel';
import PhoneModel2D from './PhoneModel2D';
import { getStyleById } from '../data/styleConfig';

function MainContent() {
  const { state, updateDesign, toggleToolbars } = useApp();
  
  // 相对调节状态
  const [baseSpacing] = useState(8); // 基础间距值
  const [relativeValue, setRelativeValue] = useState(0); // 相对调节值 (-50 到 +50)
  
  // 防抖更新
  const [debounceTimer, setDebounceTimer] = useState(null);
  
  const debouncedUpdateSpacing = useCallback((newSpacing) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    
    const timer = setTimeout(() => {
      updateDesign({ spacing: newSpacing });
    }, 100); // 100ms 防抖延迟
    
    setDebounceTimer(timer);
  }, [debounceTimer, updateDesign]);


  
  // 获取当前风格配置
  const currentStyle = getStyleById(state.currentStyle || 'minimal');

  // 根据间距值生成对应的gap类名
  const getGapClass = (spacing) => {
    const gapMap = {
      2: 'gap-2', 3: 'gap-3', 4: 'gap-4', 5: 'gap-5', 6: 'gap-6', 7: 'gap-7', 8: 'gap-8', 
      9: 'gap-9', 10: 'gap-10', 11: 'gap-11', 12: 'gap-12', 14: 'gap-14', 16: 'gap-16', 
      20: 'gap-20', 24: 'gap-24', 28: 'gap-28', 32: 'gap-32', 36: 'gap-36', 40: 'gap-40'
    };
    return gapMap[spacing] || 'gap-8';
  };

  // 根据模板类型决定布局方式
  const getLayoutClasses = () => {
    const template = state.design.template;
    const spacing = state.design.spacing || 8; // 默认间距为8
    const gapClass = getGapClass(spacing);
    
    // 使用Transform位移 - 突破Flex空间限制
    const getTransformStyles = () => {
      // 计算位移距离，基于间距值
      const baseTransform = (spacing - 8) * 8; // 每个间距单位移动8px
      
      return {
        wrapper: {
          width: '90%', // 固定宽度，不再动态调整
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        },
        leftContent: {
          transform: `translateX(${-baseTransform}px)`,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        },
        phoneContainer: {
          transform: `translateX(${baseTransform}px)`,
          transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }
      };
    };
    
    const transformStyles = getTransformStyles();
    
    switch (template) {
      case 'center':
        return {
          container: 'min-h-screen max-w-4xl mx-auto px-5 flex flex-col items-center justify-center relative text-center',
          wrapper: `flex flex-col items-center ${gapClass} w-full`,
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
          wrapper: 'flex flex-row-reverse items-center justify-between z-10',
          wrapperStyle: transformStyles.wrapper,
          leftContentStyle: transformStyles.leftContent,
          phoneContainerStyle: transformStyles.phoneContainer,
          leftContent: 'flex-1 max-w-md text-white',
          phoneContainer: 'flex-1 max-w-md min-h-[600px] flex justify-center items-center relative',
          logo: 'flex items-center gap-4 mb-8', // 显示logo
          title: 'text-4xl font-bold leading-tight mb-6',
          subtitle: 'text-lg text-white/90 leading-relaxed mb-8', // 显示副标题
          features: 'space-y-4 mb-6',
          event: 'bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-6',
          buttons: 'flex flex-col sm:flex-row gap-4'
        };
      
      case 'elegant':
        return {
          container: 'min-h-screen max-w-6xl mx-auto px-5 py-15 flex items-center justify-center relative',
          wrapper: 'flex items-center justify-between z-10',
          wrapperStyle: transformStyles.wrapper,
          leftContentStyle: transformStyles.leftContent,
          phoneContainerStyle: transformStyles.phoneContainer,
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
      
      case 'film':
        return {
          container: 'min-h-screen max-w-6xl mx-auto px-5 flex items-center justify-center relative',
          wrapper: 'border-4 border-dashed border-white/40 rounded-3xl p-12 flex items-center justify-between z-10 backdrop-blur-sm',
          wrapperStyle: transformStyles.wrapper,
          leftContentStyle: transformStyles.leftContent,
          phoneContainerStyle: transformStyles.phoneContainer,
          leftContent: 'flex-1 max-w-lg text-white',
          phoneContainer: 'flex-1 max-w-md min-h-[600px] flex justify-center items-center relative',
          logo: 'flex items-center gap-4 mb-10',
          title: 'text-4xl font-bold leading-tight mb-6',
          subtitle: 'text-lg text-white/90 leading-relaxed mb-10',
          features: 'space-y-6 mb-10',
          event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 mb-10',
          buttons: 'flex flex-col sm:flex-row gap-4'
        };
      
      case 'tag':
        return {
          container: 'min-h-screen max-w-6xl mx-auto px-5 flex items-center justify-center relative',
          wrapper: 'flex items-center justify-between z-10',
          wrapperStyle: transformStyles.wrapper,
          leftContentStyle: transformStyles.leftContent,
          phoneContainerStyle: transformStyles.phoneContainer,
          leftContent: 'flex-1 max-w-lg text-white relative',
          phoneContainer: 'flex-1 max-w-md min-h-[600px] flex justify-center items-center relative',
          logo: 'flex items-center gap-4 mb-10 relative',
          title: 'text-4xl font-bold leading-tight mb-6 relative',
          subtitle: 'text-lg text-white/90 leading-relaxed mb-10',
          features: 'space-y-6 mb-10',
          event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 mb-10 relative',
          buttons: 'flex flex-col sm:flex-row gap-4'
        };
      
      case 'diagonal':
        return {
          container: 'min-h-screen max-w-6xl mx-auto px-5 flex items-center justify-center relative overflow-hidden',
          wrapper: 'flex items-center justify-between z-10 relative',
          wrapperStyle: transformStyles.wrapper,
          leftContentStyle: transformStyles.leftContent,
          phoneContainerStyle: transformStyles.phoneContainer,
          leftContent: 'flex-1 max-w-lg text-white relative z-10',
          phoneContainer: 'flex-1 max-w-md min-h-[600px] flex justify-center items-center relative z-10',
          logo: 'flex items-center gap-4 mb-10',
          title: 'text-4xl font-bold leading-tight mb-6',
          subtitle: 'text-lg text-white/90 leading-relaxed mb-10',
          features: 'space-y-6 mb-10',
          event: 'bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-md border border-white/30 rounded-2xl p-8 mb-10 transform skew-y-1',
          buttons: 'flex flex-col sm:flex-row gap-4'
        };
      
      case 'overlay':
        return {
          container: 'min-h-screen max-w-6xl mx-auto px-5 flex items-center justify-center relative',
          wrapper: 'flex items-center justify-between z-10 relative',
          wrapperStyle: transformStyles.wrapper,
          leftContentStyle: transformStyles.leftContent,
          phoneContainerStyle: transformStyles.phoneContainer,
          leftContent: 'flex-1 max-w-lg text-white relative',
          phoneContainer: 'flex-1 max-w-md min-h-[600px] flex justify-center items-center relative',
          logo: 'flex items-center gap-4 mb-10',
          title: 'text-6xl font-black leading-none mb-8 absolute top-0 left-0 right-0 text-center text-white/20 pointer-events-none z-0',
          subtitle: 'text-lg text-white/90 leading-relaxed mb-10 relative z-10',
          features: 'space-y-6 mb-10 relative z-10',
          event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 mb-10 relative z-10',
          buttons: 'flex flex-col sm:flex-row gap-4 relative z-10'
        };
      
      case 'asymmetric':
        return {
          container: 'min-h-screen max-w-6xl mx-auto px-5 flex items-center justify-center relative',
          wrapper: 'flex items-start justify-between z-10',
          wrapperStyle: transformStyles.wrapper,
          leftContentStyle: transformStyles.leftContent,
          phoneContainerStyle: transformStyles.phoneContainer,
          leftContent: 'flex-1 max-w-lg text-white transform rotate-1',
          phoneContainer: 'flex-1 max-w-md min-h-[600px] flex justify-center items-center relative transform -rotate-3',
          logo: 'flex items-center gap-4 mb-10 transform -rotate-2',
          title: 'text-4xl font-bold leading-tight mb-6 transform rotate-1',
          subtitle: 'text-lg text-white/90 leading-relaxed mb-10',
          features: 'space-y-6 mb-10',
          event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 mb-10 transform rotate-2',
          buttons: 'flex flex-col sm:flex-row gap-4 transform -rotate-1'
        };
      
      case 'sticky':
        return {
          container: 'min-h-screen max-w-6xl mx-auto px-5 py-16 flex flex-col items-center justify-center relative',
          wrapper: 'w-full max-w-4xl',
          leftContent: 'grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 text-white',
          phoneContainer: 'max-w-md min-h-[600px] flex justify-center items-center relative mx-auto transform rotate-2',
          logo: 'bg-yellow-100/90 border-2 border-yellow-300 rounded-xl p-6 shadow-lg transform rotate-3 backdrop-blur-sm',
          title: 'bg-pink-100/90 border-2 border-pink-300 rounded-xl p-6 shadow-lg transform -rotate-2 text-gray-800 backdrop-blur-sm',
          subtitle: 'bg-blue-100/90 border-2 border-blue-300 rounded-xl p-6 shadow-lg transform rotate-1 text-gray-800 backdrop-blur-sm',
          features: 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-8',
          event: 'bg-green-100/90 border-2 border-green-300 rounded-xl p-8 shadow-lg transform -rotate-1 text-gray-800 backdrop-blur-sm mb-10',
          buttons: 'flex flex-col sm:flex-row gap-4 justify-center'
        };
      
      default: // classic
        return {
          container: 'min-h-screen max-w-6xl mx-auto px-5 flex items-center justify-center relative',
          wrapper: 'flex items-center justify-between z-10',
          wrapperStyle: transformStyles.wrapper,
          leftContentStyle: transformStyles.leftContent,
          phoneContainerStyle: transformStyles.phoneContainer,
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
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/20 flex items-center justify-center text-2xl font-bold">
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
        <div className="text-xl font-semibold main-content-subtitle">{state.appInfo.name}</div>
      </div>

      <h1 className={`${layout.title} main-content-title`}>{state.appInfo.title}</h1>

      <p className={`${layout.subtitle} main-content-subtitle`}>
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
              <h3 className={`${featureStyle.title} mb-2 text-white main-content-subtitle`}>{feature.title}</h3>
              <p className={`${featureStyle.description} leading-relaxed main-content-text`}>{feature.description}</p>
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
          <div className={`${eventStyle.title} mb-3 text-white main-content-title`}>{state.eventInfo.eventTitle}</div>
          <div className={`${eventStyle.description} mb-4 text-white/90 main-content-text`}>{state.eventInfo.eventDescription}</div>
          
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
          <span className="font-medium main-content-text">App Store</span>
        </div>
      )}
      {state.downloads.showGooglePlay && (
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-all duration-300 hover:transform hover:scale-105 hover:shadow-lg backdrop-blur-sm cursor-default">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
            <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
          </svg>
          <span className="font-medium main-content-text">Google Play</span>
        </div>
      )}
    </div>
  );

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
          {/* 基本信息 */}
          {renderBasicInfo()}
          
          {/* 功能列表 - 根据contentSections.features控制显示 */}
          {state.contentSections.features && renderFeatures()}
          
          {/* 活动信息 - 根据contentSections.event控制显示 */}
          {state.contentSections.event && renderEvent()}
          
          {/* 下载按钮 */}
          {renderDownloads()}
        </div>

        {/* Right Side Phone Model */}
        <div className={layout.phoneContainer} style={layout.phoneContainerStyle}>
          {state.modelType === '2d' ? <PhoneModel2D /> : <PhoneModel />}
        </div>
      </div>
    </div>
  );
}

export default MainContent;