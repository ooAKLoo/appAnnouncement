import React from 'react';
import { useApp } from '../../context/AppContext';
import { Layers, LayoutTemplate, Box, RectangleHorizontal } from 'lucide-react';

function LayoutPanel({ isActive }) {
  const { state, updateDesign, setModelType } = useApp();

  if (!isActive) return null;


  // 视图模式选项
  const viewModes = [
    { id: '3d', name: '3D 模型', icon: Box, description: '立体手机预览效果' },
    { id: '2d', name: '平面视图', icon: RectangleHorizontal, description: '2D 平面展示效果' },
  ];

  return (
    <div className="fixed left-4 top-20 bottom-4 w-80 bg-white rounded-xl shadow-xl border border-gray-200/50 flex flex-col overflow-hidden">
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
        
        {/* 视图模式 */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Box size={16} className="text-gray-600" />
            <h3 className="font-medium text-gray-900">展示方式</h3>
          </div>
          <div className="space-y-3">
            {viewModes.map((mode) => (
              <button
                key={mode.id}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  state.modelType === mode.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setModelType(mode.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    state.modelType === mode.id ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <mode.icon size={20} className={
                      state.modelType === mode.id ? 'text-blue-600' : 'text-gray-600'
                    } />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{mode.name}</div>
                    <div className="text-sm text-gray-500">{mode.description}</div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </section>


        {/* 布局调整 */}
        <section>
          <h3 className="font-medium text-gray-900 mb-4">布局调整</h3>
          <div className="space-y-4">
            
            {/* 内容间距 */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">内容间距</label>
                <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {state.design.spacing}px
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="40"
                step="4"
                value={state.design.spacing}
                onChange={(e) => updateDesign({ spacing: parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>紧凑</span>
                <span>舒适</span>
                <span>宽松</span>
              </div>
            </div>

            {/* 内容对齐 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">内容对齐</label>
              <div className="flex gap-2">
                {['left', 'center', 'right'].map((align) => (
                  <button
                    key={align}
                    className={`flex-1 py-2 px-3 text-sm rounded-lg transition-all ${
                      (state.design.alignment || 'center') === align
                        ? 'bg-blue-100 text-blue-700 font-medium'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                    onClick={() => updateDesign({ alignment: align })}
                  >
                    {{ left: '左对齐', center: '居中', right: '右对齐' }[align]}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 响应式预览 */}
        <section>
          <h3 className="font-medium text-gray-900 mb-4">预览尺寸</h3>
          <div className="space-y-2">
            {[
              { name: 'iPhone 15 Pro', size: '393×852' },
              { name: 'iPad', size: '820×1180' },
              { name: 'Desktop', size: '1920×1080' }
            ].map((device) => (
              <button
                key={device.name}
                className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <span className="text-sm font-medium text-gray-900">{device.name}</span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {device.size}
                </span>
              </button>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}

export default LayoutPanel;