import React from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, LayoutTemplate, Box, RectangleHorizontal, Monitor, Smartphone, Trophy } from 'lucide-react';

function LayoutPanel({ isActive }) {
  const { state, updateDesign, setModelType } = useApp();

  if (!isActive) return null;

  // 设备类型选项
  const deviceTypes = [
    { id: 'mobile', name: '手机', icon: Smartphone },
    { id: 'desktop', name: '电脑', icon: Monitor },
    { id: 'product-hunt', name: 'Product Hunt', icon: Trophy },
  ];

  // 当前设备类型
  const currentDeviceType = state.deviceType || 'mobile';

  // 2D/3D 模式选项（仅对手机和电脑有效）
  const modelTypes = [
    { id: '3d', name: '3D 模型', icon: Box, description: '立体预览效果' },
    { id: '2d', name: '平面视图', icon: RectangleHorizontal, description: '2D 平面展示效果' },
  ];

  return (
    <div className="fixed left-4 top-20 bottom-4 w-80 bg-white rounded-xl shadow-xl border border-gray-200/50 flex flex-col overflow-hidden z-50">
      {/* Panel Header */}
      <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
            <Layers size={20} className="text-orange-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">布局设置</h2>
            <p className="text-sm text-gray-500">调整展示方式和间距</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        
        {/* 设备类型选择 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <LayoutTemplate size={16} className="text-gray-600" />
            <h3 className="font-medium text-gray-900">展示模型</h3>
          </div>
          
          {/* 设备类型横向滚动选择 */}
          <div className="mb-6">
            <div className="relative bg-gray-50/80 p-1 rounded-xl border border-gray-200/50">
              <div className="flex gap-1 overflow-x-auto scrollbar-hide">
                {deviceTypes.map((device) => (
                  <button
                    key={device.id}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-lg transition-all duration-300 whitespace-nowrap min-w-0 flex-shrink-0 ${
                      currentDeviceType === device.id
                        ? 'bg-white text-gray-800 shadow-sm font-medium'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-white/50'
                    }`}
                    onClick={() => {
                      updateDesign({ deviceType: device.id });
                      // 电脑只支持 2D 模式
                      if (device.id === 'desktop') {
                        setModelType('2d');
                      }
                    }}
                  >
                    <device.icon size={15} className={`transition-colors duration-200 ${
                      currentDeviceType === device.id ? 'text-gray-700' : 'text-gray-400'
                    }`} />
                    <span className="text-sm font-medium">{device.name}</span>
                    {currentDeviceType === device.id && (
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-blue-500/5 to-purple-500/5 pointer-events-none"></div>
                    )}
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
                  className={`group w-full p-3.5 rounded-xl transition-all duration-300 text-left hover:scale-[1.01] ${
                    state.modelType === model.id
                      ? 'bg-gradient-to-r from-gray-50 to-gray-100/50 border border-gray-200/80 shadow-sm'
                      : 'bg-white/50 border border-gray-100/50 hover:bg-gray-50/80 hover:border-gray-200/60'
                  }`}
                  onClick={() => setModelType(model.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg transition-all duration-300 ${
                      state.modelType === model.id
                        ? 'bg-gradient-to-br from-gray-600 to-gray-700 shadow-md'
                        : 'bg-gray-100 group-hover:bg-gray-200'
                    }`}>
                      <model.icon size={15} className={
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
                    <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      state.modelType === model.id ? 'bg-gray-700 scale-100' : 'bg-gray-300 scale-0'
                    }`}></div>
                  </div>
                </button>
              ))}
            </div>
          )}

          {/* 电脑模式 - 显示笔记本图片 */}
          {currentDeviceType === 'desktop' && (
            <div className="space-y-3">
              <div className="p-4 rounded-xl bg-gradient-to-br from-gray-50/80 to-slate-50/50 border border-gray-200/60">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="p-1.5 rounded-lg bg-gray-100">
                    <Monitor size={14} className="text-gray-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-800">2D 平面展示</span>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed mb-3">专为桌面端优化的平面布局模式</p>

                {/* 笔记本预览图 */}
                <div className="mt-3 rounded-lg overflow-hidden bg-white p-2 border border-gray-100">
                  <img
                    src="/macbook-mockup.png"
                    alt="MacBook Preview"
                    className="w-3/4 h-auto mx-auto"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Product Hunt 模式说明 */}
          {currentDeviceType === 'product-hunt' && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-orange-50/80 to-amber-50/50 border border-orange-200/60">
              <div className="flex items-center gap-2.5 mb-2">
                <div className="p-1.5 rounded-lg bg-orange-100">
                  <Trophy size={14} className="text-orange-600" />
                </div>
                <span className="text-sm font-medium text-orange-800">Product Hunt 展示</span>
              </div>
              <p className="text-xs text-orange-700/80 leading-relaxed">专为产品展示优化的平面布局模式</p>
            </div>
          )}
        </section>




      </div>
    </div>
  );
}

export default LayoutPanel;