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
// <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">

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
  }
};

// 风格配置：包含颜色生成策略和渐变方向
const styleColorConfigs = {
  minimal: {
    gradientStrategy: 'monochromatic', // 单色调，调整明度和饱和度
    gradientDirection: '135deg', // 右下角渐变
    colorAdjustment: { saturation: -20, lightness: 15 } // 降低饱和度，增加亮度
  }
};

// 配色方案类型
export const colorSchemeTypes = {
  monochromatic: { name: '单色调', description: '同色调不同深浅' },
  analogous: { name: '邻近色', description: '色相环相邻颜色' },
  complementary: { name: '撞色', description: '色相环对比色' },
  triadic: { name: '三角色', description: '色相环三等分' },
  split: { name: '分离补色', description: '补色的相邻色' }
};

// 根据配色方案生成辅色
export function generateSecondaryColor(baseColor, schemeType = 'monochromatic') {
  const [h, s, l] = hexToHsl(baseColor);
  
  switch (schemeType) {
    case 'monochromatic':
      // 单色调：调整亮度和饱和度
      return hslToHex(h, Math.max(10, s - 20), Math.min(90, l + 15));
    
    case 'analogous':
      // 邻近色：色相偏移30度
      return hslToHex((h + 30) % 360, s, l);
    
    case 'complementary':
      // 撞色：色相偏移180度
      return hslToHex((h + 180) % 360, s, l);
    
    case 'triadic':
      // 三角色：色相偏移120度
      return hslToHex((h + 120) % 360, s, l);
    
    case 'split':
      // 分离补色：色相偏移150度
      return hslToHex((h + 150) % 360, s, l);
    
    default:
      return hslToHex(h, Math.max(10, s - 20), Math.min(90, l + 15));
  }
}

// 根据风格生成渐变色（保持向后兼容）
export function generateGradientColor(baseColor, styleId) {
  const config = styleColorConfigs[styleId] || styleColorConfigs.minimal;
  const [h, s, l] = hexToHsl(baseColor);
  
  // 单色调：调整亮度和饱和度
  const gradientColor = hslToHex(
    h,
    Math.max(0, Math.min(100, s + config.colorAdjustment.saturation)),
    Math.max(0, Math.min(100, l + config.colorAdjustment.lightness))
  );
  
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

// 获取风格的完整配置（包括渐变角度和字体配置）
export function getStyleConfig(styleId) {
  const style = styles[styleId] || styles.minimal;
  const colorConfig = styleColorConfigs[styleId] || styleColorConfigs.minimal;
  
  return {
    ...style,
    gradientDirection: colorConfig.gradientDirection,
    titleWeight: parseInt(style.fontWeight.title),
    subtitleWeight: parseInt(style.fontWeight.subtitle),
    bodyWeight: parseInt(style.fontWeight.body)
  };
}