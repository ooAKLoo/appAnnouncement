import React from 'react';
import { useApp } from '../../context/AppContext';

/**
 * 简化的文本组件 - 只提供基础样式，不预设特定类型
 * 所有自定义样式通过 Editable 组件的 elementStyles 应用
 */
const StyledText = ({
  children,
  className = '',
  element = 'span',
  ...props
}) => {
  const { state } = useApp();

  // 只提供全局的基础样式
  const baseStyle = {
    color: state.typography?.textColor || '#ffffff',
    fontFamily: state.typography?.fontFamily || 'inherit'
  };

  const Element = element;

  return (
    <Element
      className={className}
      style={baseStyle}
      {...props}
    >
      {children}
    </Element>
  );
};

export default StyledText;