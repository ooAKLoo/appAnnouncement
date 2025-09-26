import React from 'react';
import { useApp } from '../../context/AppContext';

const StyledText = ({ 
  variant = 'text', 
  children, 
  className = '', 
  element = 'span',
  template,
  ...props 
}) => {
  const { state } = useApp();
  
  // 获取基础样式
  const getStyles = () => {
    const baseStyle = {
      color: state.typography.textColor || '#ffffff',
      fontFamily: state.typography.fontFamily
    };
    
    switch(variant) {
      case 'app-name':
        return {
          ...baseStyle,
          fontWeight: state.typography.appNameWeight || 600
        };
      case 'title':
        return {
          ...baseStyle,
          fontWeight: state.typography.titleWeight || 700
        };
      case 'subtitle':
        return {
          ...baseStyle,
          fontWeight: state.typography.subtitleWeight || 400
        };
      case 'text':
      default:
        return baseStyle;
    }
  };

  // 获取对应的CSS类名
  const getClassName = () => {
    const baseClasses = {
      'app-name': '',
      'title': 'main-content-title',
      'subtitle': 'main-content-subtitle',
      'text': 'main-content-text'
    };
    
    // 根据模板调整尺寸类名
    const templateSizes = {
      'diagonal': {
        'title': 'text-5xl md:text-6xl font-black leading-tight',
        'subtitle': 'text-xl leading-relaxed opacity-90',
        'app-name': 'text-xl font-semibold'
      },
      'topBottom': {
        'title': 'text-3xl font-bold leading-tight',
        'subtitle': 'text-lg leading-relaxed',
        'app-name': 'text-2xl font-semibold'
      },
      'featureGrid': {
        'title': 'text-4xl font-bold leading-tight',
        'subtitle': 'text-lg leading-relaxed',
        'app-name': 'text-xl font-semibold'
      },
      'default': {
        'title': 'text-4xl font-bold leading-tight',
        'subtitle': 'text-lg leading-relaxed',
        'app-name': 'text-xl font-semibold'
      },
      'classic': {
        'title': 'text-4xl font-bold leading-tight',
        'subtitle': 'text-lg leading-relaxed',
        'app-name': 'text-xl font-semibold'
      },
      'center': {
        'title': 'text-4xl font-bold leading-tight',
        'subtitle': 'text-lg leading-relaxed',
        'app-name': 'text-xl font-semibold'
      },
      'minimal': {
        'title': 'text-4xl font-bold leading-tight',
        'subtitle': 'text-lg leading-relaxed',
        'app-name': 'text-xl font-semibold'
      }
    };

    const sizeClass = templateSizes[template] ? 
      templateSizes[template][variant] : 
      templateSizes['default'][variant];
    
    const baseClass = baseClasses[variant] || '';
    
    return `${baseClass} ${sizeClass || ''} ${className}`.trim();
  };

  // 动态创建元素
  const Element = element;
  
  return (
    <Element 
      className={getClassName()} 
      style={getStyles()}
      {...props}
    >
      {children}
    </Element>
  );
};

export default StyledText;