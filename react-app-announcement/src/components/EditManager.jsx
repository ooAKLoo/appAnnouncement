import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';

/**
 * 全局编辑管理器
 * 自动处理所有可编辑元素的点击、选中
 */
function EditManager({ children }) {
  console.log('🎨 EditManager 渲染中...');
  const { state, selectElement, deselectElement, setCurrentPanel } = useApp();

  useEffect(() => {
    console.log('✅ EditManager 已挂载');
    const handleClick = (e) => {
      // 排除右键点击
      if (e.button === 2) return;

      // 检查是否点击了样式面板
      const isStylePanelClick = e.target.closest('.style-edit-panel');
      if (isStylePanelClick) return;

      // 🔧 检查是否点击了多选边界框（重要：在捕获阶段需要排除）
      const isMultiSelectionBox = e.target.closest('.multi-selection-box');
      if (isMultiSelectionBox) {
        console.log('🖱️ 点击了多选边界框，跳过选中逻辑');
        return;
      }

      // 检查是否点击了组件控制栏
      const isComponentControl = e.target.closest('.component-control');
      if (isComponentControl) {
        console.log('🖱️ 点击了组件控制栏，跳过选中逻辑');
        return;
      }

      // 检查是否点击了可拖动元素，如果是则跳过处理
      const draggableElement = e.target.closest('[data-draggable="true"]');
      if (draggableElement) {
        console.log('🖱️ 点击了可拖动元素，跳过选中逻辑');
        return;
      }

      // 查找最近的可编辑元素
      const editableElement = e.target.closest('[data-editable="true"]');

      if (editableElement) {
        // 点击了可编辑元素，选中它并切换到对应面板
        const id = editableElement.getAttribute('data-editable-id');
        const path = editableElement.getAttribute('data-editable-path');

        console.log('📝 选中元素:', { id, path });
        selectElement('element', id, path);

        // 🖼️ 智能判断面板类型：图片元素打开图片面板，其他元素打开样式面板
        const isImageElement = path && (
          path.includes('icon') ||
          path.includes('image') ||
          path === 'appInfo.icon' ||
          path === 'productHuntInfo.icon'
        );

        if (isImageElement) {
          console.log('🖼️ 检测到图片元素，打开图片面板');
          setCurrentPanel('image');
        } else {
          console.log('📝 检测到非图片元素，打开样式面板');
          setCurrentPanel('style');
        }

        e.stopPropagation();
      }
      // 🔥 移除这里的取消选中逻辑，让 MainContent 的 handleBackgroundClick 统一处理
      // else {
      //   if (state.selectedElement) {
      //     console.log('❌ 取消选中');
      //     deselectElement();
      //   }
      // }
    };

    document.addEventListener('mousedown', handleClick, true);
    return () => {
      console.log('🗑️ EditManager 卸载监听器');
      document.removeEventListener('mousedown', handleClick, true);
    };
  }, [state.selectedElement, selectElement, deselectElement, setCurrentPanel]);

  // 为选中的元素添加视觉效果
  useEffect(() => {
    if (!state.selectedElement) return;

    const element = document.querySelector(`[data-editable-id="${state.selectedElement.id}"]`);
    if (!element) {
      console.warn('⚠️ 未找到选中的元素:', state.selectedElement.id);
      return;
    }

    console.log('🎯 为元素添加选中样式:', state.selectedElement.id);
    // 添加选中样式
    element.style.outline = '2px solid #3b82f6';
    element.style.outlineOffset = '2px';
    element.style.position = 'relative';

    return () => {
      // 移除选中样式
      element.style.outline = '';
      element.style.outlineOffset = '';
    };
  }, [state.selectedElement]);

  console.log('🔍 EditManager children:', React.Children.count(children));

  return <>{children}</>;
}

export default EditManager;
