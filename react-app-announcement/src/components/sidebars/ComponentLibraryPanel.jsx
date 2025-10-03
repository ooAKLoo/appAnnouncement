import React from 'react';
import { useApp } from '../../context/AppContext';
import { Star, Users, Tag, Download, Award, Zap, Shield, Crown, Sparkles, X } from 'lucide-react';

function ComponentLibraryPanel({ isActive, onClose }) {
  const { addDynamicComponent } = useApp();

  if (!isActive) return null;

  // 预设组件库
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

  const generateId = () => 'comp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);

  const handleAddComponent = (componentTemplate) => {
    const component = {
      id: generateId(),
      ...componentTemplate.template,
      position: { x: 100, y: 100 } // 默认位置，用户可以拖动
    };

    addDynamicComponent(component);
    if (onClose) onClose();
  };

  return (
    <div className="fixed left-4 top-20 bottom-4 w-80 bg-white rounded-xl shadow-xl border border-gray-200/50 flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">组件库</h2>
              <p className="text-sm text-gray-500">选择预设组件</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Content */}
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
    </div>
  );
}

export default ComponentLibraryPanel;
