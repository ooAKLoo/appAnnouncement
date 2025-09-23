// 项目管理模块
class ProjectManager {
    constructor(configManager) {
        this.configManager = configManager;
        this.currentDeleteProjectId = null;
        this.init();
    }

    // 初始化项目管理功能
    init() {
        this.setupEventListeners();
        this.loadProjectsList();
    }

    // 设置事件监听器
    setupEventListeners() {
        // 监听标签切换到我的作品时刷新列表
        const projectsTab = document.querySelector('[data-tab="projects"]');
        if (projectsTab) {
            projectsTab.addEventListener('click', () => {
                setTimeout(() => this.loadProjectsList(), 100);
            });
        }

        // 保存对话框相关事件
        const saveDialogOverlay = document.getElementById('saveDialogOverlay');
        if (saveDialogOverlay) {
            saveDialogOverlay.addEventListener('click', (e) => {
                if (e.target === saveDialogOverlay) {
                    this.hideSaveDialog();
                }
            });
        }

        // 确认删除对话框相关事件
        const confirmDialogOverlay = document.getElementById('confirmDialogOverlay');
        if (confirmDialogOverlay) {
            confirmDialogOverlay.addEventListener('click', (e) => {
                if (e.target === confirmDialogOverlay) {
                    this.hideConfirmDialog();
                }
            });
        }

        // 键盘事件
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.hideSaveDialog();
                this.hideConfirmDialog();
            }
            
            // Ctrl+S 保存快捷键
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.showSaveDialog();
            }
        });
    }

    // 显示保存对话框
    showSaveDialog() {
        const overlay = document.getElementById('saveDialogOverlay');
        const nameInput = document.getElementById('projectNameInput');
        
        if (overlay) {
            overlay.style.display = 'flex';
            setTimeout(() => overlay.classList.add('show'), 10);
        }
        
        // 生成默认名称
        if (nameInput) {
            const config = this.configManager.getConfig();
            const defaultName = `${config.appName}_${new Date().toLocaleDateString()}`;
            nameInput.value = defaultName;
            nameInput.select();
        }
        
        // 生成预览
        this.generateSavePreview();
    }

    // 隐藏保存对话框
    hideSaveDialog() {
        const overlay = document.getElementById('saveDialogOverlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => overlay.style.display = 'none', 300);
        }
    }

    // 保存当前项目
    saveCurrentProject() {
        const nameInput = document.getElementById('projectNameInput');
        const projectName = nameInput ? nameInput.value.trim() : '';
        
        if (!projectName) {
            this.showNotification('请输入作品名称', 'error');
            return;
        }
        
        try {
            const savedProject = this.configManager.saveProject(projectName);
            this.hideSaveDialog();
            this.showNotification('作品保存成功！', 'success');
            
            // 如果当前在我的作品页面，刷新列表
            const projectsSection = document.querySelector('[data-section="projects"]');
            if (projectsSection && projectsSection.classList.contains('active')) {
                this.loadProjectsList();
            }
            
        } catch (error) {
            console.error('保存失败:', error);
            this.showNotification('保存失败，请重试', 'error');
        }
    }

    // 加载项目列表
    loadProjectsList() {
        const projectsList = document.getElementById('projectsList');
        const noProjects = document.getElementById('noProjects');
        
        if (!projectsList) return;
        
        const savedProjects = this.configManager.getSavedProjects();
        
        // 清空现有列表
        projectsList.innerHTML = '';
        
        if (savedProjects.length === 0) {
            projectsList.appendChild(noProjects);
            return;
        }
        
        // 按时间倒序排列
        savedProjects.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        savedProjects.forEach(project => {
            const projectItem = this.createProjectItem(project);
            projectsList.appendChild(projectItem);
        });
    }

    // 创建项目列表项
    createProjectItem(project) {
        const item = document.createElement('div');
        item.className = 'project-item';
        item.innerHTML = `
            <div class="project-item-thumbnail">
                <div class="project-thumbnail-placeholder">
                    <i data-lucide="image"></i>
                </div>
            </div>
            <div class="project-item-info">
                <div class="project-item-name">${this.escapeHtml(project.name)}</div>
                <div class="project-item-date">${this.formatDate(project.timestamp)}</div>
                <div class="project-item-details">
                    <span class="project-detail-tag">${project.template || 'classic'}</span>
                    <span class="project-detail-tag">${project.colorScheme || 'blue'}</span>
                </div>
            </div>
            <div class="project-item-actions">
                <button class="project-action-btn load" onclick="projectManager.loadProject('${project.id}')" title="加载作品">
                    <i data-lucide="folder-open"></i>
                </button>
                <button class="project-action-btn delete" onclick="projectManager.showDeleteConfirm('${project.id}')" title="删除作品">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        `;
        
        return item;
    }

    // 加载项目
    loadProject(projectId) {
        try {
            const success = this.configManager.loadProject(projectId);
            if (success) {
                this.showNotification('作品加载成功！', 'success');
                
                // 切换到APP配置页面显示加载的内容
                const appTab = document.querySelector('[data-tab="app"]');
                if (appTab) {
                    appTab.click();
                }
            } else {
                this.showNotification('作品加载失败', 'error');
            }
        } catch (error) {
            console.error('加载失败:', error);
            this.showNotification('作品加载失败', 'error');
        }
    }

    // 显示删除确认对话框
    showDeleteConfirm(projectId) {
        this.currentDeleteProjectId = projectId;
        const overlay = document.getElementById('confirmDialogOverlay');
        if (overlay) {
            overlay.style.display = 'flex';
            setTimeout(() => overlay.classList.add('show'), 10);
        }
    }

    // 隐藏删除确认对话框
    hideConfirmDialog() {
        const overlay = document.getElementById('confirmDialogOverlay');
        if (overlay) {
            overlay.classList.remove('show');
            setTimeout(() => overlay.style.display = 'none', 300);
        }
        this.currentDeleteProjectId = null;
    }

    // 确认删除项目
    confirmDeleteProject() {
        if (!this.currentDeleteProjectId) return;
        
        try {
            this.configManager.deleteProject(this.currentDeleteProjectId);
            this.hideConfirmDialog();
            this.showNotification('作品删除成功', 'success');
            this.loadProjectsList();
        } catch (error) {
            console.error('删除失败:', error);
            this.showNotification('删除失败，请重试', 'error');
        }
    }

    // 生成保存预览
    generateSavePreview() {
        const previewContent = document.getElementById('savePreviewContent');
        if (!previewContent) return;
        
        const config = this.configManager.getConfig();
        
        previewContent.innerHTML = `
            <div class="mini-preview">
                <div class="mini-preview-header" style="background: linear-gradient(135deg, ${config.primaryColor} 0%, ${config.secondaryColor} 100%);">
                    <div class="mini-logo">${config.appIcon}</div>
                    <div class="mini-title">${config.appName}</div>
                </div>
                <div class="mini-preview-body">
                    <div class="mini-main-title">${config.mainTitle}</div>
                    <div class="mini-subtitle">${config.subtitle}</div>
                </div>
            </div>
        `;
    }

    // 显示通知
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const icon = type === 'success' ? 'check-circle' : 
                    type === 'error' ? 'x-circle' : 'info';
        
        notification.innerHTML = `
            <i data-lucide="${icon}"></i>
            <span>${message}</span>
        `;
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6'};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
            font-weight: 500;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // 添加图标
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        // 显示动画
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // 自动隐藏
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // 格式化日期
    formatDate(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
            return '今天';
        } else if (diffDays === 2) {
            return '昨天';
        } else if (diffDays <= 7) {
            return `${diffDays}天前`;
        } else {
            return date.toLocaleDateString();
        }
    }

    // HTML转义
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // 导出项目数据
    exportProjects() {
        const projects = this.configManager.getSavedProjects();
        const dataStr = JSON.stringify(projects, null, 2);
        const blob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `设计作品备份_${new Date().toISOString().slice(0, 10)}.json`;
        link.click();
        
        URL.revokeObjectURL(url);
        this.showNotification('作品数据导出成功', 'success');
    }

    // 导入项目数据
    importProjects(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const projects = JSON.parse(e.target.result);
                    if (Array.isArray(projects)) {
                        const existingProjects = this.configManager.getSavedProjects();
                        const mergedProjects = [...existingProjects, ...projects];
                        localStorage.setItem('designProjects', JSON.stringify(mergedProjects));
                        this.loadProjectsList();
                        this.showNotification(`成功导入 ${projects.length} 个作品`, 'success');
                        resolve(projects.length);
                    } else {
                        throw new Error('无效的项目数据格式');
                    }
                } catch (error) {
                    this.showNotification('导入失败：文件格式不正确', 'error');
                    reject(error);
                }
            };
            reader.readAsText(file);
        });
    }
}

// 全局函数，供HTML调用
window.showSaveDialog = function() {
    if (window.projectManager) {
        window.projectManager.showSaveDialog();
    }
};

window.hideSaveDialog = function() {
    if (window.projectManager) {
        window.projectManager.hideSaveDialog();
    }
};

window.saveCurrentProject = function() {
    if (window.projectManager) {
        window.projectManager.saveCurrentProject();
    }
};

window.hideConfirmDialog = function() {
    if (window.projectManager) {
        window.projectManager.hideConfirmDialog();
    }
};

window.confirmDeleteProject = function() {
    if (window.projectManager) {
        window.projectManager.confirmDeleteProject();
    }
};

// 导出项目管理器
window.ProjectManager = ProjectManager;