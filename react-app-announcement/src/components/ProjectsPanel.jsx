import React from 'react';
import { Folder, Trash2, FileText, Download, Upload, Play } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useProjects } from '../hooks/useProjects';

function ProjectsPanel({ isActive }) {
  const { state, openConfirmDialog } = useApp();
  const { loadProject, exportProject, importProject } = useProjects();

  if (!isActive) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleImportProject = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (file) {
        try {
          await importProject(file);
          alert('项目导入成功！');
        } catch (error) {
          console.error('Error importing project:', error);
          alert('导入失败，请检查文件格式');
        }
      }
    };
    input.click();
  };

  return (
    <div className="fixed left-4 top-20 bottom-4 w-80 bg-white rounded-xl shadow-xl border border-gray-200/50 flex flex-col overflow-hidden z-50">
      {/* Header */}
      <div className="sticky top-0 bg-white px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
            <Folder size={20} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">我的作品</h2>
            <p className="text-sm text-gray-500">共 {state.projects.length} 个项目</p>
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleImportProject}
            className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-lg transition-colors"
          >
            <Upload size={14} />
            导入
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {state.projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center py-12">
            <FileText size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500">还没有作品</p>
            <p className="text-sm text-gray-400 mt-2">点击顶部"新建"创建第一个项目</p>
          </div>
        ) : (
          <div className="space-y-3">
            {state.projects.map((project) => (
              <div
                key={project.id}
                className="group relative bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all"
              >
                {/* 缩略图 */}
                {project.thumbnail ? (
                  <div className="w-full h-32 bg-gray-100">
                    <img
                      src={project.thumbnail}
                      alt={project.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full h-32 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                    <FileText size={32} className="text-gray-400" />
                  </div>
                )}

                {/* 项目信息 */}
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 truncate mb-1">
                    {project.name}
                  </h3>
                  <p className="text-xs text-gray-500">
                    {formatDate(project.createdAt)}
                  </p>
                  
                  {/* 操作按钮区域 */}
                  <div className="flex items-center gap-2 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => loadProject(project)}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-md transition-colors"
                    >
                      <Play size={12} />
                      打开
                    </button>
                    <button
                      onClick={() => exportProject(project)}
                      className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-md transition-colors"
                    >
                      <Download size={12} />
                      导出
                    </button>
                  </div>
                </div>

                {/* 删除按钮 */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openConfirmDialog(project.id);
                  }}
                  className="absolute top-2 right-2 p-2 bg-white/90 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                >
                  <Trash2 size={14} className="text-red-600" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProjectsPanel;