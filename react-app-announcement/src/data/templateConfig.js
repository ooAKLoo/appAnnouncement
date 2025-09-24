// 主题定义 - 决定显示什么内容
export const themes = {
  launch: {
    id: 'launch',
    name: '应用发布',
    icon: 'Rocket',
    description: 'APP首发、上线宣传',
    contentTypes: ['basic', 'downloads'], // 基本信息 + 下载按钮
    defaultConfig: {
      title: 'Postory全新上线',
      subtitle: '创造你的故事，分享你的精彩，开启全新的创作体验'
    }
  },
  feature: {
    id: 'feature',
    name: '功能介绍',
    icon: 'Sparkles',
    description: '新功能上线、版本更新',
    contentTypes: ['basic', 'features', 'downloads'], // 基本信息 + 功能列表 + 下载按钮
    defaultConfig: {
      title: 'Postory功能升级',
      subtitle: '全新创作工具，让你的故事更加生动精彩'
    }
  },
  beta: {
    id: 'beta',
    name: '内测邀请',
    icon: 'PartyPopper',
    description: '内测邀请、Beta测试',
    contentTypes: ['basic', 'event', 'downloads'], // 基本信息 + 活动信息 + 下载按钮
    defaultConfig: {
      title: 'Postory内测邀请',
      subtitle: '限量邀请，抢先体验最新功能！'
    }
  }
};

// 模板定义 - 决定内容如何布局
export const templates = {
  classic: {
    id: 'classic',
    name: '经典布局',
    preview: '左右对称，经典大气',
    suitableThemes: ['launch', 'feature', 'beta'], // 适合所有主题
    layout: 'horizontal' // 水平布局
  },
  center: {
    id: 'center',
    name: '居中布局',
    preview: '内容居中，简洁明了',
    suitableThemes: ['launch', 'feature', 'beta'], // 适合所有主题
    layout: 'vertical' // 垂直布局
  },
  minimal: {
    id: 'minimal',
    name: '极简布局',
    preview: '去除冗余，突出重点',
    suitableThemes: ['launch', 'feature'], // 更适合发布和功能介绍
    layout: 'horizontal'
  },
  hero: {
    id: 'hero',
    name: '大标题布局',
    preview: '突出标题，震撼视觉',
    suitableThemes: ['launch', 'beta'], // 更适合发布和内测邀请
    layout: 'vertical'
  },
  grid: {
    id: 'grid',
    name: '网格布局',
    preview: '网格排列，信息丰富',
    suitableThemes: ['feature'], // 专门适合功能介绍
    layout: 'grid'
  }
};

// 根据主题获取合适的模板
export function getTemplatesForTheme(themeId) {
  return Object.values(templates).filter(template => 
    template.suitableThemes.includes(themeId)
  );
}

// 获取主题的内容类型
export function getContentTypesForTheme(themeId) {
  const theme = themes[themeId];
  return theme ? theme.contentTypes : ['basic'];
}