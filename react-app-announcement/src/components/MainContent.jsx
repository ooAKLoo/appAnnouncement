import React, { useEffect } from 'react';
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

function MainContent() {
  console.log('🏠 MainContent 渲染中...');
  const { state, toggleToolbars, reorderFeatures, showContextMenu, hideContextMenu, clearSelection, updateElementStyle, deleteDynamicComponent } = useApp();

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
    // 检查是否点击的是背景（不是任何可拖拽元素）
    const isBackground = !e.target.closest('[data-draggable="true"]') &&
                        !e.target.closest('[data-editable="true"]') &&
                        !e.target.closest('.component-control');

    if (isBackground && state.selectedElements.length > 0) {
      clearSelection();
    }
  };

  // 键盘快捷键处理
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Delete/Backspace 键删除选中元素
      if ((e.key === 'Delete' || e.key === 'Backspace') && state.selectedElements.length > 0) {
        // 防止在输入框中删除
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        e.preventDefault();

        state.selectedElements.forEach(element => {
          // 检查是否是动态组件
          const match = element.id.match(/^dynamicComponents-(\d+)-content$/);
          if (match) {
            const componentId = parseInt(match[1]);
            const component = state.dynamicComponents.find(c => c.id === componentId);
            if (component) {
              deleteDynamicComponent(componentId);
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

  return (
    <EditManager>
      {/* 全屏画布容器 */}
      <div
        data-canvas="true"
        data-editable-area="true"
        onClick={handleBackgroundClick}
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

        {/* 右键菜单 */}
        <ContextMenu />
      </div>
    </EditManager>
  );
}

export default MainContent;
