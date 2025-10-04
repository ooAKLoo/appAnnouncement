import React from 'react';
import { useApp } from '../context/AppContext';
import EditorToolbar from './EditorToolbar';
import {
  ContentPanel,
  DesignPanel,
  TemplatesPanel,
  StylePanel,
  ProjectsPanel,
  ImageSidebar,
  AssetsLibraryPanel
} from './sidebars';
import MainContent from './MainContent';
import BackgroundDecorations from './BackgroundDecorations';
import SaveDialog from './SaveDialog';
import ConfirmDialog from './ConfirmDialog';
import CreateProjectModal from './CreateProjectModal';
import HomePage from './HomePage';
import TemplateCodePanel from './TemplateCodePanel';

function NewMainInterface() {
  console.log('🖥️ NewMainInterface 渲染中...');
  const { state, setCurrentPanel } = useApp();

  console.log('📊 NewMainInterface state:', {
    appMode: state.appMode,
    toolbarsVisible: state.toolbarsVisible,
    currentPanel: state.currentPanel
  });

  // 如果在首页模式，显示首页
  if (state.appMode === 'home') {
    console.log('🏠 显示首页');
    return <HomePage />;
  }

  console.log('📝 显示编辑器界面');

  const backgroundStyle = {
    background: state.design.colorMode === 'solid' 
      ? state.design.bgColor
      : `linear-gradient(${state.design.gradientAngle}, ${state.design.bgColor} 0%, ${state.design.gradientColor} 100%)`
  };

  return (
    <div className="relative min-h-screen overflow-hidden" style={backgroundStyle}>
      {/* 编辑模式下显示 EditorToolbar */}
      <EditorToolbar />
      
      {/* 侧边面板系统 */}
      <ContentPanel isActive={state.toolbarsVisible && state.currentPanel === 'content'} />
      <DesignPanel isActive={state.toolbarsVisible && state.currentPanel === 'design'} />
      <TemplatesPanel isActive={state.toolbarsVisible && state.currentPanel === 'templates'} />

      {/* 新的统一资源库面板 */}
      <AssetsLibraryPanel
        isActive={state.toolbarsVisible && state.currentPanel === 'assets'}
        initialTab={state.assetsLibraryTab || 'stickers'}
      />

      {/* 样式编辑面板 - 当选中元素且面板为style时显示 */}
      <StylePanel isActive={state.toolbarsVisible && state.currentPanel === 'style' && state.selectedElement !== null} />

      {/* 图片编辑面板 - 当选中图片元素且面板为image时显示 */}
      <ImageSidebar isActive={state.toolbarsVisible && state.currentPanel === 'image' && state.selectedElement !== null} />

      {/* 项目面板 - 基于 currentTab 状态 */}
      <ProjectsPanel isActive={state.toolbarsVisible && state.currentTab === 'projects'} />
      
      {/* 主内容区域 */}
      <div className="transition-all duration-300 pt-0">
        <BackgroundDecorations />
        <MainContent />
      </div>

      {/* 对话框 */}
      <SaveDialog />
      <ConfirmDialog />
      <CreateProjectModal />

      {/* 模板代码预览面板 */}
      <TemplateCodePanel />

      {/* 快捷键提示 */}
      {state.toolbarsVisible && !state.templateEditMode && (
        <div className="fixed bottom-4 right-4 bg-black/80 text-white text-xs px-3 py-2 rounded-lg backdrop-blur-sm">
          <div className="flex items-center gap-4">
            <span>按 <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-xs">H</kbd> 隐藏界面</span>
            <span>按 <kbd className="bg-white/20 px-1.5 py-0.5 rounded text-xs">Space</kbd> 预览</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default NewMainInterface;