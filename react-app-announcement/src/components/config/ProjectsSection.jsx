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
      <div className="config-group">
        <div className="config-group-label">已保存的作品</div>
        <div className="projects-list" id="projectsList">
          {state.projects.length === 0 ? (
            <div className="no-projects">
              <FolderX size={24} />
              <span>暂无保存的作品</span>
            </div>
          ) : (
            state.projects.map((project) => (
              <div 
                key={project.id}
                className="project-item"
                onClick={() => handleLoadProject(project)}
              >
                <div className="project-thumbnail">
                  {project.thumbnail ? (
                    <img src={project.thumbnail} alt={project.name} />
                  ) : (
                    <div className="project-placeholder">
                      {project.appInfo?.name?.charAt(0) || 'P'}
                    </div>
                  )}
                </div>
                <div className="project-info">
                  <div className="project-name">{project.name}</div>
                  <div className="project-date">
                    {new Date(project.createdAt).toLocaleDateString('zh-CN')}
                  </div>
                </div>
                <div className="project-actions">
                  <button 
                    className="project-action-btn edit"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLoadProject(project);
                    }}
                    title="编辑"
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    className="project-action-btn delete"
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