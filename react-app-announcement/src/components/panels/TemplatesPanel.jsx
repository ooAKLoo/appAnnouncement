import React from 'react';
import { useApp } from '../../context/AppContext';
import { Grid3x3 } from 'lucide-react';
import { getAllTemplates } from '../../data/templateConfig';

function TemplatesPanel({ isActive }) {
  const { state, setTemplate } = useApp();
  
  if (!isActive) return null;

  const templates = getAllTemplates();
  
  const handleTemplateSelect = (template) => {
    setTemplate(template.id);
  };

  return (
    <div className="fixed left-4 top-20 bottom-4 w-80 bg-white rounded-xl shadow-xl border border-gray-200/50 flex flex-col overflow-hidden z-50">
      {/* Panel Header */}
      <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
            <Grid3x3 size={20} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">布局模板</h2>
            <p className="text-sm text-gray-500">选择适合的布局风格</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        
        {/* 当前模板 */}
        <section className="mb-6">
          <h3 className="font-medium text-gray-900 mb-3">当前模板</h3>
          {state.design.template ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center border border-blue-200">
                  {templates.find(t => t.id === state.design.template)?.preview || <Grid3x3 size={20} className="text-blue-600" />}
                </div>
                <div>
                  <p className="font-medium text-blue-900">
                    {templates.find(t => t.id === state.design.template)?.name || '默认模板'}
                  </p>
                  <p className="text-sm text-blue-700">
                    {templates.find(t => t.id === state.design.template)?.description || '当前使用的布局模板'}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
              <p className="text-gray-500 text-sm">暂无选择模板</p>
            </div>
          )}
        </section>

        {/* 模板列表 */}
        <section>
          <h3 className="font-medium text-gray-900 mb-4">选择模板</h3>
          <div className="grid grid-cols-2 gap-3">
            {templates.map((template) => (
              <button
                key={template.id}
                className={`group relative p-4 border-2 rounded-xl transition-all hover:shadow-md ${
                  state.design.template === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 bg-white'
                }`}
                onClick={() => handleTemplateSelect(template)}
              >
                {/* 模板预览 */}
                <div className="w-full h-16 mb-3 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200">
                  {template.preview}
                </div>
                
                {/* 模板信息 */}
                <div className="text-left">
                  <h4 className={`font-medium text-sm mb-1 ${
                    state.design.template === template.id ? 'text-blue-900' : 'text-gray-900'
                  }`}>
                    {template.name}
                  </h4>
                  <p className={`text-xs leading-relaxed ${
                    state.design.template === template.id ? 'text-blue-700' : 'text-gray-500'
                  }`}>
                    {template.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default TemplatesPanel;