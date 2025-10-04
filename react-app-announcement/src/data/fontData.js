// 字体数据配置
export const FONT_LIST = [
  // 英文字体
  { id: '3disometric-black', name: '3disometric Black', file: '3disometric Black.ttf', category: 'english' },
  { id: '3disometric-bold', name: '3disometric Bold', file: '3disometric Bold.ttf', category: 'english' },
  { id: 'arandelle', name: 'Arandelle', file: 'Arandelle.otf', category: 'english' },
  { id: 'bosthonbrush', name: 'Bosthonbrush', file: 'Bosthonbrush.otf', category: 'english' },
  { id: 'classinfont', name: 'ClassInFont', file: 'ClassInFont.otf', category: 'english' },
  { id: 'donjose-raices', name: 'Donjose Raices', file: 'Donjose Raices.otf', category: 'english' },
  { id: 'ephesis', name: 'Ephesis', file: 'Ephesis Regular.ttf', category: 'english' },
  { id: 'high-summit', name: 'High Summit', file: 'High Summit.ttf', category: 'english' },
  { id: 'lack-line', name: 'Lack Line', file: 'Lack Line Regular.otf', category: 'english' },
  { id: 'poppins-extralight', name: 'Poppins ExtraLight', file: 'Poppins-ExtraLightItalic.otf', category: 'english' },
  { id: 'poppins-thin', name: 'Poppins Thin', file: 'Poppins-ThinItalic.otf', category: 'english' },
  { id: 'rubik', name: 'Rubik Seacamouflage', file: 'Rubik Seacamouflage Regular.ttf', category: 'english' },

  // SF 字体系列
  { id: 'sf-compact-black', name: 'SF Compact Black', file: 'SF-Compact-Display-Black.otf', category: 'sf' },
  { id: 'sf-compact-bold', name: 'SF Compact Bold', file: 'SF-Compact-Display-Bold.otf', category: 'sf' },
  { id: 'sf-compact-heavy', name: 'SF Compact Heavy', file: 'SF-Compact-Display-Heavy.otf', category: 'sf' },
  { id: 'sf-compact-light', name: 'SF Compact Light', file: 'SF-Compact-Display-Light.otf', category: 'sf' },
  { id: 'sf-compact-medium', name: 'SF Compact Medium', file: 'SF-Compact-Display-Medium.otf', category: 'sf' },
  { id: 'sf-compact-regular', name: 'SF Compact Regular', file: 'SF-Compact-Display-Regular.otf', category: 'sf' },
  { id: 'sf-compact-semibold', name: 'SF Compact Semibold', file: 'SF-Compact-Display-Semibold.otf', category: 'sf' },
  { id: 'sf-compact-thin', name: 'SF Compact Thin', file: 'SF-Compact-Display-Thin.otf', category: 'sf' },
  { id: 'sf-compact-ultralight', name: 'SF Compact Ultralight', file: 'SF-Compact-Display-Ultralight.otf', category: 'sf' },

  // 中文字体
  { id: 'aa-thick-black', name: 'Aa 厚底黑', file: 'Aa厚底黑.ttf', category: 'chinese' },
  { id: 'ngaan', name: '刻石录颜体', file: 'I.Ngaan 刻石录颜体.ttf', category: 'chinese' },
  { id: 'pencrane', name: '刻石录钢笔鹤体', file: 'I.PenCrane刻石录钢笔鹤体.ttf', category: 'chinese' },
  { id: 'jf-openhuninn', name: 'jf open 粉圆', file: 'jf open粉圆jf-openhuninn-1.0.ttf', category: 'chinese' },
  { id: 'leefont', name: 'Leefont 蒙黑体', file: 'Leefont蒙黑体.ttf', category: 'chinese' }
];

export const FONT_CATEGORIES = {
  english: { id: 'english', name: '英文字体', icon: 'A' },
  sf: { id: 'sf', name: 'SF 字体', icon: 'SF' },
  chinese: { id: 'chinese', name: '中文字体', icon: '中' }
};

// 获取字体分类
export const getFontsByCategory = (categoryId) => {
  return FONT_LIST.filter(font => font.category === categoryId);
};

// 根据 ID 获取字体
export const getFontById = (fontId) => {
  return FONT_LIST.find(font => font.id === fontId);
};

// 获取所有字体分类
export const getAllCategories = () => {
  return Object.values(FONT_CATEGORIES);
};

// 生成字体 CSS
export const generateFontFace = (font) => {
  const fontPath = `/fonts/${font.file}`;
  const format = font.file.endsWith('.otf') ? 'opentype' : 'truetype';

  return `
    @font-face {
      font-family: '${font.name}';
      src: url('${fontPath}') format('${format}');
      font-weight: normal;
      font-style: normal;
    }
  `;
};

// 加载字体到 CSS
export const loadFont = (font) => {
  const styleId = `font-${font.id}`;

  // 检查是否已加载
  if (document.getElementById(styleId)) {
    return;
  }

  const style = document.createElement('style');
  style.id = styleId;
  style.textContent = generateFontFace(font);
  document.head.appendChild(style);

  console.log('✅ 字体已加载:', font.name);
};
