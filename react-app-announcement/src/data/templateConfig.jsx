import React from 'react';
// 导入统一的模板组件
import {
  ClassicTemplate,
  CenterTemplate,
  TopBottomTemplate,
  DiagonalTemplate,
  ProductHuntCenterTemplate,
  ProductHuntTopTemplate,
  KlavisStrataTemplate,
  InfluencerMarketingTemplate,
  ScrumballTemplate,
  VoiceAITemplate,
  SpeakCreateLaunchTemplate,
  PalifyTemplate,
  ClipsTemplate
} from '../components/templates/Templates';

// 模板预览组件
const TemplatePreview = {
  classic: (
    <div className="flex items-center gap-1.5 w-full h-full p-1">
      {/* 左侧文字内容 */}
      <div className="flex-1 space-y-1">
        <div className="w-full h-1 bg-gray-400 rounded"></div>
        <div className="w-3/4 h-0.5 bg-gray-300 rounded"></div>
        <div className="w-1/2 h-0.5 bg-blue-500 rounded"></div>
      </div>
      {/* 右侧手机 */}
      <div className="w-3 h-6 bg-gray-400 rounded-sm flex-shrink-0"></div>
    </div>
  ),
  center: (
    <div className="flex flex-col items-center gap-1 w-full h-full p-1">
      {/* 居中文字内容 */}
      <div className="w-3/4 h-0.5 bg-gray-400 rounded"></div>
      <div className="w-full h-0.5 bg-gray-300 rounded"></div>
      <div className="w-1/2 h-0.5 bg-blue-500 rounded"></div>
      {/* 下方手机 */}
      <div className="w-2.5 h-4 bg-gray-400 rounded-sm mt-0.5"></div>
    </div>
  ),
  topBottom: (
    <div className="flex flex-col gap-1 w-full h-full p-1">
      {/* 上方手机 */}
      <div className="w-2.5 h-3.5 bg-gray-400 rounded-sm mx-auto"></div>
      {/* 下方水平信息条 */}
      <div className="flex items-end gap-1">
        {/* App Icon */}
        <div className="w-1.5 h-1.5 bg-gray-400 rounded flex-shrink-0"></div>
        {/* 中间标题区域 */}
        <div className="flex-1 space-y-0.5">
          <div className="w-full h-0.5 bg-gray-400 rounded"></div>
          <div className="w-2/3 h-0.5 bg-gray-300 rounded"></div>
        </div>
        {/* 右侧App名称 */}
        <div className="w-1 h-0.5 bg-blue-500 rounded"></div>
      </div>
    </div>
  ),
  
  // 新增：斜角产品展示
  diagonal: (
    <div className="relative w-full h-full p-1 overflow-hidden">
      {/* 左上文字区域 */}
      <div className="absolute top-0 left-0 w-2/3 space-y-0.5">
        <div className="w-full h-0.5 bg-gray-400 rounded"></div>
        <div className="w-3/4 h-0.5 bg-gray-300 rounded"></div>
        <div className="w-1/2 h-0.5 bg-gray-300 rounded"></div>
      </div>
      {/* 右下斜角手机 */}
      <div className="absolute bottom-0 right-0 w-3 h-5 bg-gray-400 rounded-sm transform rotate-12 origin-bottom-right"></div>
      {/* 下载按钮 */}
      <div className="absolute bottom-0 left-0 w-2 h-0.5 bg-blue-500 rounded"></div>
      {/* 背景斜角装饰 */}
      <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-blue-100/50 to-transparent transform skew-x-12 origin-top-right"></div>
    </div>
  ),

  // Product Hunt - 居中图标
  productHuntCenter: (
    <div className="flex flex-col items-center justify-center w-full h-full p-1 gap-1">
      {/* 顶部：现已推出 */}
      <div className="w-1/3 h-0.5 bg-gray-400 rounded"></div>
      {/* 名称 */}
      <div className="w-1/2 h-0.5 bg-gray-600 rounded"></div>
      {/* 中间大图标 */}
      <div className="w-5 h-5 bg-blue-500 rounded-md my-0.5"></div>
      {/* 底部按钮 */}
      <div className="w-2 h-0.5 bg-gray-500 rounded"></div>
    </div>
  ),

  // Product Hunt - 上图标
  productHuntTop: (
    <div className="flex flex-col items-center justify-center w-full h-full p-1 gap-0.5">
      {/* 上图标 */}
      <div className="w-4 h-4 bg-gradient-to-br from-pink-400 to-pink-500 rounded-lg mb-0.5"></div>
      {/* 标题 */}
      <div className="w-3/4 h-0.5 bg-gray-700 rounded"></div>
      {/* 名称 */}
      <div className="w-1/2 h-0.5 bg-gray-500 rounded"></div>
      {/* Slogan */}
      <div className="w-2/3 h-0.5 bg-gray-400 rounded"></div>
    </div>
  ),

  // Klavis AI - Strata
  klavisStrata: (
    <div className="relative w-full h-full p-1">
      {/* Logo */}
      <div className="absolute top-0 left-0 w-1/4 h-0.5 bg-gray-600 rounded"></div>
      {/* 标题文字 */}
      <div className="absolute top-2 left-1/4 w-1/2 h-0.5 bg-gray-500 rounded"></div>
      {/* 选项卡 */}
      <div className="absolute top-4 left-1/4 flex gap-0.5">
        <div className="w-2 h-1 bg-blue-500/30 rounded"></div>
        <div className="w-2 h-1 bg-blue-500 rounded"></div>
        <div className="w-2 h-1 bg-blue-500/30 rounded"></div>
      </div>
      {/* 代码块 */}
      <div className="absolute bottom-0 left-1/4 w-2/3 h-6 bg-gray-900 rounded border border-gray-600"></div>
    </div>
  ),

  // Influencer Marketing
  influencerMarketing: (
    <div className="grid grid-cols-3 gap-0.5 w-full h-full p-1">
      {/* 左列 */}
      <div className="space-y-0.5">
        <div className="w-full h-2 bg-blue-500/20 rounded"></div>
        <div className="w-full h-2 bg-blue-500/20 rounded"></div>
      </div>
      {/* 中列 */}
      <div className="space-y-0.5">
        <div className="w-full h-3 bg-gradient-to-br from-purple-500/30 to-pink-500/30 rounded"></div>
        <div className="w-full h-2 bg-blue-500/20 rounded"></div>
      </div>
      {/* 右列 */}
      <div className="space-y-0.5">
        <div className="w-full h-2 bg-blue-500/20 rounded"></div>
        <div className="w-full h-1.5 bg-blue-500/20 rounded"></div>
      </div>
    </div>
  ),

  // Scrumball
  scrumball: (
    <div className="relative w-full h-full p-1">
      {/* 标题 */}
      <div className="absolute top-0 left-1/4 w-1/2 h-0.5 bg-gray-600 rounded"></div>
      {/* 副标题 */}
      <div className="absolute top-1.5 left-1/3 w-1/3 h-0.5 bg-gray-400 rounded"></div>
      {/* 倾斜卡片 */}
      <div className="absolute bottom-1 left-0 w-5 h-3 bg-blue-500/20 rounded transform -rotate-6"></div>
      <div className="absolute bottom-0.5 left-1/3 w-5 h-3 bg-purple-500/20 rounded transform rotate-3"></div>
      <div className="absolute bottom-1 right-0 w-5 h-3 bg-pink-500/20 rounded transform -rotate-3"></div>
    </div>
  ),

  // Voice AI
  voiceAI: (
    <div className="flex flex-col items-center w-full h-full p-1 gap-0.5">
      {/* 标题 */}
      <div className="w-3/4 h-0.5 bg-gray-600 rounded"></div>
      {/* 副标题 */}
      <div className="w-1/2 h-0.5 bg-gray-400 rounded mb-0.5"></div>
      {/* 音频播放器 */}
      <div className="w-full h-4 bg-gray-900/50 rounded border border-gray-600 flex items-center justify-center gap-0.5">
        {/* 波形 */}
        {[...Array(10)].map((_, i) => (
          <div key={i} className="w-0.5 bg-pink-500 rounded" style={{ height: `${30 + Math.random() * 70}%` }}></div>
        ))}
      </div>
    </div>
  ),

  // Speak Create Launch
  speakCreateLaunch: (
    <div className="flex flex-col items-center w-full h-full p-1 gap-0.5">
      {/* 标题 */}
      <div className="w-3/4 h-0.5 bg-gray-600 rounded"></div>
      {/* 按钮 */}
      <div className="w-1/3 h-0.5 bg-pink-500 rounded mb-0.5"></div>
      {/* 双设备 */}
      <div className="flex gap-1 w-full">
        <div className="flex-1 h-4 bg-gray-900/50 rounded border border-gray-600"></div>
        <div className="flex-1 h-4 bg-gray-900/50 rounded border border-gray-600"></div>
      </div>
    </div>
  ),

  // Palify
  palify: (
    <div className="flex items-center justify-center gap-1 w-full h-full p-1">
      {/* 左设备 - 白色 */}
      <div className="w-6 h-10 bg-white/90 border border-gray-300 rounded-lg shadow"></div>
      {/* 右设备 - 黑色 */}
      <div className="w-6 h-10 bg-gray-900 border border-gray-700 rounded-lg shadow"></div>
    </div>
  ),

  // Clips
  clips: (
    <div className="flex flex-col items-center w-full h-full p-1 gap-0.5">
      {/* 标题 */}
      <div className="w-3/4 h-0.5 bg-gray-600 rounded mb-0.5"></div>
      {/* 三个手机 */}
      <div className="flex gap-0.5 justify-center">
        <div className="w-4 h-6 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded border border-white/30"></div>
        <div className="w-4 h-6 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded border border-white/30"></div>
        <div className="w-4 h-6 bg-gradient-to-br from-blue-500/20 to-green-500/20 rounded border border-white/30"></div>
      </div>
    </div>
  ),

};

// 统一的模板配置 - 包含组件引用和布局配置
export const TEMPLATES = {
  classic: {
    id: 'classic',
    name: '左文右图',
    description: '文字内容在左，手机演示在右',
    preview: TemplatePreview.classic,
    component: ClassicTemplate,
    deviceTypes: ['mobile', 'desktop'],
    layoutConfig: {
      features: 'space-y-8 mb-12',
      event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-10 mb-12'
    },
    supportsFeatures: true,
    supportsEvent: true,
    supportsDownloads: true
  },
  center: {
    id: 'center',
    name: '居中布局',
    description: '内容居中，简洁明了',
    preview: TemplatePreview.center,
    component: CenterTemplate,
    deviceTypes: ['mobile', 'desktop'],
    layoutConfig: {
      features: 'grid grid-cols-1 md:grid-cols-2 gap-8 mb-12',
      event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-10 mb-12'
    },
    supportsFeatures: true,
    supportsEvent: true,
    supportsDownloads: true
  },
  topBottom: {
    id: 'topBottom',
    name: '上图下文',
    description: '手机在上，应用信息横排在下',
    preview: TemplatePreview.topBottom,
    component: TopBottomTemplate,
    deviceTypes: ['mobile', 'desktop'],
    layoutConfig: {
      features: 'mt-8 space-y-4',
      event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 mt-8'
    },
    supportsFeatures: false,
    supportsEvent: false,
    supportsDownloads: true
  },
  diagonal: {
    id: 'diagonal',
    name: '斜角展示',
    description: '产品斜角摆放，动感时尚',
    preview: TemplatePreview.diagonal,
    component: DiagonalTemplate,
    deviceTypes: ['mobile', 'desktop'],
    layoutConfig: {
      features: 'space-y-6',
      event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8'
    },
    supportsFeatures: false,
    supportsEvent: false,
    supportsDownloads: true
  },
  productHuntCenter: {
    id: 'productHuntCenter',
    name: 'PH 居中',
    description: '深色主题，图标居中，下载按钮',
    preview: TemplatePreview.productHuntCenter,
    component: ProductHuntCenterTemplate,
    deviceTypes: ['product-hunt'],
    layoutConfig: {},
    supportsFeatures: false,
    supportsEvent: false,
    supportsDownloads: true
  },
  productHuntTop: {
    id: 'productHuntTop',
    name: 'PH 简约',
    description: '浅色主题，图标在上，标语展示',
    preview: TemplatePreview.productHuntTop,
    component: ProductHuntTopTemplate,
    deviceTypes: ['product-hunt'],
    layoutConfig: {},
    supportsFeatures: false,
    supportsEvent: false,
    supportsDownloads: false
  },
  klavisStrata: {
    id: 'klavisStrata',
    name: 'Strata 代码',
    description: 'Logo + 代码块展示，适合开发者工具',
    preview: TemplatePreview.klavisStrata,
    component: KlavisStrataTemplate,
    deviceTypes: ['product-hunt'],
    layoutConfig: {},
    supportsFeatures: false,
    supportsEvent: false,
    supportsDownloads: false
  },
  influencerMarketing: {
    id: 'influencerMarketing',
    name: 'Marketing 卡片',
    description: '网格卡片布局，数据展示',
    preview: TemplatePreview.influencerMarketing,
    component: InfluencerMarketingTemplate,
    deviceTypes: ['product-hunt'],
    layoutConfig: {},
    supportsFeatures: false,
    supportsEvent: false,
    supportsDownloads: false
  },
  scrumball: {
    id: 'scrumball',
    name: 'Scrumball',
    description: '倾斜卡片，动感展示团队成员',
    preview: TemplatePreview.scrumball,
    component: ScrumballTemplate,
    deviceTypes: ['product-hunt'],
    layoutConfig: {},
    supportsFeatures: false,
    supportsEvent: false,
    supportsDownloads: false
  },
  voiceAI: {
    id: 'voiceAI',
    name: 'Voice AI',
    description: '音频播放器界面，适合音频应用',
    preview: TemplatePreview.voiceAI,
    component: VoiceAITemplate,
    deviceTypes: ['product-hunt'],
    layoutConfig: {},
    supportsFeatures: false,
    supportsEvent: false,
    supportsDownloads: false
  },
  speakCreateLaunch: {
    id: 'speakCreateLaunch',
    name: 'Speak & Create',
    description: '双设备展示，内容创作应用',
    preview: TemplatePreview.speakCreateLaunch,
    component: SpeakCreateLaunchTemplate,
    deviceTypes: ['product-hunt'],
    layoutConfig: {},
    supportsFeatures: false,
    supportsEvent: false,
    supportsDownloads: false
  },
  palify: {
    id: 'palify',
    name: 'Palify',
    description: '设备对比，黑白主题展示',
    preview: TemplatePreview.palify,
    component: PalifyTemplate,
    deviceTypes: ['product-hunt'],
    layoutConfig: {},
    supportsFeatures: false,
    supportsEvent: false,
    supportsDownloads: false
  },
  clips: {
    id: 'clips',
    name: 'Clips',
    description: '多手机展示，适合视频剪辑应用',
    preview: TemplatePreview.clips,
    component: ClipsTemplate,
    deviceTypes: ['product-hunt'],
    layoutConfig: {},
    supportsFeatures: false,
    supportsEvent: false,
    supportsDownloads: false
  }
};

// 获取模板组件
export const getTemplateComponent = (templateId) => {
  const template = TEMPLATES[templateId] || TEMPLATES.classic;
  return template.component;
};

// 获取模板配置
export const getTemplateConfig = (templateId) => {
  return TEMPLATES[templateId] || TEMPLATES.classic;
};

// 获取所有可用的模板
export function getAllTemplates() {
  return Object.values(TEMPLATES);
}

// 检查模板是否支持某功能
export function templateSupports(templateId, feature) {
  const config = getTemplateConfig(templateId);
  
  switch(feature) {
    case 'features':
      return config.supportsFeatures;
    case 'event':
      return config.supportsEvent;
    case 'downloads':
      return config.supportsDownloads;
    default:
      return false;
  }
}