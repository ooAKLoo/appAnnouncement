import React, { useEffect, useState } from 'react';
import { Plus, FileText, Play, Trash2, MoreVertical, Copy, Edit2, Folder } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useProjects } from '../hooks/useProjects';
import { projectStorage } from '../utils/storage';
import CreateProjectModal from './CreateProjectModal';

function HomePage() {
  const { state, openCreateProjectModal, setProjects } = useApp();
  const { loadProject, deleteProjectById, renameProjectById, duplicateProjectById } = useProjects();
  const [openMenuId, setOpenMenuId] = useState(null);
  const [renamingId, setRenamingId] = useState(null);
  const [newName, setNewName] = useState('');
  const [expandedGroupId, setExpandedGroupId] = useState(null);

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

  // 点击外部关闭菜单
  useEffect(() => {
    const handleClickOutside = () => {
      if (openMenuId !== null) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openMenuId]);

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
        setOpenMenuId(null);
      } catch (error) {
        console.error('删除项目失败:', error);
        alert('删除失败，请重试');
      }
    }
  };

  const handleRename = async (e, projectId) => {
    e.stopPropagation();
    const project = state.projects.find(p => p.id === projectId);
    if (project) {
      setRenamingId(projectId);
      setNewName(project.name);
      setOpenMenuId(null);
    }
  };

  const handleRenameSubmit = async (e, projectId) => {
    e.preventDefault();
    e.stopPropagation();

    if (newName.trim()) {
      try {
        await renameProjectById(projectId, newName.trim());
        setRenamingId(null);
        setNewName('');
      } catch (error) {
        console.error('重命名失败:', error);
      }
    }
  };

  const handleDuplicate = async (e, projectId) => {
    e.stopPropagation();
    try {
      await duplicateProjectById(projectId);
      setOpenMenuId(null);
    } catch (error) {
      console.error('复制失败:', error);
    }
  };

  const toggleMenu = (e, projectId) => {
    e.stopPropagation();
    setOpenMenuId(openMenuId === projectId ? null : projectId);
  };

  // 对项目进行分组
  const groupProjects = () => {
    const groups = {};

    state.projects.forEach(project => {
      if (project.groupId) {
        if (!groups[project.groupId]) {
          groups[project.groupId] = [];
        }
        groups[project.groupId].push(project);
      } else {
        // 没有 groupId 的项目单独成组
        groups[project.id] = [project];
      }
    });

    // 对每个组内的项目按版本号排序
    Object.keys(groups).forEach(groupId => {
      groups[groupId].sort((a, b) => (b.versionNumber || 0) - (a.versionNumber || 0));
    });

    return groups;
  };

  const handleGroupClick = (groupId, projects) => {
    if (projects.length === 1) {
      // 单个项目直接加载
      handleLoadProject(projects[0]);
    } else {
      // 多个版本展开/折叠
      setExpandedGroupId(expandedGroupId === groupId ? null : groupId);
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
                {Object.entries(groupProjects()).map(([groupId, projects]) => {
                  const isExpanded = expandedGroupId === groupId;
                  const hasMultipleVersions = projects.length > 1;
                  const latestProject = projects[0]; // 最新版本

                  return (
                    <div key={groupId} className="relative">
                      {/* 主卡片（堆叠效果） */}
                      {!isExpanded && (
                        <>
                          {/* 堆叠背景层 - 仅在有多版本时显示 */}
                          {hasMultipleVersions && (
                            <>
                              <div className="absolute top-2 left-2 right-2 h-full bg-white rounded-2xl border border-gray-200 -z-10"></div>
                              <div className="absolute top-4 left-4 right-4 h-full bg-white rounded-2xl border border-gray-100 -z-20"></div>
                            </>
                          )}

                        <div
                          onClick={() => handleGroupClick(groupId, projects)}
                          className="group cursor-pointer bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-blue-300 transition-all duration-300 hover:-translate-y-1 relative"
                        >
                          {/* 缩略图 */}
                          <div className="aspect-video bg-gradient-to-br from-blue-50 to-purple-50 relative overflow-hidden rounded-t-2xl">
                            {latestProject.thumbnail ? (
                              <img
                                src={latestProject.thumbnail}
                                alt={latestProject.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                                {hasMultipleVersions ? (
                                  <Folder size={56} className="text-blue-500" strokeWidth={1.5} />
                                ) : (
                                  <FileText size={48} className="text-blue-400" strokeWidth={1.5} />
                                )}
                              </div>
                            )}

                            {/* 多版本标记 */}
                            {hasMultipleVersions && (
                              <div className="absolute top-3 left-3 bg-blue-500/90 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-medium flex items-center gap-1.5 shadow-lg">
                                <Folder size={14} />
                                <span>{projects.length} 个版本</span>
                              </div>
                            )}

                            {/* 悬停效果 */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 flex items-center justify-center">
                              <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
                                <div className="bg-white/95 backdrop-blur-sm rounded-full p-4 shadow-lg">
                                  {hasMultipleVersions ? (
                                    <Folder size={24} className="text-blue-600" />
                                  ) : (
                                    <Play size={24} className="text-blue-600" fill="currentColor" />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* 项目信息 */}
                          <div className="p-5">
                            <div className="flex items-start justify-between gap-3">
                              <div className="flex-1 min-w-0">
                                <div className="mb-2 flex items-center gap-2">
                                  {hasMultipleVersions && <Folder size={16} className="text-blue-500 flex-shrink-0" />}
                                  {renamingId === latestProject.id ? (
                                    <form onSubmit={(e) => handleRenameSubmit(e, latestProject.id)} onClick={(e) => e.stopPropagation()} className="flex-1">
                                      <input
                                        type="text"
                                        value={newName}
                                        onChange={(e) => setNewName(e.target.value)}
                                        onBlur={(e) => handleRenameSubmit(e, latestProject.id)}
                                        className="w-full px-2 py-0.5 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-semibold text-gray-900 text-base"
                                        autoFocus
                                      />
                                    </form>
                                  ) : (
                                    <h3 className="font-semibold text-gray-900 truncate text-base flex-1">
                                      {latestProject.name}
                                    </h3>
                                  )}
                                </div>
                                <p className="text-sm text-gray-500">
                                  {hasMultipleVersions ? `最新版本 v${latestProject.versionNumber}` : formatDate(latestProject.createdAt)}
                                </p>
                              </div>

                              {/* 操作菜单 */}
                              <div className="relative">
                                <button
                                  onClick={(e) => toggleMenu(e, latestProject.id)}
                                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                  title="更多操作"
                                >
                                  <MoreVertical size={18} />
                                </button>

                                {/* 下拉菜单 */}
                                {openMenuId === latestProject.id && (
                                  <div
                                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10"
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    <button
                                      onClick={(e) => handleRename(e, latestProject.id)}
                                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors"
                                    >
                                      <Edit2 size={16} />
                                      重命名
                                    </button>
                                    <button
                                      onClick={(e) => handleDuplicate(e, latestProject.id)}
                                      className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors"
                                    >
                                      <Copy size={16} />
                                      创建副本
                                    </button>
                                    <div className="my-1 border-t border-gray-100"></div>
                                    <button
                                      onClick={(e) => handleDeleteProject(e, latestProject.id)}
                                      className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                    >
                                      <Trash2 size={16} />
                                      删除
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        </>
                      )}

                      {/* 展开的版本列表 */}
                      {isExpanded && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                              <Folder size={18} className="text-blue-500" />
                              {latestProject.name}
                            </h3>
                            <button
                              onClick={() => setExpandedGroupId(null)}
                              className="text-sm text-gray-500 hover:text-gray-700"
                            >
                              收起
                            </button>
                          </div>

                          {projects.map((project, index) => (
                            <div
                              key={project.id}
                              onClick={() => handleLoadProject(project)}
                              className="group cursor-pointer bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all duration-200 p-4"
                            >
                              <div className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center flex-shrink-0">
                                    {project.thumbnail ? (
                                      <img src={project.thumbnail} alt="" className="w-full h-full object-cover rounded-lg" />
                                    ) : (
                                      <FileText size={20} className="text-blue-500" />
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 min-h-[20px]">
                                      <span className="text-sm font-medium text-gray-900">v{project.versionNumber || 1}</span>
                                      {index === 0 && (
                                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded">最新</span>
                                      )}
                                    </div>
                                    {renamingId === project.id ? (
                                      <form onSubmit={(e) => handleRenameSubmit(e, project.id)} onClick={(e) => e.stopPropagation()} className="mt-0.5">
                                        <input
                                          type="text"
                                          value={newName}
                                          onChange={(e) => setNewName(e.target.value)}
                                          onBlur={(e) => handleRenameSubmit(e, project.id)}
                                          className="w-full px-1.5 py-0.5 border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs text-gray-500"
                                          placeholder="重命名项目组"
                                          autoFocus
                                        />
                                      </form>
                                    ) : (
                                      <p className="text-xs text-gray-500 mt-0.5">{formatDate(project.createdAt)}</p>
                                    )}
                                  </div>
                                </div>

                                {/* 版本操作菜单 */}
                                <div className="relative flex-shrink-0">
                                  <button
                                    onClick={(e) => toggleMenu(e, project.id)}
                                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                  >
                                    <MoreVertical size={16} />
                                  </button>

                                  {openMenuId === project.id && (
                                    <div
                                      className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 py-2 z-10"
                                      onClick={(e) => e.stopPropagation()}
                                    >
                                      <button
                                        onClick={(e) => handleRename(e, project.id)}
                                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors"
                                      >
                                        <Edit2 size={16} />
                                        重命名
                                      </button>
                                      <button
                                        onClick={(e) => handleDuplicate(e, project.id)}
                                        className="w-full px-4 py-2.5 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 flex items-center gap-3 transition-colors"
                                      >
                                        <Copy size={16} />
                                        创建副本
                                      </button>
                                      <div className="my-1 border-t border-gray-100"></div>
                                      <button
                                        onClick={(e) => handleDeleteProject(e, project.id)}
                                        className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                      >
                                        <Trash2 size={16} />
                                        删除
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
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