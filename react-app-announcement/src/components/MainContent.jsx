import React, { useEffect, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useApp } from '../context/AppContext';
import PhoneModel from './models/PhoneModel';
import PhoneModel2D from './models/PhoneModel2D';
import MacBookModel2D from './models/MacBookModel2D';
import { getStyleById } from '../data/styleConfig';
import { getTemplateConfig, templateSupports } from '../data/templateConfig';
import StyledText from './common/StyledText';
import Editable from './common/Editable';
import DraggableWrapper from './DraggableWrapper';
import EditManager from './EditManager';
import ContextMenu from './ContextMenu';
import DynamicComponent from './DynamicComponent';
import SelectionBox from './SelectionBox';
import MultiSelectionBox from './MultiSelectionBox';
import ExportFrame from './ExportFrame';

// 导出框显示配置常量（与 ExportFrame 保持一致）
const EXPORT_FRAME_MARGIN = 100;
const EXPORT_FRAME_SCALE = 0.9;

function MainContent() {
  console.log('🏠 MainContent 渲染中...');
  const { state, toggleToolbars, reorderFeatures, showContextMenu, hideContextMenu, clearSelection, updateElementStyle, deleteDynamicComponent, selectElement } = useApp();

  // 框选状态
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectionStart, setSelectionStart] = useState(null);
  const [selectionEnd, setSelectionEnd] = useState(null);
  const [justFinishedSelecting, setJustFinishedSelecting] = useState(false);

  console.log('📊 MainContent state:', {
    template: state.design.template,
    currentStyle: state.currentStyle,
    toolbarsVisible: state.toolbarsVisible
  });

  // 从统一状态获取配置
  const currentTemplate = state.design.template;
  const templateConfig = getTemplateConfig(currentTemplate);
  const currentStyle = getStyleById(state.currentStyle);

  // 保持对最新 showContextMenu 的引用，避免监听器闭包过期
  const showContextMenuRef = React.useRef(showContextMenu);
  useEffect(() => { showContextMenuRef.current = showContextMenu; }, [showContextMenu]);

  // 添加右键菜单监听器 - 使用捕获模式优先处理（仅注册一次）
  useEffect(() => {
    console.log('📌 [右键菜单] useEffect 开始执行，注册监听器');
    console.log('📌 [右键菜单] showContextMenu 当前引用类型:', typeof showContextMenuRef.current);
    
    const handleRightClick = (e) => {
      // ⚡ 立即阻止浏览器默认右键菜单（无论什么情况）
      e.preventDefault();
      e.stopPropagation();
      
      // 立即打印，确认事件触发
      console.log('\n=================================');
      console.log('✅ contextmenu 事件触发！', e.target);
      console.log('=================================');
      console.log('📍 点击位置:', { x: e.clientX, y: e.clientY });
      console.log('🎯 点击目标元素:', e.target);
      console.log('📝 目标元素类名:', e.target.className);
      console.log('📝 目标元素标签:', e.target.tagName);
      console.log('📝 目标元素ID:', e.target.id);
      
      // 放宽阻止条件：允许在手机模型(canvas)区域也能打开菜单
      const isInteractiveElement = 
        e.target.closest('button, input, textarea, select, [contenteditable], a[href], .context-menu-container');
      const isPanel = e.target.closest('.style-edit-panel, [class*="panel"]');
      const isContextMenu = e.target.closest('.context-menu-container');
      const isInModelArea = e.target.closest('.phone-model, .phone-model-2d');
      
      console.log('\n📋 元素类型检查结果:');
      console.log('  ├─ 交互元素:', !!isInteractiveElement);
      console.log('  ├─ 手机模型区域:', !!isInModelArea);
      console.log('  ├─ 面板:', !!isPanel);
      console.log('  └─ 右键菜单:', !!isContextMenu);
      
      // 判断是否可以显示菜单（允许在手机模型区域显示）
      const canShowMenu = !isInteractiveElement && !isPanel && !isContextMenu;
      
      console.log('\n✅ 是否可以显示菜单:', canShowMenu);
      
      if (canShowMenu) {
        console.log('🎉 满足显示条件！');
        console.log('📞 调用 showContextMenu(' + e.clientX + ', ' + e.clientY + ')');
        // 使用最新的引用，避免因依赖变化导致监听器抖动
        showContextMenuRef.current?.(e.clientX, e.clientY);
        console.log('✅ showContextMenu 调用完成');
      } else {
        console.log('❌ 不满足显示条件');
      }
      console.log('=================================\n');
    };

    // 右键按下兜底：某些环境可能禁止/拦截 contextmenu 事件
    const handleRightMouseDown = (e) => {
      if (e.button !== 2) return;
      
      // ⚡ 立即阻止默认行为
      e.preventDefault();
      e.stopPropagation();
      
      console.log('\n=================================');
      console.log('✅ mousedown(右键) 事件触发！', e.target);
      console.log('=================================');
      console.log('📍 点击位置:', { x: e.clientX, y: e.clientY });
      
      const isInteractiveElement = 
        e.target.closest('button, input, textarea, select, [contenteditable], a[href], .context-menu-container');
      const isPanel = e.target.closest('.style-edit-panel, [class*="panel"]');
      const isContextMenu = e.target.closest('.context-menu-container');
      const canShowMenu = !isInteractiveElement && !isPanel && !isContextMenu;
      console.log('\n✅ (mousedown) 是否可以显示菜单:', canShowMenu);

      if (canShowMenu) {
        showContextMenuRef.current?.(e.clientX, e.clientY);
        console.log('✅ (mousedown) showContextMenu 调用完成');
      }
      console.log('=================================\n');
    };

    console.log('🔗 注册 contextmenu 事件监听器（捕获模式）');
    // 使用捕获模式，确保最早捕获到事件
    window.addEventListener('contextmenu', handleRightClick, true);
    window.addEventListener('mousedown', handleRightMouseDown, true);
    
    return () => {
      console.log('🗑️  移除 contextmenu 事件监听器');
      window.removeEventListener('contextmenu', handleRightClick, true);
      window.removeEventListener('mousedown', handleRightMouseDown, true);
    };
  }, []);

  console.log('🎨 [MainContent] 当前 contextMenu 状态:', state.contextMenu);
  
  // 🔧 如果 contextMenu 为 null，强制初始化
  React.useEffect(() => {
    if (state.contextMenu === null) {
      console.log('⚠️  contextMenu 为 null，强制初始化');
      // 不直接修改 state，而是通过 dispatch
      hideContextMenu(); // 这会将 contextMenu 设置为正确的结构
    }
  }, [state.contextMenu, hideContextMenu]);



  // 直接从templateConfig获取布局配置
  const layout = templateConfig.layoutConfig;

  // ⚠️ 模板不再直接渲染，而是通过 dynamicComponents 统一管理
  // 所有模板元素在切换模板时已经转换为 dynamicComponents

  // 渲染功能列表
  const renderFeatures = () => {
    const featureStyle = currentStyle.featureCard;
    const isCenter = state.design.template === 'center';
    const featureCount = state.features.length;
    
    // 创建包装单个功能的函数
    const wrapFeature = (feature, index, content) => {
      return (
        <DraggableWrapper
          key={`${feature.id || index}-${index}`}
          index={index}
          onReorder={reorderFeatures}
          dragType="feature"
          className="group"
        >
          <Editable
            path={`features.${index}.title`}
            className="w-full"
          >
            {content}
          </Editable>
        </DraggableWrapper>
      );
    };
    
    // 根据用户选择的样式渲染不同的布局
    if (state.featureStyle === 'markdown') {
      // Markdown风格：简洁的无序列表
      if (isCenter) {
        // 居中布局下的智能排版
        let gridClass = '';
        if (featureCount <= 3) {
          gridClass = 'grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2';
        } else if (featureCount === 4) {
          gridClass = 'grid grid-cols-2 gap-x-8 gap-y-4';
        } else {
          gridClass = 'grid grid-cols-3 gap-x-8 gap-y-4';
        }
        
        return (
          <div className={gridClass}>
            {state.features.map((feature, index) => {
              // 5个功能时，最后2个需要特殊处理
              const isLastTwo = featureCount === 5 && index >= 3;
              const content = (
                <div 
                  className={`
                    text-left
                    ${isLastTwo && index === 3 ? 'col-start-1 col-end-2' : ''}
                    ${isLastTwo && index === 4 ? 'col-start-3 col-end-4' : ''}
                  `}
                >
                  <StyledText variant="text" className="inline-flex items-start gap-2">
                    <span className="opacity-60 mt-0.5">•</span>
                    <span>{feature.title}</span>
                  </StyledText>
                </div>
              );
              return wrapFeature(feature, index, content);
            })}
          </div>
        );
      } else {
        // 非居中布局保持原样
        return (
          <ul className="space-y-2">
            {state.features.map((feature, index) => {
              const content = (
                <li className="flex items-start gap-2">
                  <StyledText variant="text" className="flex items-start gap-2">
                    <span className="opacity-60 mt-0.5">•</span>
                    <span>{feature.title}</span>
                  </StyledText>
                </li>
              );
              return wrapFeature(feature, index, content);
            })}
          </ul>
        );
      }
    } else {
      // 默认卡片样式：根据功能数量动态调整布局
      if (isCenter) {
        // 居中布局下，根据功能数量动态调整网格列数
        let dynamicGridClass = '';
        if (featureCount === 1) {
          dynamicGridClass = 'grid grid-cols-1 gap-6 mb-8';
        } else if (featureCount === 2) {
          dynamicGridClass = 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-8';
        } else if (featureCount === 3) {
          dynamicGridClass = 'grid grid-cols-1 md:grid-cols-3 gap-6 mb-8';
        } else {
          // 4个或更多使用2列布局保持卡片宽度
          dynamicGridClass = 'grid grid-cols-1 md:grid-cols-2 gap-6 mb-8';
        }
        
        return (
          <div className={dynamicGridClass}>
            {state.features.map((feature, index) => {
              const content = (
                <div className={`${featureStyle.background} backdrop-blur-sm ${featureStyle.border} ${featureStyle.padding} ${featureStyle.radius} hover:bg-white/15 transition-all duration-300 ${featureStyle.layout}`}>
                  <div className={`${featureStyle.icon} flex-shrink-0`}>{feature.icon}</div>
                  <div className={featureStyle.layout.includes('text-center') ? 'text-center' : ''}>
                    <StyledText variant="subtitle" element="h3" className={`${featureStyle.title} mb-2`}>{feature.title}</StyledText>
                    {feature.description && (
                      <StyledText variant="text" element="p" className={`${featureStyle.description} leading-relaxed`}>{feature.description}</StyledText>
                    )}
                  </div>
                </div>
              );
              return wrapFeature(feature, index, content);
            })}
          </div>
        );
      } else {
        // 非居中布局使用原有配置
        return (
          <div className={layout.features}>
            {state.features.map((feature, index) => {
              const content = (
                <div className={`${featureStyle.background} backdrop-blur-sm ${featureStyle.border} ${featureStyle.padding} ${featureStyle.radius} hover:bg-white/15 transition-all duration-300 ${featureStyle.layout}`}>
                  <div className={`${featureStyle.icon} flex-shrink-0`}>{feature.icon}</div>
                  <div className={featureStyle.layout.includes('text-center') ? 'text-center' : ''}>
                    <StyledText variant="subtitle" element="h3" className={`${featureStyle.title} mb-2`}>{feature.title}</StyledText>
                    {feature.description && (
                      <StyledText variant="text" element="p" className={`${featureStyle.description} leading-relaxed`}>{feature.description}</StyledText>
                    )}
                  </div>
                </div>
              );
              return wrapFeature(feature, index, content);
            })}
          </div>
        );
      }
    }
  };

  // 渲染活动信息
  const renderEvent = () => {
    const eventStyle = currentStyle.eventCard;
    const alignment = state.design.alignment;
    const eventAlignment = {
      'left': 'text-left',
      'center': 'text-center',
      'right': 'text-right'
    }[alignment];
    
    return (
      <div className={`${eventStyle.background} backdrop-blur-md ${eventStyle.border} ${eventStyle.padding} ${eventStyle.radius}`}>
        <div className={eventAlignment}>
          <StyledText variant="title" className={`${eventStyle.title} mb-3`}>{state.eventInfo.eventTitle}</StyledText>
          <StyledText variant="text" className={`${eventStyle.description} mb-4`}>{state.eventInfo.eventDescription}</StyledText>
          
          {state.eventInfo.discount && (
            <div className={`${eventStyle.discount} mb-4`}>{state.eventInfo.discount} OFF</div>
          )}
          
          {state.eventInfo.endDate && (
            <StyledText variant="text" className="text-sm mb-4 opacity-70">截止日期：{state.eventInfo.endDate}</StyledText>
          )}
          
          {state.eventInfo.promoCode && (
            <div className={`inline-block bg-white/20 rounded-lg px-4 py-2 ${alignment === 'center' ? 'mx-auto' : alignment === 'right' ? 'ml-auto' : ''}`}>
              <StyledText variant="text" className="text-xs mb-1 opacity-70">优惠码</StyledText>
              <StyledText variant="text" className="text-lg font-mono font-bold">{state.eventInfo.promoCode}</StyledText>
            </div>
          )}
        </div>
      </div>
    );
  };


  // 点击背景清空选择
  const handleBackgroundClick = (e) => {
    // 🔥 如果刚完成框选，跳过清空逻辑（防止框选后立即被清空）
    if (justFinishedSelecting) {
      console.log('🔲 刚完成框选，跳过背景点击清空');
      return;
    }

    // 检查是否点击的是背景（不是任何可拖拽元素）
    const isBackground = !e.target.closest('[data-draggable="true"]') &&
                        !e.target.closest('[data-editable="true"]') &&
                        !e.target.closest('.component-control') &&
                        !e.target.closest('.multi-selection-box');

    if (isBackground && state.selectedElements.length > 0) {
      console.log('✅ 点击背景，清空选择');
      clearSelection();
    }
  };

  // 框选功能 - 检查矩形碰撞
  const checkRectIntersection = (rect1, rect2) => {
    return !(
      rect1.right < rect2.left ||
      rect1.left > rect2.right ||
      rect1.bottom < rect2.top ||
      rect1.top > rect2.bottom
    );
  };

  // 框选开始
  const handleSelectionStart = (e) => {
    // 只在空白区域才开始框选
    const isBackground = !e.target.closest('[data-draggable="true"]') &&
                        !e.target.closest('[data-editable="true"]') &&
                        !e.target.closest('.component-control') &&
                        !e.target.closest('.multi-selection-box') &&
                        !e.target.closest('button');

    if (!isBackground) return;

    const isMultiSelect = e.ctrlKey || e.metaKey;
    if (!isMultiSelect) {
      clearSelection();
    }

    setIsSelecting(true);
    setSelectionStart({ x: e.clientX, y: e.clientY });
    setSelectionEnd({ x: e.clientX, y: e.clientY });

    console.log('🔲 框选开始:', { x: e.clientX, y: e.clientY });
  };

  // 框选移动 - 实时选中范围内的元素
  const handleSelectionMove = (e) => {
    if (!isSelecting) return;

    setSelectionEnd({ x: e.clientX, y: e.clientY });

    // 🔥 实时计算选框范围并选中元素
    const left = Math.min(selectionStart.x, e.clientX);
    const top = Math.min(selectionStart.y, e.clientY);
    const right = Math.max(selectionStart.x, e.clientX);
    const bottom = Math.max(selectionStart.y, e.clientY);
    const selectionRect = { left, top, right, bottom };

    // 检查哪些元素在选框内
    const allDraggables = document.querySelectorAll('[data-draggable="true"]');
    const elementsInRange = [];

    allDraggables.forEach(element => {
      const rect = element.getBoundingClientRect();

      if (checkRectIntersection(rect, selectionRect)) {
        // 1. 检查是否是 DynamicComponent
        const componentId = element.getAttribute('data-component-id');
        if (componentId) {
          const matchedComp = state.dynamicComponents.find(comp =>
            String(comp.id) === String(componentId)
          );
          if (matchedComp) {
            elementsInRange.push({
              type: 'element',
              id: `dynamicComponents-${matchedComp.id}-content`,
              path: `dynamicComponents.${matchedComp.id}.content`
            });
          }
          return;
        }

        // 2. 检查是否是 Editable 组件
        const editableId = element.getAttribute('data-editable-id');
        const editablePath = element.getAttribute('data-editable-path');
        if (editableId && editablePath) {
          elementsInRange.push({
            type: 'element',
            id: editableId,
            path: editablePath
          });
        }
      }
    });

    // 🔥 实时更新选中状态（批量选中）
    if (elementsInRange.length > 0) {
      // 先清空选择
      if (state.selectedElements.length > 0) {
        clearSelection();
      }
      // 批量选中范围内的元素
      elementsInRange.forEach((elem, index) => {
        // 第一个元素不使用多选模式（清空之前的选择），后续元素使用多选模式（追加）
        selectElement(elem.type, elem.id, elem.path, index > 0);
      });
    } else if (state.selectedElements.length > 0) {
      // 如果没有元素在范围内，清空选择
      clearSelection();
    }
  };

  // 框选结束
  const handleSelectionEnd = (e) => {
    if (!isSelecting) return;

    // 计算拖拽距离
    const dragDistance = Math.sqrt(
      Math.pow(e.clientX - selectionStart.x, 2) +
      Math.pow(e.clientY - selectionStart.y, 2)
    );

    // 如果拖拽距离小于 5px，认为是点击而非框选
    if (dragDistance < 5) {
      console.log('🔲 拖拽距离太小，取消框选');
      setIsSelecting(false);
      setSelectionStart(null);
      setSelectionEnd(null);
      return;
    }

    // 选中逻辑已经在 handleSelectionMove 中实时完成
    console.log('🔲 框选结束，已选中', state.selectedElements.length, '个元素');

    // 🔥 设置标志，防止后续 click 事件清空选择
    setJustFinishedSelecting(true);
    setTimeout(() => {
      setJustFinishedSelecting(false);
      console.log('🔲 清除框选完成标志');
    }, 150);  // 150ms 足够让 click 事件处理完成

    setIsSelecting(false);
    setSelectionStart(null);
    setSelectionEnd(null);
  };

  // 框选事件监听
  useEffect(() => {
    if (isSelecting) {
      document.addEventListener('mousemove', handleSelectionMove);
      document.addEventListener('mouseup', handleSelectionEnd);

      return () => {
        document.removeEventListener('mousemove', handleSelectionMove);
        document.removeEventListener('mouseup', handleSelectionEnd);
      };
    }
  }, [isSelecting, selectionStart]);

  // 键盘快捷键处理
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Delete/Backspace 键删除选中元素
      if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedElements.length > 0) {
        // 防止在输入框中删除
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        e.preventDefault();

        state.selectedElements.forEach(element => {
          // 检查是否是动态组件 - 修复：匹配任何 ID
          const match = element.id.match(/^dynamicComponents-(.+)-content$/);
          if (match) {
            const componentId = match[1];
            const component = state.dynamicComponents.find(c => String(c.id) === componentId);
            if (component) {
              deleteDynamicComponent(component.id);
            }
          } else {
            // Editable 元素，设置 display: none
            updateElementStyle(element.id, { display: 'none' });
          }
        });
        clearSelection();
      }

      // Escape 键清空选择
      if (e.key === 'Escape' && state.selectedElements.length > 0) {
        clearSelection();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedElements, clearSelection, updateElementStyle, deleteDynamicComponent, state.dynamicComponents]);

  // 计算裁剪区域
  const getClipPath = () => {
    if (!state.design.exportWidth || !state.design.exportHeight) {
      return 'none';
    }

    const canvasWidth = window.innerWidth - EXPORT_FRAME_MARGIN;
    const canvasHeight = window.innerHeight - EXPORT_FRAME_MARGIN;
    const scaleX = canvasWidth / state.design.exportWidth;
    const scaleY = canvasHeight / state.design.exportHeight;
    const baseScale = Math.min(scaleX, scaleY, 1);
    const autoScale = baseScale * EXPORT_FRAME_SCALE;
    const finalScale = autoScale * (state.design.exportScale || 1);

    const displayWidth = state.design.exportWidth * finalScale;
    const displayHeight = state.design.exportHeight * finalScale;

    const defaultX = window.innerWidth / 2;
    const defaultY = window.innerHeight / 2;
    const frameX = state.design.exportX !== null ? state.design.exportX : defaultX;
    const frameY = state.design.exportY !== null ? state.design.exportY : defaultY;

    const left = frameX - displayWidth / 2;
    const top = frameY - displayHeight / 2;
    const right = frameX + displayWidth / 2;
    const bottom = frameY + displayHeight / 2;

    return `inset(${top}px ${window.innerWidth - right}px ${window.innerHeight - bottom}px ${left}px)`;
  };

  return (
    <EditManager>
      {/* 全屏画布容器 */}
      <div
        data-canvas="true"
        data-editable-area="true"
        onClick={handleBackgroundClick}
        onMouseDown={handleSelectionStart}
        onContextMenu={(e) => {
          console.log('📍 React 合成事件触发 - onContextMenu', e.target);
        }}
        style={{
          position: 'relative',
          width: '100vw',
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        {/* Eye Toggle Button */}
        <button
          onClick={toggleToolbars}
          className="fixed top-5 right-5 z-50 w-10 h-10 bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 rounded-full flex items-center justify-center text-white transition-all duration-300 hover:scale-105"
          title={state.toolbarsVisible ? '隐藏工具栏' : '显示工具栏'}
        >
          {state.toolbarsVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>

        {/* 裁剪容器 - 包裹所有需要被裁剪的内容 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            clipPath: getClipPath()
          }}
        >
          {/* 手机模型 - 在最底层 */}
          {state.deviceType !== 'product-hunt' && (
            <div
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 1 }}
            >
              {state.deviceType === 'desktop' ? (
                <MacBookModel2D />
              ) : (
                state.modelType === '2d' ? <PhoneModel2D /> : <PhoneModel />
              )}
            </div>
          )}

          {/* ⚠️ 不再直接渲染模板，所有元素统一通过 dynamicComponents 管理 */}

          {/* 功能列表 - 暂时保留，未来也可以转换为 dynamicComponents */}
          {templateSupports(currentTemplate, 'features') && state.contentSections.features && renderFeatures()}

          {/* 活动信息 - 暂时保留，未来也可以转换为 dynamicComponents */}
          {templateSupports(currentTemplate, 'event') && state.contentSections.event && renderEvent()}

          {/* 动态组件 - 现在包含模板元素和右键添加的元素 */}
          {state.dynamicComponents.map((component) => (
            <DynamicComponent
              key={`${state.templateVersion}-${component.id}`}
              component={component}
            />
          ))}
        </div>

        {/* 右键菜单 */}
        <ContextMenu />

        {/* 框选组件 */}
        <SelectionBox
          start={selectionStart}
          end={selectionEnd}
          isActive={isSelecting}
        />

        {/* 多选边界框 */}
        <MultiSelectionBox />

        {/* 导出框预览 - 可拖拽和缩放 */}
        <ExportFrame />
      </div>
    </EditManager>
  );
}

export default MainContent;
