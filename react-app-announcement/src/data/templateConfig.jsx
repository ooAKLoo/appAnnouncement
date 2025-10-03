import React from 'react';
// 导入统一的模板组件
import {
  ClassicTemplate,
  CenterTemplate,
  TopBottomTemplate,
  DiagonalTemplate,
  ProductHuntCenterTemplate,
  ProductHuntTopTemplate
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