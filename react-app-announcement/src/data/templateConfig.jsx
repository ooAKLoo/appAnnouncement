import React from 'react';

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

// 模板定义 - 决定内容如何布局
export const templates = {
  classic: {
    id: 'classic',
    name: '左文右图',
    description: '文字内容在左，手机演示在右',
    preview: TemplatePreview.classic,
    layout: 'horizontal' // 水平布局
  },
  center: {
    id: 'center',
    name: '居中布局',
    description: '内容居中，简洁明了',
    preview: TemplatePreview.center,
    layout: 'vertical' // 垂直布局
  },
  minimal: {
    id: 'minimal',
    name: '左图右文',
    description: '手机演示在左，文字内容在右',
    preview: TemplatePreview.minimal,
    layout: 'horizontal'
  },
  topBottom: {
    id: 'topBottom',
    name: '上图下文',
    description: '手机在上，应用信息横排在下',
    preview: TemplatePreview.topBottom,
    layout: 'topBottom'
  },
  diagonal: {
    id: 'diagonal',
    name: '斜角展示',
    description: '产品斜角摆放，动感时尚',
    preview: TemplatePreview.diagonal,
    layout: 'diagonal'
  },
  featureGrid: {
    id: 'featureGrid',
    name: '特性展示',
    description: '顶部特性图标，底部产品大图',
    preview: TemplatePreview.featureGrid,
    layout: 'featureGrid'
  }
};

// 获取所有可用的模板
export function getAllTemplates() {
  return Object.values(templates);
}

// 根据模板ID获取模板配置
export function getTemplateById(templateId) {
  return templates[templateId] || templates.classic;
}