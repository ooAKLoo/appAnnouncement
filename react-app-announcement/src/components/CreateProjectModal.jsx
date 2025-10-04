import React, { useState } from 'react';
import { useApp, initialState } from '../context/AppContext';
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
      // 🔥 使用初始状态创建新项目，而不是当前状态
      const newProject = {
        id: Date.now().toString(),
        name: projectName.trim(),
        createdAt: new Date().toISOString(),
        // 使用初始化状态（全新的项目）
        appInfo: { ...initialState.appInfo },
        design: { ...initialState.design },
        typography: { ...initialState.typography },
        downloads: { ...initialState.downloads },
        features: [...initialState.features],
        eventInfo: { ...initialState.eventInfo },
        contentSections: { ...initialState.contentSections },
        featureStyle: initialState.featureStyle,
        currentStyle: initialState.currentStyle,
        modelType: initialState.modelType,
        modelState: { ...initialState.modelState },
        screenImage: null,  // 新项目没有截图
        dynamicComponents: [],  // 新项目没有动态组件
        elementStyles: {},  // 新项目没有元素样式
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

      // ✅ 6. 恢复新项目的初始状态到编辑器
      dispatch({ type: 'UPDATE_APP_INFO', payload: newProject.appInfo });
      dispatch({ type: 'UPDATE_DESIGN', payload: newProject.design });
      dispatch({ type: 'UPDATE_TYPOGRAPHY', payload: newProject.typography });
      dispatch({ type: 'UPDATE_DOWNLOADS', payload: newProject.downloads });
      dispatch({ type: 'UPDATE_FEATURES', payload: newProject.features });
      dispatch({ type: 'UPDATE_EVENT_INFO', payload: newProject.eventInfo });
      dispatch({ type: 'SET_CONTENT_SECTIONS', payload: newProject.contentSections });
      dispatch({ type: 'SET_FEATURE_STYLE', payload: newProject.featureStyle });
      dispatch({ type: 'UPDATE_STYLE', payload: newProject.currentStyle });
      dispatch({ type: 'SET_MODEL_TYPE', payload: newProject.modelType });
      dispatch({ type: 'UPDATE_MODEL_STATE', payload: newProject.modelState });
      dispatch({ type: 'SET_SCREEN_IMAGE', payload: newProject.screenImage });
      dispatch({ type: 'SET_DYNAMIC_COMPONENTS', payload: newProject.dynamicComponents || [] });
      dispatch({ type: 'SET_ELEMENT_STYLES', payload: newProject.elementStyles || {} });

      // ✅ 7. 设置当前项目 ID (触发自动保存机制)
      setCurrentProjectId(newProject.id);

      // ✅ 8. 切换到编辑模式
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