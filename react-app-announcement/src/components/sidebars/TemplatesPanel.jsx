import React from 'react';
import { useApp } from '../../context/AppContext';
import { Grid3x3, Smartphone, Monitor, Trophy, Box, RectangleHorizontal, LayoutTemplate, X } from 'lucide-react';
import { getAllTemplates } from '../../data/templateConfig';

function TemplatesPanel({ isActive }) {
  const { state, setTemplate, updateDesign, setModelType, setCurrentPanel } = useApp();

  if (!isActive) return null;

  const currentDeviceType = state.deviceType || 'mobile';
  const templates = getAllTemplates().filter(template =>
    template.deviceTypes?.includes(currentDeviceType)
  );

  const handleTemplateSelect = (template) => {
    setTemplate(template.id);
  };

  // 设备类型选项
  const deviceTypes = [
    { id: 'mobile', name: '手机', icon: Smartphone },
    { id: 'desktop', name: '电脑', icon: Monitor },
    { id: 'product-hunt', name: 'Product Hunt', icon: Trophy },
  ];

  // 2D/3D 模式选项
  const modelTypes = [
    { id: '3d', name: '3D 模型', icon: Box, description: '立体预览效果' },
    { id: '2d', name: '平面视图', icon: RectangleHorizontal, description: '2D 平面展示效果' },
  ];

  return (
    <div className="fixed left-4 top-20 bottom-4 w-80 bg-white rounded-xl shadow-xl border border-gray-200/50 flex flex-col overflow-hidden z-50">
      {/* Panel Header */}
      <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Grid3x3 size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">布局模板</h2>
              <p className="text-sm text-gray-500">选择适合的布局风格</p>
            </div>
          </div>
          <button
            onClick={() => setCurrentPanel(null)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">

        {/* 展示模型 */}
        <section className="mb-6">
          {/* 设备类型选择 */}
          <div className="mb-4">
            <div className="bg-gray-50/50 overflow-x-auto scrollbar-hide px-3 py-2 rounded-lg">
              <div className="flex gap-1.5">
                {deviceTypes.map((device) => (
                  <button
                    key={device.id}
                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                      currentDeviceType === device.id
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      updateDesign({ deviceType: device.id });
                      if (device.id === 'desktop' || device.id === 'product-hunt') {
                        setModelType('2d');
                      }
                    }}
                  >
                    <device.icon size={14} />
                    {device.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 2D/3D 模式选择 (仅手机显示) */}
          {currentDeviceType === 'mobile' && (
            <div className="space-y-2">
              {modelTypes.map((model) => (
                <button
                  key={model.id}
                  className={`group w-full p-3 rounded-xl transition-all duration-300 text-left ${
                    state.modelType === model.id
                      ? 'bg-gradient-to-r from-gray-50 to-gray-100/50 border border-gray-200/80 shadow-sm'
                      : 'bg-white/50 border border-gray-100/50 hover:bg-gray-50/80 hover:border-gray-200/60'
                  }`}
                  onClick={() => setModelType(model.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                      state.modelType === model.id
                        ? 'bg-gradient-to-br from-gray-600 to-gray-700 shadow-md'
                        : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <model.icon size={14} className={
                        state.modelType === model.id ? 'text-white' : 'text-gray-500 group-hover:text-gray-600'
                      } />
                    </div>
                    <div className="flex-1">
                      <div className={`font-medium text-sm transition-colors ${
                        state.modelType === model.id ? 'text-gray-800' : 'text-gray-700'
                      }`}>
                        {model.name}
                      </div>
                      <div className={`text-xs transition-colors ${
                        state.modelType === model.id ? 'text-gray-600' : 'text-gray-500'
                      }`}>
                        {model.description}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* 电脑模式 - 显示笔记本图片 */}
          {currentDeviceType === 'desktop' && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-gray-50/80 to-slate-50/50 border border-gray-200/60">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 rounded-lg bg-gray-100">
                  <Monitor size={12} className="text-gray-600" />
                </div>
                <span className="text-xs font-medium text-gray-800">2D 平面展示</span>
              </div>
              <p className="text-xs text-gray-600 leading-relaxed mb-2">专为桌面端优化的平面布局模式</p>
              <div className="rounded-lg overflow-hidden bg-white p-2 border border-gray-100">
                <img
                  src="/macbook-mockup.png"
                  alt="MacBook Preview"
                  className="w-3/4 h-auto mx-auto"
                />
              </div>
            </div>
          )}

          {/* Product Hunt 模式说明 */}
          {currentDeviceType === 'product-hunt' && (
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-50/80 to-amber-50/50 border border-orange-200/60">
              <div className="flex items-center gap-2 mb-2">
                <div className="p-1 rounded-lg bg-orange-100">
                  <Trophy size={12} className="text-orange-600" />
                </div>
                <span className="text-xs font-medium text-orange-800">Product Hunt 展示</span>
              </div>
              <p className="text-xs text-orange-700/80 leading-relaxed">专为产品展示优化的平面布局模式</p>
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