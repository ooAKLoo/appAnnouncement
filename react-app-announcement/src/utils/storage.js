// 使用 Tauri 文件系统 API 进行项目存储
const isTauri = typeof window !== 'undefined' && window.__TAURI__;

class ProjectStorage {
  constructor() {
    this.initialized = false;
    this.fs = null;
    this.path = null;
    this.projectsDir = null;
    this.imagesDir = null;
  }

  async init() {
    if (this.initialized) return;

    if (!isTauri) {
      console.warn('⚠️ Not in Tauri environment, storage disabled');
      return;
    }

    try {
      // 动态导入 Tauri API
      this.fs = await import('@tauri-apps/api/fs');
      this.path = await import('@tauri-apps/api/path');

      // 获取应用数据目录
      const appDataDir = await this.path.appDataDir();
      this.projectsDir = await this.path.join(appDataDir, 'projects');
      this.imagesDir = await this.path.join(appDataDir, 'images');

      // 确保目录存在
      await this.ensureDir(this.projectsDir);
      await this.ensureDir(this.imagesDir);

      this.initialized = true;
      console.log('✅ Storage initialized:', this.projectsDir);
    } catch (error) {
      console.error('❌ Storage initialization failed:', error);
      throw error;
    }
  }

  async ensureDir(dirPath) {
    try {
      const exists = await this.fs.exists(dirPath);
      if (!exists) {
        await this.fs.createDir(dirPath, { recursive: true });
        console.log('✅ Directory created:', dirPath);
      }
    } catch (error) {
      console.error('❌ Error creating directory:', error);
      throw error;
    }
  }

  async saveProjects(projects) {
    await this.init();
    if (!this.initialized) return;

    try {
      const filePath = await this.path.join(this.projectsDir, 'projects.json');
      const jsonData = JSON.stringify(projects, null, 2);
      await this.fs.writeTextFile(filePath, jsonData);
      console.log('✅ Projects saved:', projects.length);
    } catch (error) {
      console.error('❌ Error saving projects:', error);
      throw error;
    }
  }

  async loadProjects() {
    await this.init();
    if (!this.initialized) return [];

    try {
      const filePath = await this.path.join(this.projectsDir, 'projects.json');
      const exists = await this.fs.exists(filePath);

      if (!exists) {
        console.log('📄 No projects file found, returning empty array');
        return [];
      }

      const jsonData = await this.fs.readTextFile(filePath);
      const projects = JSON.parse(jsonData);

      // 加载每个项目的图片
      for (const project of projects) {
        if (project.screenImageFile) {
          project.screenImage = await this.loadImage(project.screenImageFile);
        }
        if (project.thumbnailFile) {
          project.thumbnail = await this.loadImage(project.thumbnailFile);
        }
      }

      console.log('✅ Projects loaded:', projects.length);
      return projects;
    } catch (error) {
      console.error('❌ Error loading projects:', error);
      return [];
    }
  }

  async saveCurrentProject(projectId, state) {
    await this.init();
    if (!this.initialized) return null;

    try {
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
        modelState: state.modelState,
        screenImageFile,
        dynamicComponents: state.dynamicComponents,
        elementStyles: state.elementStyles
      };

      const filePath = await this.path.join(this.projectsDir, 'current-project.json');
      const jsonData = JSON.stringify(projectData, null, 2);
      await this.fs.writeTextFile(filePath, jsonData);

      console.log('✅ Current project saved');
      return projectData;
    } catch (error) {
      console.error('❌ Error saving current project:', error);
      throw error;
    }
  }

  async loadCurrentProject() {
    await this.init();
    if (!this.initialized) return null;

    try {
      const filePath = await this.path.join(this.projectsDir, 'current-project.json');
      const exists = await this.fs.exists(filePath);

      if (!exists) {
        console.log('📄 No current project found');
        return null;
      }

      const jsonData = await this.fs.readTextFile(filePath);
      const currentProject = JSON.parse(jsonData);

      // 加载图片
      if (currentProject.screenImageFile) {
        currentProject.screenImage = await this.loadImage(currentProject.screenImageFile);
      }

      console.log('✅ Current project loaded');
      return currentProject;
    } catch (error) {
      console.error('❌ Error loading current project:', error);
      return null;
    }
  }

  async updateProject(projectId, updatedData) {
    await this.init();
    if (!this.initialized) return;

    try {
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
      }
    } catch (error) {
      console.error('❌ Error updating project:', error);
      throw error;
    }
  }

  async deleteProject(projectId) {
    await this.init();
    if (!this.initialized) return;

    try {
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
    } catch (error) {
      console.error('❌ Error deleting project:', error);
      throw error;
    }
  }

  async renameProject(projectId, newName) {
    await this.init();
    if (!this.initialized) return;

    try {
      const projects = await this.loadProjects();
      const index = projects.findIndex(p => p.id === projectId);

      if (index !== -1) {
        const project = projects[index];
        const groupId = project.groupId;

        // 如果项目属于一个组，重命名该组的所有项目
        if (groupId) {
          projects.forEach(p => {
            if (p.groupId === groupId) {
              p.name = newName;
              p.updatedAt = new Date().toISOString();
            }
          });
          console.log('✅ Project group renamed:', groupId, '->', newName);
        } else {
          // 单个项目重命名
          projects[index].name = newName;
          projects[index].updatedAt = new Date().toISOString();
          console.log('✅ Project renamed:', projectId, '->', newName);
        }

        await this.saveProjects(projects);
        return projects[index];
      }
    } catch (error) {
      console.error('❌ Error renaming project:', error);
      throw error;
    }
  }

  async duplicateProject(projectId) {
    await this.init();
    if (!this.initialized) return;

    try {
      const projects = await this.loadProjects();
      const originalIndex = projects.findIndex(p => p.id === projectId);

      if (originalIndex === -1) {
        throw new Error('Project not found');
      }

      const originalProject = projects[originalIndex];

      // 如果原项目没有 groupId，创建一个并更新原项目
      let groupId = originalProject.groupId;
      if (!groupId) {
        groupId = `group_${Date.now()}`;
        projects[originalIndex].groupId = groupId;
        projects[originalIndex].versionNumber = 1;
      }

      // 计算新的版本号
      const groupProjects = projects.filter(p => p.groupId === groupId);
      const maxVersion = Math.max(...groupProjects.map(p => p.versionNumber || 1));

      // 创建新项目副本
      const newProject = {
        ...originalProject,
        id: Date.now().toString(),
        name: originalProject.name.replace(/ \(v\d+\)$/, ''), // 移除旧版本号
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        groupId: groupId,
        versionNumber: maxVersion + 1
      };

      // 复制图片文件
      if (originalProject.screenImageFile) {
        const newImageFile = await this.copyImage(originalProject.screenImageFile, newProject.id);
        newProject.screenImageFile = newImageFile;
      }
      if (originalProject.thumbnailFile) {
        const newThumbnailFile = await this.copyImage(originalProject.thumbnailFile, newProject.id);
        newProject.thumbnailFile = newThumbnailFile;
      }

      projects.push(newProject);
      await this.saveProjects(projects);
      console.log('✅ Project duplicated:', projectId, '->', newProject.id, 'Group:', groupId);
      return newProject;
    } catch (error) {
      console.error('❌ Error duplicating project:', error);
      throw error;
    }
  }

  async copyImage(fileName, newProjectId) {
    if (!fileName || fileName.startsWith('data:image')) {
      return fileName;
    }

    await this.init();
    if (!this.initialized) return fileName;

    try {
      const oldPath = await this.path.join(this.imagesDir, fileName);
      const newFileName = `${newProjectId}_screen.jpg`;
      const newPath = await this.path.join(this.imagesDir, newFileName);

      const data = await this.fs.readBinaryFile(oldPath);
      await this.fs.writeBinaryFile(newPath, data);

      console.log('✅ Image copied:', fileName, '->', newFileName);
      return newFileName;
    } catch (error) {
      console.error('❌ Error copying image:', error);
      return fileName;
    }
  }

  async saveImage(projectId, imageBase64) {
    if (!imageBase64 || !projectId) return null;

    await this.init();
    if (!this.initialized) {
      // 开发环境：返回原始 base64
      console.log('🔄 Using base64 (storage not available)');
      return imageBase64;
    }

    try {
      // 移除 base64 前缀
      const base64Data = imageBase64.split(',')[1];
      if (!base64Data) return null;

      const buffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

      const fileName = `${projectId}_screen.jpg`;
      const filePath = await this.path.join(this.imagesDir, fileName);

      await this.fs.writeBinaryFile(filePath, buffer);
      console.log('✅ Image saved:', fileName);

      return fileName;
    } catch (error) {
      console.error('❌ Error saving image:', error);
      return imageBase64; // 降级：返回原始 base64
    }
  }

  async loadImage(fileName) {
    if (!fileName) return null;

    // 如果是 base64，直接返回（向后兼容）
    if (fileName.startsWith('data:image')) {
      return fileName;
    }

    await this.init();
    if (!this.initialized) {
      return fileName;
    }

    try {
      const filePath = await this.path.join(this.imagesDir, fileName);
      const data = await this.fs.readBinaryFile(filePath);
      const base64 = btoa(String.fromCharCode(...data));
      const dataUrl = `data:image/jpeg;base64,${base64}`;

      console.log('✅ Image loaded:', fileName);
      return dataUrl;
    } catch (error) {
      console.error('❌ Error loading image:', error);
      return null;
    }
  }

  async deleteImage(fileName) {
    if (!fileName || fileName.startsWith('data:image')) return;

    await this.init();
    if (!this.initialized) return;

    try {
      const filePath = await this.path.join(this.imagesDir, fileName);
      await this.fs.removeFile(filePath);
      console.log('✅ Image deleted:', fileName);
    } catch (error) {
      console.error('❌ Error deleting image:', error);
    }
  }

  async clear() {
    await this.init();
    if (!this.initialized) return;

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

      // 删除 JSON 文件
      const projectsFile = await this.path.join(this.projectsDir, 'projects.json');
      const currentFile = await this.path.join(this.projectsDir, 'current-project.json');

      if (await this.fs.exists(projectsFile)) {
        await this.fs.removeFile(projectsFile);
      }
      if (await this.fs.exists(currentFile)) {
        await this.fs.removeFile(currentFile);
      }

      console.log('✅ All data cleared');
    } catch (error) {
      console.error('❌ Error clearing data:', error);
    }
  }
}

export const projectStorage = new ProjectStorage();
