import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getStyleFontClass } from '../data/styleConfig';

function StyleProvider({ children }) {
  const { state } = useApp();

  useEffect(() => {
    // 获取当前风格的字体配置
    const titleFont = getStyleFontClass(state.currentStyle, 'title');
    const subtitleFont = getStyleFontClass(state.currentStyle, 'subtitle');
    const bodyFont = getStyleFontClass(state.currentStyle, 'body');

    // 创建或更新 CSS 自定义属性
    const root = document.documentElement;
    
    // 设置字体族
    root.style.setProperty('--style-font-family', titleFont.fontFamily);
    
    // 设置不同元素的字重
    root.style.setProperty('--style-font-weight-title', titleFont.fontWeight);
    root.style.setProperty('--style-font-weight-subtitle', subtitleFont.fontWeight);
    root.style.setProperty('--style-font-weight-body', bodyFont.fontWeight);

    // 为界面元素添加对应的样式类
    const addStyleClass = (selector, fontConfig) => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(el => {
        el.style.fontFamily = fontConfig.fontFamily;
        el.style.fontWeight = fontConfig.fontWeight;
      });
    };

    // 只应用到主内容区域的元素
    setTimeout(() => { // 延迟执行，确保 DOM 已渲染
      // 只对主内容区域的标记元素应用字体样式
      addStyleClass('[data-style="title"]', titleFont);
      addStyleClass('[data-style="subtitle"]', subtitleFont);
      addStyleClass('[data-style="body"]', bodyFont);
      
      // 主内容区域的特定元素
      addStyleClass('.main-content-title', titleFont);
      addStyleClass('.main-content-subtitle', subtitleFont);
      addStyleClass('.main-content-text', bodyFont);
    }, 100);

  }, [state.currentStyle]);

  return <>{children}</>;
}

export default StyleProvider;