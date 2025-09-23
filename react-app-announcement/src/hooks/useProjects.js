import { useApp } from '../context/AppContext';

export function useProjects() {
  const { 
    state, 
    updateAppInfo, 
    updateDesign, 
    updateDownloads, 
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
        appInfo: { ...state.appInfo },
        design: { ...state.design },
        downloads: { ...state.downloads },
        screenImage: state.screenImage
      };

      addProject(project);
      
      console.log('Project saved successfully:', name);
      alert('作品保存成功！');
      
      return project;
    } catch (error) {
      console.error('Error saving project:', error);
      alert('保存失败，请重试');
    }
  };

  const loadProject = (project) => {
    try {
      updateAppInfo(project.appInfo);
      updateDesign(project.design);
      updateDownloads(project.downloads);
      setScreenImage(project.screenImage);
      
      // Switch to app config tab
      setCurrentTab('app');
      
      console.log('Project loaded successfully:', project.name);
    } catch (error) {
      console.error('Error loading project:', error);
      alert('加载作品失败，请重试');
    }
  };

  const deleteProjectById = (projectId) => {
    try {
      deleteProject(projectId);
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
      
      reader.onload = (e) => {
        try {
          const project = JSON.parse(e.target.result);
          
          // Validate project structure
          if (!project.appInfo || !project.design || !project.downloads) {
            throw new Error('Invalid project file format');
          }
          
          // Generate new ID and timestamp
          project.id = Date.now().toString();
          project.createdAt = new Date().toISOString();
          
          addProject(project);
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