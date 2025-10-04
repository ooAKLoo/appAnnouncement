import { Tag, Download, Star, TrendingUp, Quote } from 'lucide-react';

/**
 * APP宣发场景组件库 - 只提供结构差异的组件
 * 样式由用户通过StylePanel自定义
 */

// 颜色主题系统
export const COLOR_THEMES = {
  primary: {
    name: '主色调',
    text: '#3b82f6',
    bg: '#eff6ff',
    border: '#dbeafe'
  },
  success: {
    name: '成功绿',
    text: '#10b981',
    bg: '#d1fae5',
    border: '#a7f3d0'
  },
  warning: {
    name: '警告橙',
    text: '#f59e0b',
    bg: '#fffbeb',
    border: '#fef3c7'
  },
  danger: {
    name: '危险红',
    text: '#ef4444',
    bg: '#fee2e2',
    border: '#fecaca'
  },
  purple: {
    name: '紫色',
    text: '#8b5cf6',
    bg: '#f5f3ff',
    border: '#ddd6fe'
  },
  indigo: {
    name: '靛蓝',
    text: '#6366f1',
    bg: '#eef2ff',
    border: '#c7d2fe'
  },
  yellow: {
    name: '黄色',
    text: '#eab308',
    bg: '#fef9c3',
    border: '#fde047'
  },
  emerald: {
    name: '翡翠绿',
    text: '#059669',
    bg: '#d1fae5',
    border: '#a7f3d0'
  }
};

// 尺寸系统
export const SIZES = {
  xs: {
    name: '超小',
    fontSize: '12px',
    padding: '4px 8px'
  },
  sm: {
    name: '小',
    fontSize: '14px',
    padding: '6px 12px'
  },
  md: {
    name: '中',
    fontSize: '16px',
    padding: '8px 16px'
  },
  lg: {
    name: '大',
    fontSize: '18px',
    padding: '10px 20px'
  },
  xl: {
    name: '超大',
    fontSize: '20px',
    padding: '12px 24px'
  }
};

// 圆角样式
export const BORDER_STYLES = {
  sharp: {
    name: '尖角',
    borderRadius: '4px'
  },
  rounded: {
    name: '圆角',
    borderRadius: '12px'
  },
  pill: {
    name: '胶囊',
    borderRadius: '999px'
  }
};

export const COMPONENT_TYPES = {
  // Label 标签 - 通用的文本标签组件
  label: {
    id: 'label',
    name: 'Label 标签',
    icon: Tag,
    description: '可自定义的文本标签，适用于各种场景',
    defaultContent: 'Label Text',
    defaultProps: {
      theme: 'primary',
      size: 'md',
      borderStyle: 'rounded',
      fontWeight: '600'
    }
  }
};

/**
 * 获取所有组件类型
 */
export function getAllComponentTypes() {
  return Object.values(COMPONENT_TYPES);
}

/**
 * 根据props生成组件样式
 */
export function generateComponentStyles(componentTypeId, props) {
  const theme = COLOR_THEMES[props.theme] || COLOR_THEMES.primary;
  const size = SIZES[props.size] || SIZES.md;
  const borderStyle = BORDER_STYLES[props.borderStyle] || BORDER_STYLES.rounded;

  return {
    fontSize: size.fontSize,
    fontWeight: props.fontWeight || '600',
    color: theme.text,
    backgroundColor: theme.bg,
    padding: size.padding,
    borderRadius: borderStyle.borderRadius,
    border: `1px solid ${theme.border}`,
    display: 'inline-block'
  };
}

/**
 * 生成组件（用于插入时）
 */
export function generateComponent(componentTypeId) {
  const type = COMPONENT_TYPES[componentTypeId];
  if (!type) return null;

  const props = { ...type.defaultProps };
  const styles = generateComponentStyles(componentTypeId, props);

  return {
    content: type.defaultContent,
    styles: styles,
    componentType: componentTypeId,
    props: props
  };
}
