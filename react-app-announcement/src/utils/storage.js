// 检查是否在 Tauri 环境中
const isTauri = typeof window !== 'undefined' && window.__TAURI__;

class ProjectStorage {
  constructor() {
    this.isTauriAvailable = false;
    this.store = null;
    this.currentProjectStore = null;
    this.initPromise = null;
    
    // 内存存储后备方案
    this.memoryProjects = [];
    this.memoryCurrentProject = null;
    
    // 立即开始初始化，并保存 Promise
    this.initPromise = this.init();
  }

  async init() {
    if (isTauri) {
      try {
        // 动态导入 Tauri Store
        console.log('🔄 Initializing Tauri Store...');
        const { Store } = await import('@tauri-apps/plugin-store');
        this.store = new Store('projects.json');
        this.currentProjectStore = new Store('current-project.json');
        this.isTauriAvailable = true;
        console.log('✅ Tauri Store initialized successfully');
        
        // 确保图片目录存在
        await this.ensureImageDirectory();
      } catch (error) {
        console.error('❌ Tauri Store plugin not available:', error);
        this.isTauriAvailable = false;
        // 在开发环境中降级到内存存储，不抛出错误
        console.warn('⚠️ Falling back to memory storage for development');
      }
    } else {
      console.warn('⚠️ Not in Tauri environment, using memory storage');
    }
  }

  // 确保初始化完成的辅助方法
  async ensureInitialized() {
    if (this.initPromise) {
      await this.initPromise;
      this.initPromise = null; // 只等待一次
    }
  }

  // 确保图片目录存在
  async ensureImageDirectory() {
    if (!this.isTauriAvailable) return;
    
    try {
      const { exists, createDir } = await import('@tauri-apps/api/fs');
      const { appDataDir, join } = await import('@tauri-apps/api/path');
      
      const appDir = await appDataDir();
      const imageDir = await join(appDir, 'images');
      
      const dirExists = await exists(imageDir);
      if (!dirExists) {
        await createDir(imageDir, { recursive: true });
        console.log('✅ Image directory created:', imageDir);
      }
    } catch (error) {
      console.error('❌ Error ensuring image directory:', error);
    }
  }

  // 保存图片到文件系统
  async saveImage(projectId, imageBase64) {
    if (!imageBase64 || !projectId) return null;
    
    if (!this.isTauriAvailable) {
      // 开发环境：返回原始 base64 
      console.log('🔄 Using base64 for development (no file saving)');
      return imageBase64;
    }
    
    try {
      const { writeBinaryFile } = await import('@tauri-apps/api/fs');
      const { appDataDir, join } = await import('@tauri-apps/api/path');
      
      // 移除 base64 前缀
      const base64Data = imageBase64.split(',')[1];
      if (!base64Data) return null;
      
      const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      
      const fileName = `${projectId}_screen.jpg`;
      const appDir = await appDataDir();
      const filePath = await join(appDir, 'images', fileName);
      
      await writeBinaryFile(filePath, buffer);
      console.log('✅ Image saved to file:', filePath);
      
      return fileName; // 返回文件名而不是 base64
    } catch (error) {
      console.error('❌ Error saving image:', error);
      return imageBase64; // 降级：返回原始 base64
    }
  }

  // 从文件系统加载图片
  async loadImage(fileName) {
    if (!fileName) return null;
    
    // 如果是 base64，直接返回（向后兼容）
    if (fileName.startsWith('data:image')) {
      return fileName;
    }
    
    if (!this.isTauriAvailable) {
      return fileName; // 开发环境直接返回
    }
    
    try {
      const { readBinaryFile } = await import('@tauri-apps/api/fs');
      const { appDataDir, join } = await import('@tauri-apps/api/path');
      
      const appDir = await appDataDir();
      const filePath = await join(appDir, 'images', fileName);
      
      const data = await readBinaryFile(filePath);
      const base64 = btoa(String.fromCharCode(...data));
      const dataUrl = `data:image/jpeg;base64,${base64}`;
      
      console.log('✅ Image loaded from file:', fileName);
      return dataUrl;
    } catch (error) {
      console.error('❌ Error loading image:', error);
      return null;
    }
  }

  // 删除图片文件
  async deleteImage(fileName) {
    if (!fileName || fileName.startsWith('data:image') || !this.isTauriAvailable) return;
    
    try {
      const { removeFile } = await import('@tauri-apps/api/fs');
      const { appDataDir, join } = await import('@tauri-apps/api/path');
      
      const appDir = await appDataDir();
      const filePath = await join(appDir, 'images', fileName);
      
      await removeFile(filePath);
      console.log('✅ Image deleted:', fileName);
    } catch (error) {
      console.error('❌ Error deleting image:', error);
    }
  }

  // 保存项目列表
  async saveProjects(projects) {
    await this.ensureInitialized(); // ✅ 确保初始化完成
    
    if (this.isTauriAvailable && this.store) {
      try {
        await this.store.set('projects', projects);
        await this.store.save();
        console.log('✅ Projects saved to Tauri Store:', projects.length);
        return;
      } catch (error) {
        console.error('❌ Error saving projects to Tauri Store:', error);
      }
    }
    
    // 后备方案：内存存储
    this.memoryProjects = [...projects];
    console.log('✅ Projects saved to memory storage:', projects.length);
  }

  // 加载项目列表
  async loadProjects() {
    await this.ensureInitialized(); // ✅ 确保初始化完成
    
    if (this.isTauriAvailable && this.store) {
      try {
        const projects = await this.store.get('projects');
        console.log('✅ Projects loaded from Tauri Store:', projects?.length || 0);
        
        // 为每个项目加载图片
        if (projects && projects.length > 0) {
          for (const project of projects) {
            if (project.screenImageFile) {
              project.screenImage = await this.loadImage(project.screenImageFile);
            }
            if (project.thumbnailFile) {
              project.thumbnail = await this.loadImage(project.thumbnailFile);
            }
          }
        }
        
        return projects || [];
      } catch (error) {
        console.error('❌ Error loading projects from Tauri Store:', error);
      }
    }
    
    // 后备方案：从内存加载
    console.log('✅ Projects loaded from memory storage:', this.memoryProjects.length);
    return [...this.memoryProjects];
  }

  // 保存当前项目的完整状态（用于自动保存）
  async saveCurrentProject(projectId, state) {
    await this.ensureInitialized(); // ✅ 确保初始化完成

    // 保存图片到文件
    let screenImageFile = null;
    if (state.screenImage) {
      screenImageFile = await this.saveImage(projectId, state.screenImage);
    }

    const projectData = {
      id: projectId,
      updatedAt: new Date().toISOString(),
      appInfo: state.appInfo,
      design: state.design,
      typography: state.typography,
      downloads: state.downloads,
      features: state.features,
      eventInfo: state.eventInfo,
      contentSections: state.contentSections,
      featureStyle: state.featureStyle,
      currentStyle: state.currentStyle,
      modelType: state.modelType,
      modelState: state.modelState, // ✅ 保存模型状态
      screenImageFile, // 保存文件名而不是 base64
      screenImage: state.screenImage // 保留 base64 用于即时显示
    };
    
    if (this.isTauriAvailable && this.currentProjectStore) {
      try {
        await this.currentProjectStore.set('current', projectData);
        await this.currentProjectStore.save();
        console.log('✅ Current project saved to Tauri Store');
        return projectData;
      } catch (error) {
        console.error('❌ Error saving current project to Tauri Store:', error);
      }
    }
    
    // 后备方案：内存存储
    this.memoryCurrentProject = projectData;
    console.log('✅ Current project saved to memory storage');
    return projectData;
  }

  // 加载当前项目状态
  async loadCurrentProject() {
    await this.ensureInitialized(); // ✅ 确保初始化完成
    
    if (this.isTauriAvailable && this.currentProjectStore) {
      try {
        const current = await this.currentProjectStore.get('current');
        if (current && current.screenImageFile) {
          // 从文件加载图片
          current.screenImage = await this.loadImage(current.screenImageFile);
        }
        console.log('✅ Current project loaded from Tauri Store');
        return current;
      } catch (error) {
        console.error('❌ Error loading current project from Tauri Store:', error);
      }
    }
    
    // 后备方案：从内存加载
    console.log('✅ Current project loaded from memory storage');
    return this.memoryCurrentProject;
  }

  // 更新项目列表中的某个项目
  async updateProject(projectId, updatedData) {
    await this.ensureInitialized(); // ✅ 确保初始化完成
    
    const projects = await this.loadProjects();
    const index = projects.findIndex(p => p.id === projectId);
    
    if (index !== -1) {
      // 如果有新图片，保存到文件
      if (updatedData.screenImage) {
        const screenImageFile = await this.saveImage(projectId, updatedData.screenImage);
        updatedData.screenImageFile = screenImageFile;
      }
      
      projects[index] = { ...projects[index], ...updatedData };
      await this.saveProjects(projects);
      console.log('✅ Project updated:', projectId);
    } else {
      console.warn('⚠️ Project not found for update:', projectId);
    }
  }

  // 删除项目
  async deleteProject(projectId) {
    await this.ensureInitialized(); // ✅ 确保初始化完成
    
    const projects = await this.loadProjects();
    const projectToDelete = projects.find(p => p.id === projectId);
    
    // 删除关联的图片文件
    if (projectToDelete) {
      if (projectToDelete.screenImageFile) {
        await this.deleteImage(projectToDelete.screenImageFile);
      }
      if (projectToDelete.thumbnailFile) {
        await this.deleteImage(projectToDelete.thumbnailFile);
      }
    }
    
    const filtered = projects.filter(p => p.id !== projectId);
    await this.saveProjects(filtered);
    console.log('✅ Project deleted:', projectId);
  }

  // 清空所有数据
  async clear() {
    await this.ensureInitialized(); // ✅ 确保初始化完成
    
    try {
      // 获取所有项目，删除图片文件
      const projects = await this.loadProjects();
      for (const project of projects) {
        if (project.screenImageFile) {
          await this.deleteImage(project.screenImageFile);
        }
        if (project.thumbnailFile) {
          await this.deleteImage(project.thumbnailFile);
        }
      }
      
      // 清空存储
      if (this.isTauriAvailable) {
        if (this.store) await this.store.clear();
        if (this.currentProjectStore) await this.currentProjectStore.clear();
      }
      
      // 清空内存存储
      this.memoryProjects = [];
      this.memoryCurrentProject = null;
      
      console.log('✅ All data cleared');
    } catch (error) {
      console.error('❌ Error clearing data:', error);
    }
  }
}

export const projectStorage = new ProjectStorage();