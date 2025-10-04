import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Loader2, Sparkles, Box, ArrowRight, Pencil, ImageIcon, BarChart3, Minus, ExternalLink } from 'lucide-react';
import { getAllCategories, getStickersInCategory } from '../../data/stickerData';
import { getAllComponentTypes, generateComponent } from '../../data/componentLibrary';

function AssetsLibraryPanel({ isActive, initialTab = 'stickers' }) {
  const { addDynamicComponent, setCurrentPanel } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedCategory, setSelectedCategory] = useState('arrows');
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredSticker, setHoveredSticker] = useState(null);

  const stickerCategories = getAllCategories();
  const componentTypes = getAllComponentTypes();

  // 为每个素材分类分配图标
  const categoryIcons = {
    arrows: ArrowRight,
    doodles: Pencil,
    illustrations: ImageIcon,
    infographic: BarChart3,
    underlines: Minus
  };

  // 加载素材列表
  useEffect(() => {
    if (!isActive || activeTab !== 'stickers') return;

    setLoading(true);

    setTimeout(() => {
      const categoryStickers = getStickersInCategory(selectedCategory);
      setStickers(categoryStickers);
      setLoading(false);
    }, 200);
  }, [selectedCategory, isActive, activeTab]);

  // 切换初始Tab - 当 initialTab 改变时更新 activeTab
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const generateId = () => 'asset_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

  // 添加组件
  const handleAddComponent = (componentTypeId) => {
    const componentData = generateComponent(componentTypeId);
    if (!componentData) return;

    const component = {
      id: generateId(),
      type: componentData.isMagicUI ? 'component' : 'text', // Magic UI 用 component 类型
      content: componentData.content,
      componentType: componentData.componentType, // 保存组件类型
      props: componentData.props, // 保存组件属性
      isMagicUI: componentData.isMagicUI, // 传递 Magic UI 标志
      position: {
        x: window.innerWidth / 2 - 100,
        y: window.innerHeight / 2 - 50
      },
      styles: componentData.styles
    };

    addDynamicComponent(component);
    console.log('✅ 添加组件:', componentTypeId, componentData.props, '是否Magic UI:', componentData.isMagicUI);
  };

  // 添加素材
  const handleAddSticker = (sticker) => {
    const component = {
      id: generateId(),
      type: 'image',
      content: sticker.filePath,
      position: {
        x: window.innerWidth / 2 - 100,
        y: window.innerHeight / 2 - 100
      },
      styles: {
        width: '200px',
        height: 'auto',
        objectFit: 'contain',
        backgroundColor: 'transparent'
      }
    };

    addDynamicComponent(component);
    console.log('✅ 添加素材到画布:', sticker.name);
  };

  if (!isActive) return null;

  return (
    <div className="fixed left-4 top-20 bottom-4 w-80 bg-white rounded-xl shadow-xl border border-gray-200/50 flex flex-col overflow-hidden z-40">
      {/* Header */}
      <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <Sparkles size={20} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-gray-900">资源库</h2>
              <p className="text-xs text-gray-500">
                {activeTab === 'components' ? '10 个组件' : `${stickerCategories.reduce((sum, cat) => sum + cat.count, 0)} 个素材`}
              </p>
            </div>
          </div>
          <button
            onClick={() => setCurrentPanel(null)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('components')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'components'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Box size={14} />
            组件
          </button>
          <button
            onClick={() => setActiveTab('stickers')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
              activeTab === 'stickers'
                ? 'bg-blue-500 text-white shadow-sm'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Sparkles size={14} />
            素材
          </button>
        </div>
      </div>

      {/* 组件Tab内容 */}
      {activeTab === 'components' && (
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <div className="mb-6">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              组件
            </h3>
            <p className="text-xs text-gray-400">
              点击插入，可自定义样式和内容
            </p>
          </div>

          {componentTypes.map((compType) => {
            const Icon = compType.icon;
            const componentData = generateComponent(compType.id);

            return (
              <button
                key={compType.id}
                onClick={() => handleAddComponent(compType.id)}
                className="w-full group relative border border-gray-200 rounded-lg hover:border-blue-400 hover:shadow-sm transition-all overflow-hidden"
              >
                {/* 预览区域 - 作为主视觉 */}
                <div className="flex items-center justify-center py-6 bg-gradient-to-br from-gray-50 to-white group-hover:from-blue-50 group-hover:to-white transition-all">
                  <div style={componentData.styles}>
                    {componentData.content}
                  </div>
                </div>

                {/* 底部信息栏 */}
                <div className="flex items-center gap-2 px-3 py-2 bg-white border-t border-gray-100">
                  <div className="w-5 h-5 rounded bg-blue-50 flex items-center justify-center flex-shrink-0">
                    <Icon size={12} className="text-blue-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-xs font-medium text-gray-700">{compType.name}</p>
                  </div>
                  <div className="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    点击插入
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* 素材Tab内容 */}
      {activeTab === 'stickers' && (
        <>
          {/* 分类标签 */}
          <div className="px-6 py-3 bg-gray-50/50 overflow-x-auto scrollbar-hide">
            <div className="flex gap-1.5">
              {stickerCategories.map((category) => {
                const Icon = categoryIcons[category.id];
                return (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-blue-500 text-white shadow-sm'
                        : 'bg-white text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={12} />
                    {category.displayName}
                    <span className={`text-[10px] ${selectedCategory === category.id ? 'opacity-80' : 'opacity-50'}`}>
                      {category.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 素材网格 */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="animate-spin text-blue-500" size={28} />
              </div>
            ) : (
              <div className="grid grid-cols-3 gap-2.5">
                {stickers.map((sticker) => (
                  <button
                    key={sticker.id}
                    onClick={() => handleAddSticker(sticker)}
                    onMouseEnter={() => setHoveredSticker(sticker.id)}
                    onMouseLeave={() => setHoveredSticker(null)}
                    className="group relative aspect-square bg-gray-50 rounded-lg hover:bg-blue-50 transition-all p-2.5 overflow-hidden"
                    title={sticker.name}
                  >
                    <div className="w-full h-full flex items-center justify-center">
                      <img
                        src={sticker.filePath}
                        alt={sticker.name}
                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>

                    {hoveredSticker === sticker.id && (
                      <div className="absolute inset-0 bg-black/5 flex items-end">
                        <div className="w-full bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5">
                          <p className="text-[10px] text-white truncate text-center font-medium">
                            {sticker.name}
                          </p>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer - 署名和统计 */}
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 space-y-2">
            {/* 作者署名 */}
            <a
              href="https://dribbble.com/DaryaKro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 text-[11px] text-gray-400 hover:text-blue-600 transition-colors group"
            >
              <span>Thanks to</span>
              <span className="font-medium">Darya Kro</span>
              <ExternalLink size={10} className="opacity-0 group-hover:opacity-100 transition-opacity" />
            </a>
          </div>
        </>
      )}
    </div>
  );
}

export default AssetsLibraryPanel;
