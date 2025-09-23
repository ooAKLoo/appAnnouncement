import React, { useEffect, useRef } from 'react';
import { Menu, FilePlus, Folder, LayoutTemplate, Smartphone, Palette, Download, ChevronDown, Image, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useDownload } from '../hooks/useDownload';

function TopToolbar() {
  const { 
    state, 
    setCurrentTab, 
    toggleProjectMenu, 
    toggleDownloadMenu 
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
    setCurrentTab(tab);
  };

  const handleCreateNewProject = () => {
    if (confirm('确定要创建新项目吗？当前未保存的更改将丢失。')) {
      window.location.reload();
    }
  };

  const handleSwitchToProjects = () => {
    setCurrentTab('projects');
    toggleProjectMenu();
  };

  return (
    <div className="top-toolbar" ref={toolbarRef}>
      <div className="menu-dropdown">
        <button 
          className="menu-btn-main" 
          onClick={toggleProjectMenu}
        >
          <Menu className="menu-icon" size={16} />
        </button>
        {state.projectMenuOpen && (
          <div className={`project-menu ${state.projectMenuOpen ? 'show' : ''}`} id="projectMenu">
            <button 
              className="menu-option" 
              onClick={handleCreateNewProject}
            >
              <FilePlus size={16} />
              <span>新建</span>
            </button>
            <button 
              className="menu-option" 
              data-tab="projects" 
              onClick={handleSwitchToProjects}
            >
              <Folder size={16} />
              <span>我的作品</span>
            </button>
          </div>
        )}
      </div>
      
      <div className="toolbar-left">
        <button 
          className={`toolbar-tab ${state.currentTab === 'template' ? 'active' : ''}`}
          data-tab="template"
          onClick={() => handleTabClick('template')}
        >
          <LayoutTemplate className="toolbar-tab-icon" size={16} />
          <span>模板</span>
        </button>
        <button 
          className={`toolbar-tab ${state.currentTab === 'app' ? 'active' : ''}`}
          data-tab="app"
          onClick={() => handleTabClick('app')}
        >
          <Smartphone className="toolbar-tab-icon" size={16} />
          <span>APP配置</span>
        </button>
        <button 
          className={`toolbar-tab ${state.currentTab === 'design' ? 'active' : ''}`}
          data-tab="design"
          onClick={() => handleTabClick('design')}
        >
          <Palette className="toolbar-tab-icon" size={16} />
          <span>设计</span>
        </button>
      </div>
      
      <div className="toolbar-right">
        <div className="download-dropdown">
          <button 
            className="download-btn-main" 
            onClick={toggleDownloadMenu}
          >
            <Download className="download-icon" size={16} />
            <span>下载</span>
            <ChevronDown className="chevron-icon" size={16} />
          </button>
          {state.downloadMenuOpen && (
            <div className={`download-menu ${state.downloadMenuOpen ? 'show' : ''}`} id="downloadMenu">
              <button 
                className="download-option" 
                onClick={() => downloadAs('png')}
              >
                <Image size={16} />
                <span>PNG 图片</span>
              </button>
              <button 
                className="download-option" 
                onClick={() => downloadAs('jpg')}
              >
                <Image size={16} />
                <span>JPG 图片</span>
              </button>
              <button 
                className="download-option" 
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