/**
 * 统一文本样式管理器
 * 负责管理所有文本样式的映射关系和配置
 */

// 模板特定的布局类名
export const templateLayoutClasses = {
  diagonal: {
    container: 'flex flex-col h-full justify-between',
    iconWrapper: 'flex items-end gap-3',
    titleWrapper: 'space-y-4',
    featureList: 'space-y-2 text-lg opacity-90 mt-6'
  },
  topBottom: {
    container: 'flex items-center gap-6 justify-center',
    iconWrapper: 'w-20 h-20 rounded-3xl overflow-hidden bg-white/20 flex items-center justify-center text-3xl font-bold flex-shrink-0',
    contentWrapper: 'flex-1 flex flex-col justify-center min-h-[80px]',
    appNameWrapper: 'flex items-end h-20'
  },
  featureGrid: {
    container: '',
    iconWrapper: 'flex items-center justify-center gap-4 mb-8',
    titleWrapper: ''
  }
};

// 文本变体到基础CSS类的映射
export const textVariantClasses = {
  'app-name': '',
  'title': 'main-content-title',
  'subtitle': 'main-content-subtitle', 
  'text': 'main-content-text'
};

// 模板特定的文本尺寸类
export const templateTextSizes = {
  diagonal: {
    'title': 'text-5xl md:text-6xl font-black leading-tight',
    'subtitle': 'text-xl leading-relaxed opacity-90',
    'app-name': 'text-xl'
  },
  topBottom: {
    'title': 'text-3xl leading-tight mb-2',
    'subtitle': 'text-lg leading-relaxed',
    'app-name': 'text-2xl'
  },
  featureGrid: {
    'title': 'text-4xl leading-tight mb-8',
    'subtitle': 'text-lg leading-relaxed mb-12',
    'app-name': 'text-xl'
  },
  default: {
    'title': 'text-4xl leading-tight',
    'subtitle': 'text-lg leading-relaxed',
    'app-name': 'text-xl'
  }
};

// 样式管理器主要方法
export const textStyleManager = {
  /**
   * 获取文本的完整类名
   * @param {string} variant - 文本变体 (app-name, title, subtitle, text)
   * @param {string} template - 模板名称 (diagonal, topBottom, featureGrid)
   * @param {string} customClass - 自定义类名
   * @returns {string} 完整的CSS类名字符串
   */
  getTextClass: (variant, template = 'default', customClass = '') => {
    const baseClass = textVariantClasses[variant] || '';
    const sizeClass = templateTextSizes[template]?.[variant] || templateTextSizes['default'][variant] || '';
    
    return `${baseClass} ${sizeClass} ${customClass}`.trim();
  },

  /**
   * 获取模板特定的布局类名
   * @param {string} template - 模板名称
   * @param {string} element - 元素类型
   * @returns {string} 布局类名
   */
  getLayoutClass: (template, element) => {
    return templateLayoutClasses[template]?.[element] || '';
  },

  /**
   * 获取字体样式对象
   * @param {string} variant - 文本变体
   * @param {object} typography - 字体配置对象
   * @returns {object} 样式对象
   */
  getTextStyle: (variant, typography) => {
    const baseStyle = {
      color: typography.textColor || '#ffffff',
      fontFamily: typography.fontFamily
    };
    
    switch(variant) {
      case 'app-name':
        return {
          ...baseStyle,
          fontWeight: typography.appNameWeight || 600
        };
      case 'title':
        return {
          ...baseStyle,
          fontWeight: typography.titleWeight || 700
        };
      case 'subtitle':
        return {
          ...baseStyle,
          fontWeight: typography.subtitleWeight || 400
        };
      case 'text':
      default:
        return baseStyle;
    }
  }
};

export default textStyleManager;