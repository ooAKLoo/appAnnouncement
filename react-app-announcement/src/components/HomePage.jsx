import React, { useEffect } from 'react';
import { Plus, FileText, Play, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useProjects } from '../hooks/useProjects';
import { projectStorage } from '../utils/storage';
import CreateProjectModal from './CreateProjectModal';

function HomePage() {
  const { state, openCreateProjectModal, setProjects } = useApp();
  const { loadProject, deleteProjectById } = useProjects();

  // 🔥 每次进入首页时重新加载项目列表，确保显示最新数据
  useEffect(() => {
    const reloadProjects = async () => {
      try {
        const projects = await projectStorage.loadProjects();
        setProjects(projects);
        console.log('🔄 首页刷新项目列表:', projects.length);
      } catch (error) {
        console.error('❌ 刷新项目列表失败:', error);
      }
    };

    reloadProjects();
  }, [setProjects]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleLoadProject = async (project) => {
    try {
      await loadProject(project);
    } catch (error) {
      console.error('加载项目失败:', error);
    }
  };

  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation(); // 阻止触发项目加载
    
    // 先弹出确认对话框，确认后再删除
    const confirmed = confirm('确定要删除这个项目吗？此操作无法撤销。');
    
    if (confirmed) {
      try {
        await deleteProjectById(projectId);
      } catch (error) {
        console.error('删除项目失败:', error);
        alert('删除失败，请重试');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <img 
              src="/postory-icon.png" 
              alt="Postory" 
              className="w-16 h-16 rounded-2xl shadow-lg"
            />
            <h1 className="text-4xl font-bold text-gray-900">Postory</h1>
          </div>
          <p className="text-gray-600 text-lg">创造你的故事，分享你的精彩</p>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          {state.projects.length === 0 ? (
            // 空状态
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <FileText size={36} className="text-blue-600" />
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">开始创建你的第一个项目</h2>
              <p className="text-gray-600 mb-8">设计精美的应用宣传页面</p>
              <button
                onClick={openCreateProjectModal}
                className="inline-flex items-center gap-3 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 text-lg font-medium"
              >
                <Plus size={24} />
                新建项目
              </button>
            </div>
          ) : (
            // 项目列表
            <div>
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-semibold text-gray-900">我的项目</h2>
                <button
                  onClick={openCreateProjectModal}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
                >
                  <Plus size={18} />
                  新建
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {state.projects.map((project) => (
                  <div
                    key={project.id}
                    onClick={() => handleLoadProject(project)}
                    className="group cursor-pointer bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-200 transition-all duration-200"
                  >
                    {/* 缩略图 */}
                    <div className="aspect-video bg-gray-100 relative overflow-hidden">
                      {project.thumbnail ? (
                        <img
                          src={project.thumbnail}
                          alt={project.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <FileText size={32} className="text-gray-400" />
                        </div>
                      )}
                      
                      {/* 悬停效果 */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="bg-white/90 rounded-full p-3">
                            <Play size={20} className="text-gray-900" />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* 项目信息 */}
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate mb-2">
                            {project.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {formatDate(project.createdAt)}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDeleteProject(e, project.id)}
                          className="ml-2 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200"
                          title="删除项目"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 创建项目模态框 */}
      <CreateProjectModal />
    </div>
  );
}

export default HomePage;