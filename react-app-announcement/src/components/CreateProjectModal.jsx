import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { projectStorage } from '../utils/storage';
import Modal from './common/Modal';

function CreateProjectModal() {
  const { state, closeCreateProjectModal, dispatch, setCurrentProjectId, setAppMode } = useApp();
  const [projectName, setProjectName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!projectName.trim()) {
      return;
    }

    setIsCreating(true);
    
    try {
      // 创建新项目对象
      const newProject = {
        id: Date.now().toString(),
        name: projectName.trim(),
        createdAt: new Date().toISOString(),
        // 完整的初始状态
        appInfo: { ...state.appInfo },
        design: { ...state.design },
        typography: { ...state.typography },
        downloads: { ...state.downloads },
        features: [...state.features],
        eventInfo: { ...state.eventInfo },
        contentSections: { ...state.contentSections },
        featureStyle: state.featureStyle,
        currentStyle: state.currentStyle,
        modelType: state.modelType,
        modelState: { ...state.modelState }, // ✅ 保存模型状态
        screenImage: state.screenImage, // ✅ 保留当前图片
        thumbnail: null
      };

      // ✅ 1. 加载现有项目列表
      const projects = await projectStorage.loadProjects();
      
      // ✅ 2. 添加新项目
      projects.push(newProject);
      
      // ✅ 3. 保存到持久化存储
      await projectStorage.saveProjects(projects);
      
      // ✅ 4. 保存为当前项目
      await projectStorage.saveCurrentProject(newProject.id, newProject);
      
      // ✅ 5. 更新 React state
      dispatch({ type: 'ADD_PROJECT', payload: newProject });
      
      // ✅ 6. 设置当前项目 ID (触发自动保存机制)
      setCurrentProjectId(newProject.id);
      
      // ✅ 7. 切换到编辑模式
      setAppMode('editor');
      
      // 重置表单并关闭弹窗
      setProjectName('');
      closeCreateProjectModal();
      
      console.log('项目创建成功:', newProject.name);
      
    } catch (error) {
      console.error('创建项目失败:', error);
      console.error('Error details:', error.message, error.stack);
      alert(`创建失败: ${error.message || '未知错误'}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setProjectName('');
    closeCreateProjectModal();
  };

  return (
    <Modal
      isOpen={state.createProjectModalOpen}
      onClose={handleClose}
      title="创建新项目"
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-2">
            项目名称
          </label>
          <input
            type="text"
            id="projectName"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            placeholder="请输入项目名称"
            className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue/20 focus:border-primary-blue transition-colors duration-200"
            autoFocus
            disabled={isCreating}
          />
        </div>
        
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 px-4 py-3 text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            disabled={isCreating}
          >
            取消
          </button>
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!projectName.trim() || isCreating}
          >
            {isCreating ? '创建中...' : '创建项目'}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateProjectModal;