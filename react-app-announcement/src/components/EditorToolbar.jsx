import React from 'react';
import { ArrowLeft, Download, FileText, Palette, Smartphone, RectangleHorizontal, Grid3x3 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useDownload } from '../hooks/useDownload';

function EditorToolbar() {
  const { 
    state, 
    setCurrentPanel,
    setAppMode,
    toggleDownloadMenu,
    setModelType 
  } = useApp();
  
  const { downloadAs } = useDownload();

  const handleBackToHome = () => {
    setAppMode('home');
    setCurrentPanel('content'); // 重置面板状态
  };

  const handlePanelClick = (panel) => {
    setCurrentPanel(panel);
  };

  if (!state.toolbarsVisible) return null;

  return (
    <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 bg-white rounded-2xl p-2 shadow-sm border border-gray-100/50 flex items-center gap-1">
      {/* 返回首页按钮 */}
      <button 
        className="p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50/50"
        onClick={handleBackToHome}
        title="返回首页"
      >
        <ArrowLeft size={16} />
      </button>

      {/* 分隔线 */}
      <div className="w-px h-6 bg-gray-200 mx-2" />

      {/* 编辑面板按钮 */}
      <div className="flex">
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
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gray-600 rounded-full transition-all duration-300" />
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
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gray-600 rounded-full transition-all duration-300" />
          )}
        </button>

        <button
          className={`relative flex items-center gap-1.5 px-4 py-2.5 text-sm font-normal transition-all duration-300 ${
            state.currentPanel === 'templates'
              ? 'text-gray-700'
              : 'text-gray-400 hover:text-gray-600'
          }`}
          onClick={() => handlePanelClick('templates')}
        >
          <Grid3x3 size={15} />
          <span>模板</span>
          {state.currentPanel === 'templates' && (
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-gray-600 rounded-full transition-all duration-300" />
          )}
        </button>
      </div>

      {/* 分隔线 */}
      <div className="w-px h-6 bg-gray-200 mx-2" />

      {/* 右侧操作按钮 */}
      <div className="flex items-center gap-1">
        {/* 下载按钮 */}
        <div className="relative">
          <button 
            className="p-2.5 rounded-xl transition-all duration-200 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-50/50"
            onClick={toggleDownloadMenu}
            title="下载"
          >
            <Download size={16} />
          </button>
          
          {state.downloadMenuOpen && (
            <div className="absolute top-full right-0 mt-1.5 bg-white rounded-xl shadow-lg border border-gray-100/80 min-w-32 p-1.5 z-10">
              <button 
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50/70 transition-colors duration-200" 
                onClick={() => {
                  downloadAs('png');
                  toggleDownloadMenu();
                }}
              >
                <span>PNG 图片</span>
              </button>
              <button 
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50/70 transition-colors duration-200" 
                onClick={() => {
                  downloadAs('pdf');
                  toggleDownloadMenu();
                }}
              >
                <span>PDF 文档</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditorToolbar;