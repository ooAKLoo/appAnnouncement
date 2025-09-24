import React from 'react';

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

// 模板预览组件
const TemplatePreview = {
  classic: (
    <div className="flex items-center gap-2 w-full">
      <div className="flex-1 space-y-1">
        <div className="w-6 h-1.5 bg-gray-400 rounded"></div>
        <div className="w-8 h-1 bg-gray-300 rounded"></div>
        <div className="w-5 h-0.5 bg-primary-blue rounded"></div>
      </div>
      <div className="w-4 h-8 bg-gray-400 rounded"></div>
    </div>
  ),
  center: (
    <div className="flex flex-col items-center gap-1 w-full">
      <div className="w-6 h-1.5 bg-gray-400 rounded"></div>
      <div className="w-8 h-1 bg-gray-300 rounded"></div>
      <div className="w-5 h-0.5 bg-primary-blue rounded"></div>
      <div className="w-3 h-5 bg-gray-400 rounded mt-1"></div>
    </div>
  ),
  minimal: (
    <div className="flex flex-row-reverse items-center gap-2 w-full">
      <div className="w-5 h-8 bg-gray-400 rounded"></div>
      <div className="flex-1 space-y-1">
        <div className="w-8 h-1.5 bg-gray-400 rounded"></div>
        <div className="w-5 h-0.5 bg-primary-blue rounded"></div>
      </div>
    </div>
  ),
  hero: (
    <div className="flex flex-col items-center gap-1 w-full">
      <div className="w-8 h-2 bg-gray-400 rounded"></div>
      <div className="w-6 h-0.5 bg-gray-300 rounded"></div>
      <div className="w-4 h-4 bg-gray-400 rounded mt-1"></div>
    </div>
  ),
  grid: (
    <div className="flex flex-col gap-1 w-full">
      <div className="w-8 h-1.5 bg-gray-400 rounded mx-auto"></div>
      <div className="grid grid-cols-2 gap-1 mt-1">
        <div className="h-2 bg-white rounded border border-gray-200"></div>
        <div className="h-2 bg-white rounded border border-gray-200"></div>
      </div>
    </div>
  )
};

// 模板定义 - 决定内容如何布局
export const templates = {
  classic: {
    id: 'classic',
    name: '左文右图',
    description: '文字内容在左，手机演示在右',
    preview: TemplatePreview.classic,
    suitableThemes: ['launch', 'feature', 'beta'], // 适合所有主题
    layout: 'horizontal' // 水平布局
  },
  center: {
    id: 'center',
    name: '居中布局',
    description: '内容居中，简洁明了',
    preview: TemplatePreview.center,
    suitableThemes: ['launch', 'feature', 'beta'], // 适合所有主题
    layout: 'vertical' // 垂直布局
  },
  minimal: {
    id: 'minimal',
    name: '左图右文',
    description: '手机演示在左，文字内容在右',
    preview: TemplatePreview.minimal,
    suitableThemes: ['launch', 'feature'], // 更适合发布和功能介绍
    layout: 'horizontal'
  },
  hero: {
    id: 'hero',
    name: '大标题布局',
    description: '突出标题，震撼视觉',
    preview: TemplatePreview.hero,
    suitableThemes: ['launch', 'beta'], // 更适合发布和内测邀请
    layout: 'vertical'
  },
  grid: {
    id: 'grid',
    name: '网格布局',
    description: '网格排列，信息丰富',
    preview: TemplatePreview.grid,
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

// 根据模板ID获取模板配置
export function getTemplateById(templateId) {
  return templates[templateId] || templates.classic;
}