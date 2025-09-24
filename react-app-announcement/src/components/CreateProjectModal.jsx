import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Modal from './common/Modal';

function CreateProjectModal() {
  const { state, closeCreateProjectModal, addProject } = useApp();
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
        appInfo: { ...state.appInfo },
        design: { ...state.design },
        downloads: { ...state.downloads },
        features: [...state.features],
        eventInfo: { ...state.eventInfo },
        currentTheme: state.currentTheme,
        currentStyle: state.currentStyle
      };

      // 添加到项目列表
      addProject(newProject);
      
      // 重置表单并关闭弹窗
      setProjectName('');
      closeCreateProjectModal();
      
      // 刷新页面以应用默认设置
      setTimeout(() => {
        window.location.reload();
      }, 100);
      
    } catch (error) {
      console.error('创建项目失败:', error);
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