import React, { useEffect, useRef } from 'react';
import { Menu, FilePlus, Folder, LayoutTemplate, Smartphone, Palette, Download, ChevronDown, Image, FileText, Box, RectangleHorizontal } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useDownload } from '../hooks/useDownload';

function TopToolbar() {
  const { 
    state, 
    setCurrentTab, 
    setCurrentPanel,
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

  const handlePanelClick = (panel) => {
    // 关闭所有下拉菜单
    if (state.projectMenuOpen) {
      toggleProjectMenu();
    }
    if (state.downloadMenuOpen) {
      toggleDownloadMenu();
    }
    
    // 设置当前面板
    setCurrentPanel(panel);
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
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-2xl p-2 shadow-sm border border-gray-100/50 flex items-center gap-1" ref={toolbarRef}>
      {/* Left - Menu Dropdown */}
      <div className="relative">
        <button 
          className={`p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center ${
            state.projectMenuOpen 
              ? 'bg-gray-50 text-gray-700' 
              : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50/50'
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
          <Menu size={16} className={state.projectMenuOpen ? 'text-gray-600' : 'text-gray-400'} />
        </button>
        {state.projectMenuOpen && (
          <div className="absolute top-full left-0 mt-1.5 bg-white rounded-xl shadow-lg border border-gray-100/80 min-w-36 p-1.5 opacity-100 visible transform translate-y-0 transition-all duration-200 z-10">
            <button 
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50/70 transition-colors duration-200" 
              onClick={handleCreateNewProject}
            >
              <FilePlus size={15} />
              <span>新建</span>
            </button>
            <button 
              className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50/70 transition-colors duration-200" 
              onClick={handleSwitchToProjects}
            >
              <Folder size={15} />
              <span>我的作品</span>
            </button>
          </div>
        )}
      </div>
      
      {/* Center - Navigation Tabs */}
      <div className="flex mx-2">
        <button 
          className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-normal transition-all duration-300 ${
            state.currentPanel === 'content' 
              ? 'text-gray-700' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
          onClick={() => handlePanelClick('content')}
        >
          <FileText size={15} />
          <span>内容</span>
          {state.currentPanel === 'content' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700 rounded-full transition-all duration-300" />
          )}
        </button>
        <button 
          className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-normal transition-all duration-300 ${
            state.currentPanel === 'design' 
              ? 'text-gray-700' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
          onClick={() => handlePanelClick('design')}
        >
          <Palette size={15} />
          <span>设计</span>
          {state.currentPanel === 'design' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700 rounded-full transition-all duration-300" />
          )}
        </button>
        <button 
          className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-normal transition-all duration-300 ${
            state.currentPanel === 'assets' 
              ? 'text-gray-700' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
          onClick={() => handlePanelClick('assets')}
        >
          <Image size={15} />
          <span>素材</span>
          {state.currentPanel === 'assets' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700 rounded-full transition-all duration-300" />
          )}
        </button>
        <button 
          className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-normal transition-all duration-300 ${
            state.currentPanel === 'layout' 
              ? 'text-gray-700' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
          onClick={() => handlePanelClick('layout')}
        >
          <LayoutTemplate size={15} />
          <span>布局</span>
          {state.currentPanel === 'layout' && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-700 rounded-full transition-all duration-300" />
          )}
        </button>
      </div>
      
      
      {/* Right - Download Dropdown */}
      <div className="flex items-center">
        <div className="relative">
          <button 
            className={`flex items-center gap-1.5 px-3 py-2.5 rounded-xl transition-all duration-200 text-sm font-normal ${
              state.downloadMenuOpen 
                ? 'bg-gray-50 text-gray-700' 
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50/50'
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
            <Download size={15} />
            <span>下载</span>
            <ChevronDown size={12} className={`transform transition-transform duration-200 ${state.downloadMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          {state.downloadMenuOpen && (
            <div className="absolute top-full right-0 mt-1.5 bg-white rounded-xl shadow-lg border border-gray-100/80 min-w-36 p-1.5 opacity-100 visible transform translate-y-0 transition-all duration-200 z-10">
              <button 
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50/70 transition-colors duration-200" 
                onClick={() => downloadAs('png')}
              >
                <Image size={15} />
                <span>PNG 图片</span>
              </button>
              <button 
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50/70 transition-colors duration-200" 
                onClick={() => downloadAs('jpg')}
              >
                <Image size={15} />
                <span>JPG 图片</span>
              </button>
              <button 
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50/70 transition-colors duration-200" 
                onClick={() => downloadAs('pdf')}
              >
                <FileText size={15} />
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