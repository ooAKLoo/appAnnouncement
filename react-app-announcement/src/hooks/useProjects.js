import { useApp } from '../context/AppContext';
import { projectStorage } from '../utils/storage';

export function useProjects() {
  const { 
    state, 
    dispatch,
    setCurrentProjectId,
    setAppMode,
    updateAppInfo, 
    updateDesign, 
    updateTypography,
    updateDownloads, 
    updateFeatures,
    updateEventInfo,
    setScreenImage,
    addProject, 
    deleteProject,
    setCurrentTab,
    closeSaveDialog,
    closeConfirmDialog
  } = useApp();

  const generateThumbnail = async () => {
    try {
      const container = document.querySelector('.container');
      if (!container) return null;

      // Use html2canvas if available
      if (window.html2canvas) {
        const canvas = await window.html2canvas(container, {
          scale: 0.5,
          width: 400,
          height: 300,
          useCORS: true,
          allowTaint: true
        });
        return canvas.toDataURL('image/jpeg', 0.7);
      }
      
      return null;
    } catch (error) {
      console.error('Error generating thumbnail:', error);
      return null;
    }
  };

  const saveProject = async (name) => {
    try {
      const thumbnail = await generateThumbnail();
      
      const project = {
        id: Date.now().toString(),
        name,
        createdAt: new Date().toISOString(),
        thumbnail,
        // 完整状态
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
        screenImage: state.screenImage
      };

      // 保存到 Tauri Store
      const projects = await projectStorage.loadProjects();
      projects.push(project);
      await projectStorage.saveProjects(projects);
      
      // 更新 React 状态
      dispatch({ type: 'ADD_PROJECT', payload: project });
      setCurrentProjectId(project.id);
      
      console.log('Project saved successfully:', name);
      alert('作品保存成功！');
      
      return project;
    } catch (error) {
      console.error('Error saving project:', error);
      alert('保存失败，请重试');
    }
  };

  const loadProject = async (project) => {
    try {
      // 恢复完整状态
      dispatch({ type: 'UPDATE_APP_INFO', payload: project.appInfo });
      dispatch({ type: 'UPDATE_DESIGN', payload: project.design });
      dispatch({ type: 'UPDATE_TYPOGRAPHY', payload: project.typography });
      dispatch({ type: 'UPDATE_DOWNLOADS', payload: project.downloads });
      dispatch({ type: 'UPDATE_FEATURES', payload: project.features });
      dispatch({ type: 'UPDATE_EVENT_INFO', payload: project.eventInfo });
      dispatch({ type: 'SET_CONTENT_SECTIONS', payload: project.contentSections });
      dispatch({ type: 'SET_FEATURE_STYLE', payload: project.featureStyle });
      dispatch({ type: 'UPDATE_STYLE', payload: project.currentStyle });
      dispatch({ type: 'SET_MODEL_TYPE', payload: project.modelType });
      
      // ✅ 恢复模型状态
      if (project.modelState) {
        dispatch({ type: 'UPDATE_MODEL_STATE', payload: project.modelState });
      }
      
      dispatch({ type: 'SET_SCREEN_IMAGE', payload: project.screenImage });
      
      // 设置当前项目 ID（触发自动保存）
      setCurrentProjectId(project.id);
      
      // 保存为当前项目
      await projectStorage.saveCurrentProject(project.id, project);
      
      // 切换到编辑模式
      setAppMode('editor');
      setCurrentTab('app');
      
      console.log('Project loaded successfully:', project.name);
    } catch (error) {
      console.error('Error loading project:', error);
      alert('加载作品失败，请重试');
    }
  };

  const deleteProjectById = async (projectId) => {
    try {
      await projectStorage.deleteProject(projectId);
      dispatch({ type: 'DELETE_PROJECT', payload: projectId });
      console.log('Project deleted successfully');
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('删除失败，请重试');
    }
  };

  const exportProject = (project) => {
    try {
      const dataStr = JSON.stringify(project, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `${project.name}.json`;
      link.click();
      
      console.log('Project exported successfully');
    } catch (error) {
      console.error('Error exporting project:', error);
      alert('导出失败，请重试');
    }
  };

  const importProject = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {  // ✅ 改为 async
        try {
          const project = JSON.parse(e.target.result);
          
          // Validate project structure
          if (!project.appInfo || !project.design || !project.downloads) {
            throw new Error('Invalid project file format');
          }
          
          // Generate new ID and timestamp
          project.id = Date.now().toString();
          project.createdAt = new Date().toISOString();
          
          // ✅ 保存到持久化存储
          const projects = await projectStorage.loadProjects();
          projects.push(project);
          await projectStorage.saveProjects(projects);
          
          // ✅ 更新 React state
          dispatch({ type: 'ADD_PROJECT', payload: project });
          
          resolve(project);
          
          console.log('Project imported successfully');
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsText(file);
    });
  };

  return {
    saveProject,
    loadProject,
    deleteProjectById,
    exportProject,
    importProject,
    generateThumbnail
  };
}