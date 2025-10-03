import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Type, List, Box, Plus } from 'lucide-react';

function ContextMenu() {
  const { state, hideContextMenu, addDynamicComponent, setCurrentPanel } = useApp();
  
  // ✅ 添加详细的调试输出
  useEffect(() => {
    console.log('🎨 ContextMenu 状态更新:', {
      contextMenu: state.contextMenu,
      visible: state.contextMenu?.visible,
      x: state.contextMenu?.x,
      y: state.contextMenu?.y
    });
  }, [state.contextMenu]);
  
  console.log('🎨 ContextMenu 渲染:', state.contextMenu);
  
  if (!state.contextMenu?.visible) {
    console.log('❌ ContextMenu 未显示，原因:', {
      contextMenuExists: !!state.contextMenu,
      isVisible: state.contextMenu?.visible
    });
    return null;
  }
  
  console.log('✅ ContextMenu 正在渲染，位置:', state.contextMenu.x, state.contextMenu.y);
  
  const { x, y } = state.contextMenu;
  
  // 生成唯一ID
  const generateId = () => 'comp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  
  // 组件选项
  const componentOptions = [
    {
      type: 'text',
      icon: Type,
      label: '文本',
      description: '添加文本或标题',
      defaultContent: '点击编辑文本内容'
    },
    {
      type: 'list',
      icon: List,
      label: '列表',
      description: '添加项目列表',
      defaultContent: ['列表项 1', '列表项 2', '列表项 3']
    },
    {
      type: 'component',
      icon: Box,
      label: '组件',
      description: '选择预设组件',
      isLibrary: true // 标记这是打开组件库的选项
    }
  ];
  
  const handleAddComponent = (option) => {
    console.log('➕ 添加组件:', option.type);

    // 如果是组件库选项，打开组件库面板
    if (option.isLibrary) {
      setCurrentPanel('componentLibrary');
      hideContextMenu();
      return;
    }

    // 获取可编辑区域的边界，将视口坐标转换为相对坐标
    const editableArea = document.querySelector('[data-editable-area="true"]');
    const rect = editableArea?.getBoundingClientRect() || { left: 0, top: 0 };

    const component = {
      id: generateId(),
      type: option.type,
      content: option.defaultContent,
      position: {
        x: x - rect.left - 20,
        y: y - rect.top - 20
      },
      styles: {
        fontSize: '16px',
        fontWeight: '400',
        color: '#333333',
        backgroundColor: 'transparent',
        padding: '8px',
        borderRadius: '4px'
      }
    };

    addDynamicComponent(component);
    hideContextMenu();
  };
  
  return (
    <>
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 z-40 context-menu-container"
        onClick={(e) => {
          console.log('🖱️ 点击遮罩，关闭菜单');
          hideContextMenu();
        }}
      />
      
      {/* 菜单内容 */}
      <div 
        className="fixed z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-2 min-w-[200px] context-menu-container"
        style={{
          left: Math.min(x, window.innerWidth - 220),
          top: Math.min(y, window.innerHeight - 300),
        }}
        onClick={(e) => {
          console.log('🖱️ 点击菜单内容');
          e.stopPropagation(); // 防止点击菜单内容时关闭
        }}
      >
        <div className="px-3 py-2 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <Plus size={14} />
            添加组件
          </div>
        </div>
        
        <div className="py-1">
          {componentOptions.map((option) => (
            <button
              key={option.type}
              onClick={() => {
                console.log('🖱️ 点击选项:', option.label);
                handleAddComponent(option);
              }}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 transition-colors flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                <option.icon size={16} className="text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-gray-900">{option.label}</div>
                <div className="text-xs text-gray-500 truncate">{option.description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

export default ContextMenu;