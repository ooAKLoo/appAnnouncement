import React from 'react';
// 导入统一的模板组件
import { 
  ClassicTemplate, 
  CenterTemplate, 
  MinimalTemplate, 
  TopBottomTemplate, 
  DiagonalTemplate, 
  FeatureGridTemplate 
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
  minimal: (
    <div className="flex items-center gap-1.5 w-full h-full p-1">
      {/* 左侧手机 */}
      <div className="w-3 h-6 bg-gray-400 rounded-sm flex-shrink-0"></div>
      {/* 右侧文字内容 */}
      <div className="flex-1 space-y-1">
        <div className="w-full h-1 bg-gray-400 rounded"></div>
        <div className="w-3/4 h-0.5 bg-gray-300 rounded"></div>
        <div className="w-1/2 h-0.5 bg-blue-500 rounded"></div>
      </div>
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
  
  // 新增：特性展示布局
  featureGrid: (
    <div className="flex flex-col gap-0.5 w-full h-full p-1">
      {/* 顶部标题 */}
      <div className="w-2/3 h-0.5 bg-gray-400 rounded mx-auto mb-0.5"></div>
      {/* 特性图标横排 */}
      <div className="flex justify-around items-center py-0.5 mb-1">
        <div className="w-1 h-1 bg-blue-400 rounded-sm"></div>
        <div className="w-1 h-1 bg-green-400 rounded-sm"></div>
        <div className="w-1 h-1 bg-purple-400 rounded-sm"></div>
      </div>
      {/* 底部大尺寸产品图 */}
      <div className="w-4 h-4 bg-gray-400 rounded mx-auto mt-auto"></div>
    </div>
  )
};

// 统一的模板配置 - 包含组件引用和布局配置
export const TEMPLATES = {
  classic: {
    id: 'classic',
    name: '左文右图',
    description: '文字内容在左，手机演示在右',
    preview: TemplatePreview.classic,
    component: ClassicTemplate,
    layoutConfig: {
      container: 'min-h-screen max-w-6xl mx-auto px-5 flex items-center justify-center relative',
      wrapper: 'flex items-center justify-between z-10',
      leftContent: 'flex-1 max-w-lg text-white animate-fadeInLeft',
      phoneContainer: 'flex-1 max-w-md min-h-[600px] flex justify-center items-center relative',
      logo: 'flex items-center gap-4 mb-12',
      title: 'text-5xl font-bold leading-tight mb-6 animate-fadeInUp',
      subtitle: 'text-lg text-white/90 leading-relaxed mb-10 animate-fadeInUp',
      features: 'space-y-6 mb-10',
      event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 mb-10',
      buttons: 'flex flex-col sm:flex-row gap-4 animate-fadeInUp'
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
    layoutConfig: {
      container: 'min-h-screen max-w-4xl mx-auto px-5 flex flex-col items-center justify-center relative text-center',
      wrapper: 'flex flex-col items-center w-full',
      leftContent: 'max-w-2xl order-1 text-center',
      phoneContainer: 'min-h-[600px] order-2 w-full max-w-xl flex justify-center items-center relative',
      logo: 'flex items-center justify-center gap-4 mb-8',
      title: 'text-4xl md:text-5xl font-bold leading-tight mb-5',
      subtitle: 'text-lg opacity-85 mb-8',
      features: 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-8',
      event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 mb-8',
      buttons: 'flex flex-col sm:flex-row gap-4 justify-center'
    },
    supportsFeatures: true,
    supportsEvent: true,
    supportsDownloads: true
  },
  minimal: {
    id: 'minimal',
    name: '左图右文',
    description: '手机演示在左，文字内容在右',
    preview: TemplatePreview.minimal,
    component: MinimalTemplate,
    layoutConfig: {
      container: 'min-h-screen max-w-6xl mx-auto px-5 flex items-center justify-center relative',
      wrapper: 'flex flex-row-reverse items-center justify-between z-10',
      leftContent: 'flex-1 max-w-md text-white',
      phoneContainer: 'flex-1 max-w-md min-h-[600px] flex justify-center items-center relative',
      logo: 'flex items-center gap-4 mb-8',
      title: 'text-4xl font-bold leading-tight mb-6',
      subtitle: 'text-lg text-white/90 leading-relaxed mb-8',
      features: 'space-y-4 mb-6',
      event: 'bg-white/5 backdrop-blur-sm border border-white/20 rounded-xl p-6 mb-6',
      buttons: 'flex flex-col sm:flex-row gap-4'
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
    layoutConfig: {
      container: 'min-h-screen max-w-4xl mx-auto px-5 py-16 flex flex-col items-center justify-center relative',
      wrapper: 'flex flex-col items-center gap-16 w-full',
      phoneContainer: 'max-w-md min-h-[600px] flex justify-center items-center relative order-1',
      leftContent: 'w-full max-w-2xl order-2',
      features: 'mt-8 space-y-4',
      event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 mt-8',
      buttons: 'flex flex-col sm:flex-row gap-4 justify-center mt-8'
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
    layoutConfig: {
      container: 'min-h-screen max-w-7xl mx-auto px-8 flex items-center justify-center relative overflow-hidden',
      wrapper: 'relative w-full h-screen flex items-center',
      wrapperStyle: { width: '100%', height: '100vh', padding: '60px 0' },
      leftContentStyle: { 
        width: '50%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '80vh',
        paddingRight: '60px',
        zIndex: 20
      },
      phoneContainerStyle: {
        position: 'absolute',
        right: '0',
        bottom: '0',
        width: '50%',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        zIndex: 10
      },
      leftContent: 'flex flex-col justify-between h-full',
      phoneContainer: '',
      buttons: 'flex gap-4'
    },
    supportsFeatures: false,
    supportsEvent: false,
    supportsDownloads: true
  },
  featureGrid: {
    id: 'featureGrid',
    name: '特性展示',
    description: '顶部特性图标，底部产品大图',
    preview: TemplatePreview.featureGrid,
    component: FeatureGridTemplate,
    layoutConfig: {
      container: 'min-h-screen max-w-5xl mx-auto px-5 py-16 flex flex-col items-center justify-center relative',
      wrapper: 'flex flex-col items-center w-full',
      leftContent: 'w-full max-w-4xl text-center mb-16',
      phoneContainer: 'max-w-lg min-h-[600px] flex justify-center items-center relative',
      logo: 'flex items-center justify-center gap-4 mb-8',
      title: 'text-4xl font-bold leading-tight mb-8',
      subtitle: 'text-lg leading-relaxed mb-12',
      features: 'grid grid-cols-1 md:grid-cols-3 gap-8 mb-16',
      event: 'bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-8 mb-12',
      buttons: 'flex flex-col sm:flex-row gap-4 justify-center mb-16'
    },
    supportsFeatures: false,
    supportsEvent: false,
    supportsDownloads: true
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