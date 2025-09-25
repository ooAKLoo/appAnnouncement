import React from 'react';

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
  ),
  film: (
    <div className="relative w-full h-full border-2 border-dashed border-gray-400 rounded">
      <div className="absolute top-1 left-1 right-1 bottom-1 border border-gray-300 rounded">
        <div className="flex items-center gap-1 p-1">
          <div className="w-5 h-6 bg-gray-400 rounded"></div>
          <div className="flex-1 space-y-0.5">
            <div className="w-6 h-1 bg-gray-400 rounded"></div>
            <div className="w-4 h-0.5 bg-primary-blue rounded"></div>
          </div>
        </div>
      </div>
    </div>
  ),
  tag: (
    <div className="relative w-full">
      <div className="flex items-center gap-2">
        <div className="flex-1 space-y-1">
          <div className="w-6 h-1.5 bg-gray-400 rounded"></div>
          <div className="relative inline-block">
            <div className="w-4 h-3 bg-yellow-400 rounded transform -rotate-3"></div>
            <div className="absolute top-0.5 left-0.5 w-2 h-0.5 bg-white rounded"></div>
          </div>
        </div>
        <div className="w-4 h-8 bg-gray-400 rounded"></div>
      </div>
    </div>
  ),
  diagonal: (
    <div className="relative w-full h-full overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/20 to-transparent transform skew-x-12"></div>
      <div className="relative flex items-center gap-2">
        <div className="flex-1 space-y-1">
          <div className="w-6 h-1.5 bg-gray-400 rounded"></div>
          <div className="w-5 h-0.5 bg-primary-blue rounded"></div>
        </div>
        <div className="w-4 h-8 bg-gray-400 rounded"></div>
      </div>
    </div>
  ),
  overlay: (
    <div className="relative w-full">
      <div className="w-8 h-6 bg-gray-300 rounded mx-auto mb-1"></div>
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2">
        <div className="w-6 h-2 bg-gray-800/80 rounded text-center">
          <div className="w-4 h-0.5 bg-white rounded mx-auto mt-0.5"></div>
        </div>
      </div>
      <div className="w-4 h-8 bg-gray-400 rounded mx-auto"></div>
    </div>
  ),
  asymmetric: (
    <div className="relative w-full">
      <div className="flex items-start gap-1">
        <div className="w-6 h-8 bg-gray-400 rounded transform rotate-6"></div>
        <div className="flex-1 space-y-1 mt-2">
          <div className="w-5 h-1 bg-gray-400 rounded transform -rotate-2"></div>
          <div className="w-7 h-1 bg-gray-300 rounded"></div>
          <div className="w-3 h-0.5 bg-primary-blue rounded transform rotate-1"></div>
        </div>
      </div>
    </div>
  ),
  sticky: (
    <div className="relative w-full">
      <div className="grid grid-cols-2 gap-1">
        <div className="relative">
          <div className="w-full h-4 bg-yellow-100 border border-yellow-300 rounded shadow-sm transform rotate-2">
            <div className="w-3 h-0.5 bg-gray-400 rounded mt-1 mx-auto"></div>
          </div>
        </div>
        <div className="relative">
          <div className="w-full h-4 bg-pink-100 border border-pink-300 rounded shadow-sm transform -rotate-1">
            <div className="w-2 h-6 bg-gray-400 rounded mx-auto mt-0.5"></div>
          </div>
        </div>
      </div>
      <div className="mt-1">
        <div className="w-full h-3 bg-blue-100 border border-blue-300 rounded shadow-sm transform rotate-1">
          <div className="w-4 h-0.5 bg-primary-blue rounded mt-1 mx-auto"></div>
        </div>
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
  hero: {
    id: 'hero',
    name: '大标题布局',
    description: '突出标题，震撼视觉',
    preview: TemplatePreview.hero,
    layout: 'vertical'
  },
  grid: {
    id: 'grid',
    name: '网格布局',
    description: '网格排列，信息丰富',
    preview: TemplatePreview.grid,
    layout: 'grid'
  },
  film: {
    id: 'film',
    name: '胶片边框',
    description: '边框限定，内容在胶片框内',
    preview: TemplatePreview.film,
    layout: 'film'
  },
  tag: {
    id: 'tag',
    name: '手写标签',
    description: '手写标签式，关键信息用"标签"突出',
    preview: TemplatePreview.tag,
    layout: 'tag'
  },
  diagonal: {
    id: 'diagonal',
    name: '色块分割',
    description: '对角线/阶梯式色块分割',
    preview: TemplatePreview.diagonal,
    layout: 'diagonal'
  },
  overlay: {
    id: 'overlay',
    name: '文字压图',
    description: '大字报式标题覆盖背景',
    preview: TemplatePreview.overlay,
    layout: 'overlay'
  },
  asymmetric: {
    id: 'asymmetric',
    name: '不对称环绕',
    description: '不对称图文环绕，文字绕插画',
    preview: TemplatePreview.asymmetric,
    layout: 'asymmetric'
  },
  sticky: {
    id: 'sticky',
    name: '便签式分块',
    description: '内容像贴在画板上的便签',
    preview: TemplatePreview.sticky,
    layout: 'sticky'
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