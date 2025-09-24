// 颜色处理工具函数
function hexToHsl(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToHex(h, s, l) {
  h = h / 360;
  s = s / 100;
  l = l / 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs((h * 6) % 2 - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;

  if (0 <= h && h < 1/6) {
    r = c; g = x; b = 0;
  } else if (1/6 <= h && h < 2/6) {
    r = x; g = c; b = 0;
  } else if (2/6 <= h && h < 3/6) {
    r = 0; g = c; b = x;
  } else if (3/6 <= h && h < 4/6) {
    r = 0; g = x; b = c;
  } else if (4/6 <= h && h < 5/6) {
    r = x; g = 0; b = c;
  } else if (5/6 <= h && h < 1) {
    r = c; g = 0; b = x;
  }

  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);

  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// 需要在 index.html 中引入的 Google Fonts
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Caveat:wght@400;500;700&family=Poppins:wght@400;500;600;700;800&family=Playfair+Display:wght@400;700&family=Nunito:wght@400;500;600;700&display=swap" rel="stylesheet">

// 风格定义 - 控制内容的视觉样式
export const styles = {
  minimal: {
    id: 'minimal',
    name: '简约',
    icon: 'Minus',
    description: '平面设计，简洁干净',
    // 字体配置
    fontFamily: 'Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
    fontWeight: {
      title: '600', // Semi-bold
      subtitle: '400', // Regular
      body: '400' // Regular
    },
    // 功能列表样式
    featureCard: {
      background: 'bg-white/5',
      border: 'border border-white/10',
      padding: 'p-4',
      radius: 'rounded-lg',
      icon: 'text-2xl',
      title: 'text-lg font-medium',
      description: 'text-sm text-white/80',
      layout: 'flex items-start gap-4'
    },
    // 活动信息样式
    eventCard: {
      background: 'bg-white/5',
      border: 'border border-white/20',
      padding: 'p-6',
      radius: 'rounded-xl',
      title: 'text-2xl font-bold',
      description: 'text-lg',
      discount: 'text-4xl font-bold text-yellow-400'
    }
  },
  handdrawn: {
    id: 'handdrawn',
    name: '手绘',
    icon: 'Pencil',
    description: '手绘风格，亲切自然',
    // 字体配置
    fontFamily: 'Caveat, Nunito, Comic Sans MS, cursive, sans-serif',
    fontWeight: {
      title: '700', // Bold for handwritten style
      subtitle: '500', // Medium
      body: '400' // Regular
    },
    // 功能列表样式
    featureCard: {
      background: 'bg-white/10',
      border: 'border-2 border-white/30 border-dashed',
      padding: 'p-6',
      radius: 'rounded-3xl',
      icon: 'text-3xl transform rotate-3',
      title: 'text-xl font-semibold transform -rotate-1',
      description: 'text-white/90 italic',
      layout: 'text-center space-y-3 transform rotate-1'
    },
    // 活动信息样式
    eventCard: {
      background: 'bg-white/12',
      border: 'border-3 border-white/40 border-dashed',
      padding: 'p-8',
      radius: 'rounded-3xl',
      title: 'text-3xl font-bold transform -rotate-2',
      description: 'text-xl italic',
      discount: 'text-5xl font-bold text-yellow-300 transform rotate-3'
    }
  },
  vibrant: {
    id: 'vibrant',
    name: '活力撞色',
    icon: 'Zap',
    description: '鲜艳对比，充满活力',
    // 字体配置
    fontFamily: 'Poppins, Helvetica Neue, Arial, sans-serif',
    fontWeight: {
      title: '800', // Extra Bold
      subtitle: '600', // Semi-bold
      body: '500' // Medium
    },
    // 功能列表样式
    featureCard: {
      background: 'bg-gradient-to-br from-pink-500/20 to-orange-500/20',
      border: 'border-2 border-gradient-to-r from-pink-400 to-orange-400 shadow-lg',
      padding: 'p-8',
      radius: 'rounded-2xl',
      icon: 'text-4xl text-yellow-300',
      title: 'text-2xl font-bold text-white',
      description: 'text-lg text-white/95 leading-relaxed',
      layout: 'text-center space-y-4'
    },
    // 活动信息样式
    eventCard: {
      background: 'bg-gradient-to-br from-purple-500/30 to-pink-500/30',
      border: 'border-3 border-gradient-to-r from-purple-400 to-pink-400 shadow-2xl',
      padding: 'p-12',
      radius: 'rounded-3xl',
      title: 'text-4xl font-bold text-white',
      description: 'text-2xl text-white',
      discount: 'text-6xl font-bold bg-gradient-to-r from-yellow-300 to-red-400 bg-clip-text text-transparent'
    }
  },
  retro: {
    id: 'retro',
    name: '复古',
    icon: 'Clock',
    description: '怀旧复古，经典韵味',
    // 字体配置
    fontFamily: 'Playfair Display, Georgia, Times New Roman, serif',
    fontWeight: {
      title: '700', // Bold
      subtitle: '400', // Regular
      body: '400' // Regular
    },
    // 功能列表样式
    featureCard: {
      background: 'bg-amber-900/20',
      border: 'border-2 border-amber-600/50',
      padding: 'p-6 pl-8',
      radius: 'rounded-lg',
      icon: 'text-3xl text-amber-300',
      title: 'text-xl font-semibold text-amber-100',
      description: 'text-amber-200/85 leading-relaxed',
      layout: 'flex items-start gap-6'
    },
    // 活动信息样式
    eventCard: {
      background: 'bg-gradient-to-br from-amber-900/30 to-orange-900/30',
      border: 'border-2 border-amber-600/60',
      padding: 'p-10',
      radius: 'rounded-xl',
      title: 'text-3xl font-bold tracking-wide text-amber-100',
      description: 'text-xl tracking-wide text-amber-200',
      discount: 'text-5xl font-bold text-amber-300 tracking-wider'
    }
  }
};

// 风格配置：包含颜色生成策略和渐变方向
const styleColorConfigs = {
  minimal: {
    gradientStrategy: 'monochromatic', // 单色调，调整明度和饱和度
    gradientDirection: '135deg', // 右下角渐变
    colorAdjustment: { saturation: -20, lightness: 15 } // 降低饱和度，增加亮度
  },
  handdrawn: {
    gradientStrategy: 'analogous', // 临近色
    gradientDirection: '90deg', // 水平渐变，模拟水彩流淌
    colorAdjustment: { hue: 30, saturation: -10, lightness: 10 } // 色相偏移30度，柔和处理
  },
  vibrant: {
    gradientStrategy: 'complementary', // 互补色
    gradientDirection: '45deg', // 右上角渐变，形成动感
    colorAdjustment: { saturation: 20, lightness: 0 } // 增强饱和度
  },
  retro: {
    gradientStrategy: 'split-complementary', // 分裂互补色
    gradientDirection: '180deg', // 垂直渐变
    colorAdjustment: { hue: -15, saturation: -15, lightness: -10 } // 偏向暖色，降低饱和度和亮度
  }
};

// 根据风格生成渐变色
export function generateGradientColor(baseColor, styleId) {
  const config = styleColorConfigs[styleId] || styleColorConfigs.minimal;
  const [h, s, l] = hexToHsl(baseColor);
  
  let gradientColor;
  
  switch (config.gradientStrategy) {
    case 'complementary':
      // 互补色：色相+180度
      gradientColor = hslToHex(
        (h + 180) % 360, 
        Math.max(0, Math.min(100, s + config.colorAdjustment.saturation)),
        Math.max(0, Math.min(100, l + config.colorAdjustment.lightness))
      );
      break;
      
    case 'analogous':
      // 临近色：色相+30度
      gradientColor = hslToHex(
        (h + config.colorAdjustment.hue) % 360,
        Math.max(0, Math.min(100, s + config.colorAdjustment.saturation)),
        Math.max(0, Math.min(100, l + config.colorAdjustment.lightness))
      );
      break;
      
    case 'split-complementary':
      // 分裂互补色：色相+150度
      gradientColor = hslToHex(
        (h + 150 + config.colorAdjustment.hue) % 360,
        Math.max(0, Math.min(100, s + config.colorAdjustment.saturation)),
        Math.max(0, Math.min(100, l + config.colorAdjustment.lightness))
      );
      break;
      
    case 'monochromatic':
    default:
      // 单色调：调整亮度和饱和度
      gradientColor = hslToHex(
        h,
        Math.max(0, Math.min(100, s + config.colorAdjustment.saturation)),
        Math.max(0, Math.min(100, l + config.colorAdjustment.lightness))
      );
      break;
  }
  
  return {
    gradientColor,
    direction: config.gradientDirection
  };
}

// 获取风格的渐变方向
export function getGradientDirection(styleId) {
  const config = styleColorConfigs[styleId] || styleColorConfigs.minimal;
  return config.gradientDirection;
}

// 获取所有风格
export function getAllStyles() {
  return Object.values(styles);
}

// 根据风格ID获取风格配置
export function getStyleById(styleId) {
  return styles[styleId] || styles.minimal;
}

// 获取风格的字体样式
export function getStyleFontStyles(styleId) {
  const style = styles[styleId] || styles.minimal;
  return {
    fontFamily: style.fontFamily,
    fontWeight: style.fontWeight
  };
}

// 生成基于风格的CSS类名
export function getStyleFontClass(styleId, element = 'body') {
  const style = styles[styleId] || styles.minimal;
  return {
    fontFamily: style.fontFamily,
    fontWeight: style.fontWeight[element] || style.fontWeight.body
  };
}