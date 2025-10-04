import React from 'react';
import { useApp } from '../context/AppContext';
import EditorToolbar from './EditorToolbar';
import {
  ContentPanel,
  DesignPanel,
  TemplatesPanel,
  StylePanel,
  ComponentPropertiesPanel,
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
import { Particles } from '../lib/magicui/particles';
import { DotPattern } from '../lib/magicui/dot-pattern';
import { GridBackground } from '../lib/magicui/grid-background';
import { Globe } from '../lib/magicui/globe';
import { DottedMap } from '../lib/magicui/dotted-map';
import { Spotlight } from '../lib/magicui/spotlight';

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
      {/* 背景效果层 */}
      {state.design.backgroundEffect === 'particles' && (
        <Particles
          className="absolute inset-0 z-0"
          quantity={100}
          ease={80}
          color={state.typography.textColor || '#000000'}
          refresh
        />
      )}
      {state.design.backgroundEffect === 'dotPattern' && (
        <DotPattern
          className="absolute inset-0 z-0 [mask-image:radial-gradient(500px_circle_at_center,white,transparent)]"
        />
      )}
      {state.design.backgroundEffect === 'grid' && (
        <div className="absolute inset-0 z-0">
          <GridBackground
          gridSize={20}
            gridColor={state.typography.textColor || '#e4e4e7'}
          />
        </div>
      )}
      {state.design.backgroundEffect === 'globe' && (
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
          <div className="relative w-[600px] h-[600px] flex items-center justify-center">
            <Globe className="absolute top-0" />
            <div className="pointer-events-none absolute inset-0 h-full " />
            {/* <div className="pointer-events-none absolute inset-0 h-full bg-[radial-gradient(circle_at_50%_200%,rgba(0,0,0,0.1),rgba(255,255,255,0))]" /> */}
          </div>
        </div>
      )}
      {state.design.backgroundEffect === 'dottedMap' && (
        <div className="absolute inset-0 z-0 flex items-center justify-center overflow-hidden opacity-30">
          <DottedMap
            width={200}
            height={100}
            mapSamples={6000}
            dotRadius={0.3}
            dotColor={state.typography.textColor || '#000000'}
            markerColor="#3b82f6"
            markers={[
              { lat: 40.7128, lng: -74.006, size: 0.8 },  // 纽约
              { lat: 51.5074, lng: -0.1278, size: 0.8 },  // 伦敦
              { lat: 39.9042, lng: 116.4074, size: 0.8 }, // 北京
              { lat: 35.6762, lng: 139.6503, size: 0.8 }, // 东京
              { lat: 37.5665, lng: 126.9780, size: 0.8 }, // 首尔
            ]}
            className="w-full h-auto"
          />
        </div>
      )}
      {state.design.backgroundEffect === 'spotlight' && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Spotlight
            className="-top-40 left-0 md:-top-20 md:left-60"
            fill="white"
          />
        </div>
      )}

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

      {/* 组件内容编辑面板 - 当选中组件且面板为component时显示 */}
      <ComponentPropertiesPanel isActive={state.toolbarsVisible && state.currentPanel === 'component' && state.selectedElement !== null} />

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