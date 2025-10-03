import React from 'react';
// 导入统一的模板组件
import {
  ClassicTemplate,
  CenterTemplate,
  ProductHuntCenterTemplate,
  ProductHuntTopTemplate,
  VoiceAITemplate,
  PalifyTemplate
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

  // Palify
  palify: (
    <div className="flex items-center justify-center gap-1 w-full h-full p-1">
      {/* 左设备 - 白色 */}
      <div className="w-6 h-10 bg-white/90 border border-gray-300 rounded-lg shadow"></div>
      {/* 右设备 - 黑色 */}
      <div className="w-6 h-10 bg-gray-900 border border-gray-700 rounded-lg shadow"></div>
    </div>
  ),

};


// 统一的模板配置 - 包含组件引用和布局配置
export const TEMPLATES = {
  classic: {
    id: 'classic',
    name: '水平布局',
    description: '内容与模型水平排列，适合展示详细信息',
    preview: TemplatePreview.classic,
    component: ClassicTemplate,
    deviceTypes: ['mobile', 'desktop'],
    layoutConfig: {
      features: 'space-y-8 mb-12',
      event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-10 mb-12'
    },
    // 模型状态配置
    modelState: {
      '2d': {
        scale: 1,
        rotation: { x: 0, y: 0, z: 0 },
        position: { x: 380, y: 41, z: 0 }
      },
      '3d': {
        rotation: { x: 0, y: -10, z: 0 },
        position: { x: 0.87, y: 0.09, z: 0.00 },
        cameraDistance: 3
      }
    },
    supportsFeatures: true,
    supportsEvent: true,
    supportsDownloads: true
  },
  center: {
    id: 'center',
    name: '垂直布局',
    description: '内容垂直堆叠，层次分明',
    preview: TemplatePreview.center,
    component: CenterTemplate,
    deviceTypes: ['mobile', 'desktop'],
    layoutConfig: {
      features: 'grid grid-cols-1 md:grid-cols-2 gap-8 mb-12',
      event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-10 mb-12'
    },
    // 模型状态配置
    modelState: {
      '2d': {
        scale: 1.136502953442501,
        rotation: { x: 0, y: 0, z: 0 },
        position: { x: 6, y: 440, z: 0 }
      },
      '3d': {
        rotation: { x: -11, y: -10, z: 40 },
        position: { x: 0.20, y: -0.64, z: 0.00 },
        cameraDistance: 2.13
      }
    },
    supportsFeatures: true,
    supportsEvent: true,
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