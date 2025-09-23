import React from 'react';
import { FolderX, Edit, Trash2 } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useProjects } from '../../hooks/useProjects';
import ConfigPanel from '../common/ConfigPanel';

function ProjectsSection({ isActive }) {
  const { state, openConfirmDialog } = useApp();
  const { loadProject } = useProjects();

  const handleLoadProject = (project) => {
    loadProject(project);
  };

  const handleDeleteProject = (projectId, e) => {
    e.stopPropagation();
    openConfirmDialog(projectId);
  };

  return (
    <ConfigPanel type="projects" isActive={isActive}>
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-600 mb-4">已保存的作品</div>
        <div className="space-y-3" id="projectsList">
          {state.projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-gray-500">
              <FolderX size={24} className="mb-2" />
              <span className="text-sm">暂无保存的作品</span>
            </div>
          ) : (
            state.projects.map((project) => (
              <div 
                key={project.id}
                className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm cursor-pointer transition-all duration-200"
                onClick={() => handleLoadProject(project)}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600 font-medium text-lg">
                      {project.appInfo?.name?.charAt(0) || 'P'}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-800 truncate">{project.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(project.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button 
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-blue-50 text-blue-600 hover:text-blue-700 transition-colors duration-200"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLoadProject(project);
                    }}
                    title="编辑"
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-50 text-red-600 hover:text-red-700 transition-colors duration-200"
                    onClick={(e) => handleDeleteProject(project.id, e)}
                    title="删除"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </ConfigPanel>
  );
}

export default ProjectsSection;