import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Search, X, Loader2, Sparkles, ArrowRight, Pencil, ImageIcon, BarChart3, Minus, ExternalLink } from 'lucide-react';
import { getAllCategories, getStickersInCategory, searchStickers } from '../../data/stickerData';

function StickersPanel({ isActive }) {
  const { addDynamicComponent } = useApp();
  const [selectedCategory, setSelectedCategory] = useState('arrows');
  const [searchQuery, setSearchQuery] = useState('');
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredSticker, setHoveredSticker] = useState(null);

  const categories = getAllCategories();

  // 为每个分类分配 lucide-react 图标
  const categoryIcons = {
    arrows: ArrowRight,
    doodles: Pencil,
    illustrations: ImageIcon,
    infographic: BarChart3,
    underlines: Minus
  };

  // 加载素材列表
  useEffect(() => {
    if (!isActive) return;

    setLoading(true);

    // 模拟加载延迟（实际项目中可能需要异步加载）
    setTimeout(() => {
      if (searchQuery.trim()) {
        // 搜索模式
        const results = searchStickers(searchQuery, null);
        setStickers(results);
      } else {
        // 分类浏览模式
        const categoryStickers = getStickersInCategory(selectedCategory);
        setStickers(categoryStickers);
      }
      setLoading(false);
    }, 200);
  }, [selectedCategory, searchQuery, isActive]);

  // 生成唯一ID
  const generateId = () => 'sticker_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

  // 添加贴纸到画布
  const handleAddSticker = (sticker) => {
    const component = {
      id: generateId(),
      type: 'image',
      content: sticker.filePath,
      position: {
        x: window.innerWidth / 2 - 100, // 居中放置
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
    console.log('✅ 添加贴纸到画布:', sticker.name);
  };

  // 处理搜索
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  // 清空搜索
  const clearSearch = () => {
    setSearchQuery('');
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
              <h2 className="text-base font-semibold text-gray-900">素材贴纸</h2>
              <p className="text-xs text-gray-500">
                {categories.reduce((sum, cat) => sum + cat.count, 0)} 个素材
              </p>
            </div>
          </div>
        </div>

        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="搜索素材..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-9 pr-9 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* 分类标签 - 只在非搜索模式显示 */}
      {!searchQuery && (
        <div className="px-6 py-3 bg-gray-50/50 overflow-x-auto scrollbar-hide">
          <div className="flex gap-1.5">
            {categories.map((category) => {
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
      )}

      {/* 素材网格 */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="animate-spin text-blue-500" size={28} />
          </div>
        ) : stickers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Search size={40} className="mb-2 opacity-30" />
            <p className="text-sm text-gray-500">未找到相关素材</p>
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
                {/* 素材预览 */}
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={sticker.filePath}
                    alt={sticker.name}
                    className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* 悬浮时显示名称 */}
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
        {!searchQuery && (
          <p className="text-xs text-gray-500 text-center">
            {categories.find(c => c.id === selectedCategory)?.displayName} • {stickers.length} 个素材
          </p>
        )}

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
    </div>
  );
}

export default StickersPanel;
