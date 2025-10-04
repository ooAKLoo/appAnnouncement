import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Loader2, Sparkles, Box, Star, Users, Tag, Download, Award, Zap, Shield, Crown, ArrowRight, Pencil, ImageIcon, BarChart3, Minus, ExternalLink } from 'lucide-react';
import { getAllCategories, getStickersInCategory } from '../../data/stickerData';

function AssetsLibraryPanel({ isActive, initialTab = 'stickers' }) {
  const { addDynamicComponent, setCurrentPanel } = useApp();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [selectedCategory, setSelectedCategory] = useState('arrows');
  const [stickers, setStickers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hoveredSticker, setHoveredSticker] = useState(null);

  const stickerCategories = getAllCategories();

  // 为每个素材分类分配图标
  const categoryIcons = {
    arrows: ArrowRight,
    doodles: Pencil,
    illustrations: ImageIcon,
    infographic: BarChart3,
    underlines: Minus
  };

  // 组件库数据
  const componentLibrary = [
    {
      id: 'rating',
      name: '评分',
      icon: Star,
      description: '显示评分',
      template: {
        type: 'component',
        content: '⭐ 4.8',
        styles: {
          fontSize: '16px',
          fontWeight: '600',
          color: '#f59e0b',
          backgroundColor: '#fffbeb',
          padding: '8px 16px',
          borderRadius: '20px',
          border: '1px solid #fef3c7'
        }
      }
    },
    {
      id: 'users',
      name: '用户数',
      icon: Users,
      description: '显示用户量',
      template: {
        type: 'component',
        content: '10M+ 用户',
        styles: {
          fontSize: '14px',
          fontWeight: '600',
          color: '#3b82f6',
          backgroundColor: '#eff6ff',
          padding: '6px 14px',
          borderRadius: '16px',
          border: '1px solid #dbeafe'
        }
      }
    },
    {
      id: 'discount',
      name: '折扣标签',
      icon: Tag,
      description: '促销折扣',
      template: {
        type: 'component',
        content: '50% OFF',
        styles: {
          fontSize: '18px',
          fontWeight: '700',
          color: '#ffffff',
          backgroundColor: '#ef4444',
          padding: '10px 20px',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
        }
      }
    },
    {
      id: 'new-badge',
      name: 'NEW 标签',
      icon: Sparkles,
      description: '新品标识',
      template: {
        type: 'component',
        content: 'NEW',
        styles: {
          fontSize: '12px',
          fontWeight: '700',
          color: '#ffffff',
          backgroundColor: '#8b5cf6',
          padding: '4px 12px',
          borderRadius: '12px',
          letterSpacing: '0.5px'
        }
      }
    },
    {
      id: 'featured',
      name: 'Featured',
      icon: Award,
      description: '精选推荐',
      template: {
        type: 'component',
        content: '🏆 Featured',
        styles: {
          fontSize: '14px',
          fontWeight: '600',
          color: '#f59e0b',
          backgroundColor: '#fffbeb',
          padding: '8px 16px',
          borderRadius: '20px',
          border: '1px solid #fbbf24'
        }
      }
    },
    {
      id: 'ai-powered',
      name: 'AI 驱动',
      icon: Zap,
      description: 'AI 特性标签',
      template: {
        type: 'component',
        content: '⚡ AI Powered',
        styles: {
          fontSize: '14px',
          fontWeight: '600',
          color: '#8b5cf6',
          backgroundColor: '#f5f3ff',
          padding: '6px 14px',
          borderRadius: '16px',
          border: '1px solid #ddd6fe'
        }
      }
    },
    {
      id: 'free',
      name: '免费标签',
      icon: Tag,
      description: '免费使用',
      template: {
        type: 'component',
        content: 'FREE',
        styles: {
          fontSize: '16px',
          fontWeight: '700',
          color: '#10b981',
          backgroundColor: '#d1fae5',
          padding: '8px 20px',
          borderRadius: '20px',
          border: '1px solid #a7f3d0'
        }
      }
    },
    {
      id: 'premium',
      name: '高级版',
      icon: Crown,
      description: '付费标识',
      template: {
        type: 'component',
        content: '👑 Premium',
        styles: {
          fontSize: '14px',
          fontWeight: '600',
          color: '#eab308',
          backgroundColor: '#fef9c3',
          padding: '6px 14px',
          borderRadius: '16px',
          border: '1px solid #fde047'
        }
      }
    },
    {
      id: 'secure',
      name: '安全认证',
      icon: Shield,
      description: '安全标识',
      template: {
        type: 'component',
        content: '🛡️ 安全认证',
        styles: {
          fontSize: '14px',
          fontWeight: '600',
          color: '#059669',
          backgroundColor: '#d1fae5',
          padding: '6px 14px',
          borderRadius: '16px',
          border: '1px solid #a7f3d0'
        }
      }
    },
    {
      id: 'download-count',
      name: '下载量',
      icon: Download,
      description: '下载次数',
      template: {
        type: 'component',
        content: '1M+ 下载',
        styles: {
          fontSize: '14px',
          fontWeight: '600',
          color: '#6366f1',
          backgroundColor: '#eef2ff',
          padding: '6px 14px',
          borderRadius: '16px',
          border: '1px solid #c7d2fe'
        }
      }
    }
  ];

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
  const handleAddComponent = (componentTemplate) => {
    const component = {
      id: generateId(),
      ...componentTemplate.template,
      position: { x: 100, y: 100 }
    };

    addDynamicComponent(component);
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
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <div className="grid grid-cols-2 gap-3">
            {componentLibrary.map((component) => (
              <button
                key={component.id}
                onClick={() => handleAddComponent(component)}
                className="group p-4 border-2 border-gray-200 rounded-xl hover:border-blue-400 hover:bg-blue-50/50 transition-all text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <component.icon size={20} className="text-blue-600" />
                </div>
                <h3 className="font-medium text-gray-900 text-sm mb-1">
                  {component.name}
                </h3>
                <p className="text-xs text-gray-500">
                  {component.description}
                </p>
                {/* 预览 */}
                <div className="mt-3 flex items-center justify-center">
                  <div style={component.template.styles} className="inline-block text-xs">
                    {component.template.content}
                  </div>
                </div>
              </button>
            ))}
          </div>
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
