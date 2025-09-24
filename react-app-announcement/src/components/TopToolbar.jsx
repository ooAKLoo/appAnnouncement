import React, { useEffect, useRef } from 'react';
import { Menu, FilePlus, Folder, LayoutTemplate, Smartphone, Palette, Download, ChevronDown, Image, FileText, Box, RectangleHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useDownload } from '../hooks/useDownload';

function TopToolbar() {
  const { 
    state, 
    setCurrentTab, 
    toggleConfigPanel,
    toggleProjectMenu, 
    toggleDownloadMenu,
    openCreateProjectModal,
    setModelType 
  } = useApp();
  
  const { downloadAs } = useDownload();
  const toolbarRef = useRef(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (toolbarRef.current && !toolbarRef.current.contains(event.target)) {
        // Close any open menus by dispatching close actions if they're open
        if (state.projectMenuOpen) {
          toggleProjectMenu();
        }
        if (state.downloadMenuOpen) {
          toggleDownloadMenu();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [state.projectMenuOpen, state.downloadMenuOpen, toggleProjectMenu, toggleDownloadMenu]);

  const handleTabClick = (tab) => {
    // 关闭所有下拉菜单
    if (state.projectMenuOpen) {
      toggleProjectMenu();
    }
    if (state.downloadMenuOpen) {
      toggleDownloadMenu();
    }
    
    // 如果点击当前已选中的tab，则取消选中
    if (state.currentTab === tab && state.configPanelOpen) {
      toggleConfigPanel(); // 关闭面板，同时会清除currentTab
    } else {
      setCurrentTab(tab);
      // 自动打开配置面板
      if (!state.configPanelOpen) {
        toggleConfigPanel();
      }
    }
  };

  const handleCreateNewProject = () => {
    toggleProjectMenu(); // 关闭菜单
    openCreateProjectModal(); // 打开创建项目弹窗
  };

  const handleSwitchToProjects = () => {
    setCurrentTab('projects');
    toggleProjectMenu();
    // 如果配置面板未打开，则打开它
    if (!state.configPanelOpen) {
      toggleConfigPanel();
    }
  };

  if (!state.toolbarsVisible) return null;

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 backdrop-blur-xl rounded-xl p-2 shadow-lg border border-white/20 flex items-center gap-3" ref={toolbarRef}>
      {/* Left - Menu Dropdown */}
      <div className="relative">
        <button 
          className={`p-2.5 rounded-lg transition-colors duration-200 flex items-center justify-center ${
            state.projectMenuOpen 
              ? 'bg-primary-blue text-white shadow-md shadow-primary-blue/30' 
              : 'bg-transparent hover:bg-black/5'
          }`}
          onClick={() => {
            // 关闭下载菜单
            if (state.downloadMenuOpen) {
              toggleDownloadMenu();
            }
            // 清除当前选中的标签
            if (state.currentTab && state.configPanelOpen) {
              toggleConfigPanel();
            }
            toggleProjectMenu();
          }}
        >
          <Menu size={16} className={state.projectMenuOpen ? 'text-white' : 'text-gray-600'} />
        </button>
        {state.projectMenuOpen && (
          <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 min-w-36 p-2 opacity-100 visible transform translate-y-0 transition-all duration-200 z-10">
            <button 
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200" 
              onClick={handleCreateNewProject}
            >
              <FilePlus size={16} />
              <span>新建</span>
            </button>
            <button 
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200" 
              onClick={handleSwitchToProjects}
            >
              <Folder size={16} />
              <span>我的作品</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Center - Navigation Tabs */}
      <div className="flex gap-1">
        <button 
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-w-20 justify-center ${
            state.currentTab === 'template' 
              ? 'bg-primary-blue text-white shadow-md shadow-primary-blue/30' 
              : 'text-gray-600 hover:bg-black/5'
          }`}
          onClick={() => handleTabClick('template')}
        >
          <LayoutTemplate size={16} />
          <span>模板</span>
        </button>
        <button 
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-w-20 justify-center ${
            state.currentTab === 'app' 
              ? 'bg-primary-blue text-white shadow-md shadow-primary-blue/30' 
              : 'text-gray-600 hover:bg-black/5'
          }`}
          onClick={() => handleTabClick('app')}
        >
          <Smartphone size={16} />
          <span>APP配置</span>
        </button>
        <button 
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 min-w-20 justify-center ${
            state.currentTab === 'design' 
              ? 'bg-primary-blue text-white shadow-md shadow-primary-blue/30' 
              : 'text-gray-600 hover:bg-black/5'
          }`}
          onClick={() => handleTabClick('design')}
        >
          <Palette size={16} />
          <span>设计</span>
        </button>
      </div>
      
      {/* Model Type Toggle */}
      <div className="flex items-center gap-1 bg-gray-100/80 rounded-lg p-1">
        <button
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
            state.modelType === '3d' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setModelType('3d')}
        >
          <Box size={14} />
          <span>3D</span>
        </button>
        <button
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200 ${
            state.modelType === '2d' 
              ? 'bg-white text-gray-900 shadow-sm' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setModelType('2d')}
        >
          <RectangleHorizontal size={14} />
          <span>2D</span>
        </button>
      </div>
      
      {/* Right - Download Dropdown */}
      <div className="flex items-center">
        <div className="relative">
          <button 
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium ${
              state.downloadMenuOpen 
                ? 'bg-primary-blue text-white shadow-md shadow-primary-blue/30' 
                : 'bg-transparent hover:bg-black/5 text-gray-600'
            }`}
            onClick={() => {
              // 关闭项目菜单
              if (state.projectMenuOpen) {
                toggleProjectMenu();
              }
              // 清除当前选中的标签
              if (state.currentTab && state.configPanelOpen) {
                toggleConfigPanel();
              }
              toggleDownloadMenu();
            }}
          >
            <Download size={16} />
            <span>下载</span>
            <ChevronDown size={12} className={`transform transition-transform duration-200 ${state.downloadMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {state.downloadMenuOpen && (
            <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 min-w-36 p-2 opacity-100 visible transform translate-y-0 transition-all duration-200 z-10">
              <button 
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200" 
                onClick={() => downloadAs('png')}
              >
                <Image size={16} />
                <span>PNG 图片</span>
              </button>
              <button 
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200" 
                onClick={() => downloadAs('jpg')}
              >
                <Image size={16} />
                <span>JPG 图片</span>
              </button>
              <button 
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-200" 
                onClick={() => downloadAs('pdf')}
              >
                <FileText size={16} />
                <span>PDF 文档</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TopToolbar;