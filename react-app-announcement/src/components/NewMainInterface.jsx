import React from 'react';
import { useApp } from '../context/AppContext';
import EditorToolbar from './EditorToolbar';
import ContentPanel from './panels/ContentPanel';
import DesignPanel from './panels/DesignPanel';
import TemplatesPanel from './panels/TemplatesPanel';
import LayoutPanel from './panels/LayoutPanel';
import StylePanel from './panels/StylePanel';
import ProjectsPanel from './ProjectsPanel';
import MainContent from './MainContent';
import BackgroundDecorations from './BackgroundDecorations';
import SaveDialog from './SaveDialog';
import ConfirmDialog from './ConfirmDialog';
import CreateProjectModal from './CreateProjectModal';
import HomePage from './HomePage';

function NewMainInterface() {
  const { state } = useApp();
  
  // 如果在首页模式，显示首页
  if (state.appMode === 'home') {
    return <HomePage />;
  }

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
      <LayoutPanel isActive={state.toolbarsVisible && state.currentPanel === 'layout'} />
      
      {/* 样式编辑面板 - 当选中元素且面板为style时显示 */}
      <StylePanel isActive={state.toolbarsVisible && state.currentPanel === 'style' && state.selectedElement !== null} />
      
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

      {/* 快捷键提示 */}
      {state.toolbarsVisible && (
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