// 配置管理模块
class ConfigManager {
    constructor() {
        this.defaultConfig = {
            // APP信息
            appName: 'Bompay',
            appIcon: 'B',
            mainTitle: 'Download Bompay today',
            subtitle: '体验全新的支付方式，让生活更简单',

            // 下载链接
            appStoreLink: 'https://apps.apple.com/app/your-app',
            googlePlayLink: 'https://play.google.com/store/apps/details?id=your.app',

            // 3D模型路径
            modelPath: 'models/apple_iphone_15_pro_max_black.glb',

            // 颜色主题
            primaryColor: '#667eea',
            secondaryColor: '#764ba2'
        };
        
        this.config = { ...this.defaultConfig };
        this.originalConfig = { ...this.defaultConfig };
        
        // 自动保存相关
        this.autoSaveTimer = null;
        this.autoSaveDelay = 3000; // 3秒延迟
        this.currentProjectId = null;
        
        // 从localStorage加载最后的项目
        this.loadLastProject();
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.applyConfig();
        this.initTabSwitching();
        this.initTemplateSwitching();
        this.initConfigPanelToggle();
    }

    // 应用配置到页面
    applyConfig() {
        document.querySelector('.logo-text').textContent = this.config.appName;
        document.querySelector('.logo-icon').textContent = this.config.appIcon;
        document.querySelector('.main-title').textContent = this.config.mainTitle;
        document.querySelector('.subtitle').textContent = this.config.subtitle;
        document.querySelector('.app-icon-preview').textContent = this.config.appIcon;
        document.querySelector('.app-name-preview').textContent = this.config.appName;

        document.querySelectorAll('.download-btn')[0].href = this.config.appStoreLink;
        document.querySelectorAll('.download-btn')[1].href = this.config.googlePlayLink;

        // 初始化配置面板中的输入框值
        const appNameInput = document.getElementById('appNameInput');
        const mainTitleInput = document.getElementById('mainTitleInput');
        const appDescInput = document.getElementById('appDescInput');
        const appStoreInput = document.getElementById('appStoreInput');
        const googlePlayInput = document.getElementById('googlePlayInput');

        if (appNameInput) appNameInput.value = this.config.appName;
        if (mainTitleInput) mainTitleInput.value = this.config.mainTitle;
        if (appDescInput) appDescInput.value = this.config.subtitle;
        if (appStoreInput) appStoreInput.value = this.config.appStoreLink;
        if (googlePlayInput) googlePlayInput.value = this.config.googlePlayLink;
    }

    // 设置事件监听器
    setupEventListeners() {
        const appNameInput = document.getElementById('appNameInput');
        const mainTitleInput = document.getElementById('mainTitleInput');
        const appDescInput = document.getElementById('appDescInput');
        const bgColorInput = document.getElementById('bgColorInput');
        const gradientColorInput = document.getElementById('gradientColorInput');
        const appStoreInput = document.getElementById('appStoreInput');
        const googlePlayInput = document.getElementById('googlePlayInput');
        const showAppStoreCheckbox = document.getElementById('showAppStore');
        const showGooglePlayCheckbox = document.getElementById('showGooglePlay');

        // APP名称变更
        if (appNameInput) {
            appNameInput.addEventListener('input', (e) => {
                const newName = e.target.value || this.config.appName;
                document.querySelector('.logo-text').textContent = newName;
                document.querySelector('.app-name-preview').textContent = newName;
                this.config.appName = newName;
                this.triggerAutoSave();
            });
        }

        // 主标题变更
        if (mainTitleInput) {
            mainTitleInput.addEventListener('input', (e) => {
                const newTitle = e.target.value || this.config.mainTitle;
                document.querySelector('.main-title').textContent = newTitle;
                this.config.mainTitle = newTitle;
                this.triggerAutoSave();
            });
        }

        // APP描述变更
        if (appDescInput) {
            appDescInput.addEventListener('input', (e) => {
                const newDesc = e.target.value || this.config.subtitle;
                document.querySelector('.subtitle').textContent = newDesc;
                this.config.subtitle = newDesc;
                this.triggerAutoSave();
            });
        }

        // 背景颜色变更
        if (bgColorInput) {
            bgColorInput.addEventListener('input', (e) => {
                const newColor = e.target.value;
                this.updateBackgroundColor(newColor, gradientColorInput.value);
                this.config.primaryColor = newColor;
                this.triggerAutoSave();
            });
        }

        // 渐变颜色变更
        if (gradientColorInput) {
            gradientColorInput.addEventListener('input', (e) => {
                const newColor = e.target.value;
                this.updateBackgroundColor(bgColorInput.value, newColor);
                this.config.secondaryColor = newColor;
                this.triggerAutoSave();
            });
        }

        // App Store链接变更
        if (appStoreInput) {
            appStoreInput.addEventListener('input', (e) => {
                const newLink = e.target.value || this.config.appStoreLink;
                document.querySelectorAll('.download-btn')[0].href = newLink;
                this.config.appStoreLink = newLink;
                this.triggerAutoSave();
            });
        }

        // Google Play链接变更
        if (googlePlayInput) {
            googlePlayInput.addEventListener('input', (e) => {
                const newLink = e.target.value || this.config.googlePlayLink;
                document.querySelectorAll('.download-btn')[1].href = newLink;
                this.config.googlePlayLink = newLink;
                this.triggerAutoSave();
            });
        }

        // App Store显示控制
        if (showAppStoreCheckbox) {
            showAppStoreCheckbox.addEventListener('change', (e) => {
                const appStoreBtn = document.querySelectorAll('.download-btn')[0];
                if (e.target.checked) {
                    appStoreBtn.style.display = 'inline-flex';
                } else {
                    appStoreBtn.style.display = 'none';
                }
            });
        }

        // Google Play显示控制
        if (showGooglePlayCheckbox) {
            showGooglePlayCheckbox.addEventListener('change', (e) => {
                const googlePlayBtn = document.querySelectorAll('.download-btn')[1];
                if (e.target.checked) {
                    googlePlayBtn.style.display = 'inline-flex';
                } else {
                    googlePlayBtn.style.display = 'none';
                }
            });
        }
    }

    // 背景颜色更新函数
    updateBackgroundColor(primaryColor, secondaryColor = null) {
        // 如果没有提供第二个颜色，自动计算
        const gradientColor = secondaryColor || this.adjustBrightness(primaryColor, -40);
        
        // 更新body背景
        document.body.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${gradientColor} 100%)`;
        
        // 更新屏幕内容背景
        const screenInner = document.querySelector('.screen-inner');
        if (screenInner) {
            screenInner.style.background = `linear-gradient(135deg, ${primaryColor} 0%, ${gradientColor} 100%)`;
        }

        // 更新logo图标颜色
        const logoIcon = document.querySelector('.logo-icon');
        if (logoIcon && !logoIcon.style.backgroundImage) {
            logoIcon.style.color = primaryColor;
        }

        // 更新app图标预览颜色
        const appIconPreview = document.querySelector('.app-icon-preview');
        if (appIconPreview && !appIconPreview.style.backgroundImage) {
            appIconPreview.style.color = primaryColor;
        }
    }

    // 颜色亮度调整函数
    adjustBrightness(hex, percent) {
        const num = parseInt(hex.replace("#",""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255))
            .toString(16).slice(1);
    }

    // 标签页切换功能
    initTabSwitching() {
        const toolbarTabs = document.querySelectorAll('.toolbar-tab');
        const configSections = document.querySelectorAll('.config-section');

        toolbarTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // 如果配置面板隐藏，先显示它
                if (!this.isConfigPanelVisible) {
                    this.showConfigPanel();
                }
                
                // 移除所有活动状态
                toolbarTabs.forEach(t => t.classList.remove('active'));
                configSections.forEach(s => s.classList.remove('active'));
                
                // 激活当前标签和对应配置区域
                tab.classList.add('active');
                const targetSection = document.querySelector(`[data-section="${targetTab}"]`);
                if (targetSection) {
                    targetSection.classList.add('active');
                }
            });
        });
    }

    // 模板切换功能
    initTemplateSwitching() {
        const templateItems = document.querySelectorAll('.template-item');
        const colorSchemeItems = document.querySelectorAll('.color-scheme-item');

        // 模板布局切换
        templateItems.forEach(item => {
            item.addEventListener('click', () => {
                templateItems.forEach(t => t.classList.remove('active'));
                item.classList.add('active');
                
                const template = item.dataset.template;
                this.switchTemplate(template);
            });
        });

        // 配色方案切换
        colorSchemeItems.forEach(item => {
            item.addEventListener('click', () => {
                colorSchemeItems.forEach(c => c.classList.remove('active'));
                item.classList.add('active');
                
                const scheme = item.dataset.scheme;
                this.applyColorScheme(scheme);
            });
        });
    }

    // 切换模板布局
    switchTemplate(template) {
        const container = document.querySelector('.container');
        
        // 移除所有模板类
        container.classList.remove('template-classic', 'template-center', 'template-minimal', 'template-elegant', 'template-light', 'template-premium');
        
        // 应用新模板类
        container.classList.add(`template-${template}`);
        
        console.log(`切换到模板: ${template}`);
    }

    // 应用配色方案
    applyColorScheme(scheme) {
        const colorSchemes = {
            blue: { primary: '#667eea', secondary: '#764ba2' },
            purple: { primary: '#8B5CF6', secondary: '#A855F7' },
            green: { primary: '#10B981', secondary: '#059669' },
            orange: { primary: '#F97316', secondary: '#EA580C' }
        };
        
        const colors = colorSchemes[scheme];
        if (colors) {
            this.updateBackgroundColor(colors.primary, colors.secondary);
            
            // 同步更新设计面板中的颜色选择器
            const bgColorInput = document.getElementById('bgColorInput');
            const gradientColorInput = document.getElementById('gradientColorInput');
            if (bgColorInput) bgColorInput.value = colors.primary;
            if (gradientColorInput) gradientColorInput.value = colors.secondary;
            
            this.config.primaryColor = colors.primary;
            this.config.secondaryColor = colors.secondary;
            
            console.log(`应用配色方案: ${scheme}`);
        }
    }

    // 获取配置
    getConfig() {
        return this.config;
    }

    // 更新配置
    updateConfig(newConfig) {
        this.config = { ...this.config, ...newConfig };
        this.applyConfig();
        this.triggerAutoSave();
    }
    
    // 触发自动保存
    triggerAutoSave() {
        // 清除之前的定时器
        if (this.autoSaveTimer) {
            clearTimeout(this.autoSaveTimer);
        }
        
        // 显示保存中状态
        this.showSaveStatus('正在保存...');
        
        // 设置新的定时器
        this.autoSaveTimer = setTimeout(() => {
            this.autoSave();
        }, this.autoSaveDelay);
    }
    
    // 执行自动保存
    autoSave() {
        try {
            // 如果没有当前项目ID，创建新项目
            if (!this.currentProjectId) {
                const projectData = {
                    id: Date.now().toString(),
                    name: `自动保存_${new Date().toLocaleDateString()}`,
                    timestamp: new Date().toISOString(),
                    config: { ...this.config },
                    template: this.getCurrentTemplate(),
                    colorScheme: this.getCurrentColorScheme(),
                    customImages: this.getCustomImages()
                };
                
                this.currentProjectId = projectData.id;
                
                // 保存到localStorage
                const savedProjects = this.getSavedProjects();
                savedProjects.push(projectData);
                localStorage.setItem('designProjects', JSON.stringify(savedProjects));
                localStorage.setItem('lastProjectId', this.currentProjectId);
            } else {
                // 更新现有项目
                const savedProjects = this.getSavedProjects();
                const index = savedProjects.findIndex(p => p.id === this.currentProjectId);
                
                if (index !== -1) {
                    savedProjects[index] = {
                        ...savedProjects[index],
                        timestamp: new Date().toISOString(),
                        config: { ...this.config },
                        template: this.getCurrentTemplate(),
                        colorScheme: this.getCurrentColorScheme(),
                        customImages: this.getCustomImages()
                    };
                    localStorage.setItem('designProjects', JSON.stringify(savedProjects));
                }
            }
            
            // 更新原始配置
            this.originalConfig = { ...this.config };
            
            // 显示保存成功
            this.showSaveStatus('已自动保存', 'success');
            
        } catch (error) {
            console.error('自动保存失败:', error);
            this.showSaveStatus('保存失败', 'error');
        }
    }
    
    // 显示保存状态
    showSaveStatus(message, type = 'info') {
        // 移除旧的状态提示
        const oldStatus = document.querySelector('.auto-save-status');
        if (oldStatus) {
            oldStatus.remove();
        }
        
        // 创建新的状态提示
        const status = document.createElement('div');
        status.className = 'auto-save-status';
        status.textContent = message;
        status.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            padding: 8px 16px;
            background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#6B7280'};
            color: white;
            border-radius: 6px;
            font-size: 14px;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        document.body.appendChild(status);
        
        // 显示动画
        setTimeout(() => {
            status.style.opacity = '1';
            status.style.transform = 'translateY(0)';
        }, 10);
        
        // 自动隐藏
        if (type !== 'info') {
            setTimeout(() => {
                status.style.opacity = '0';
                status.style.transform = 'translateY(10px)';
                setTimeout(() => status.remove(), 300);
            }, 2000);
        }
    }
    
    // 加载最后的项目
    loadLastProject() {
        const lastProjectId = localStorage.getItem('lastProjectId');
        if (lastProjectId) {
            const savedProjects = this.getSavedProjects();
            const project = savedProjects.find(p => p.id === lastProjectId);
            if (project) {
                this.currentProjectId = project.id;
                this.config = { ...project.config };
                this.originalConfig = { ...project.config };
            }
        }
    }

    // 保存作品
    saveProject(projectName) {
        const projectData = {
            id: Date.now().toString(),
            name: projectName || `设计作品_${new Date().toLocaleString()}`,
            timestamp: new Date().toISOString(),
            config: { ...this.config },
            template: this.getCurrentTemplate(),
            colorScheme: this.getCurrentColorScheme(),
            customImages: this.getCustomImages()
        };
        
        // 保存到localStorage
        const savedProjects = this.getSavedProjects();
        savedProjects.push(projectData);
        localStorage.setItem('designProjects', JSON.stringify(savedProjects));
        
        console.log('作品已保存:', projectData);
        
        // 更新原始配置，表示已保存
        this.originalConfig = { ...this.config };
        
        return projectData;
    }

    // 加载作品
    loadProject(projectId) {
        const savedProjects = this.getSavedProjects();
        const project = savedProjects.find(p => p.id === projectId);
        
        if (!project) {
            console.error('找不到指定的作品');
            return false;
        }
        
        // 恢复配置
        this.config = { ...project.config };
        
        // 恢复模板
        if (project.template) {
            this.switchTemplate(project.template);
            this.setActiveTemplate(project.template);
        }
        
        // 恢复配色方案
        if (project.colorScheme) {
            this.applyColorScheme(project.colorScheme);
            this.setActiveColorScheme(project.colorScheme);
        }
        
        // 恢复自定义图片
        if (project.customImages) {
            this.restoreCustomImages(project.customImages);
        }
        
        // 应用配置到界面
        this.applyConfig();
        
        // 设置当前项目ID
        this.currentProjectId = projectId;
        localStorage.setItem('lastProjectId', projectId);
        this.originalConfig = { ...this.config };
        
        console.log('作品已加载:', project);
        return true;
    }

    // 删除作品
    deleteProject(projectId) {
        const savedProjects = this.getSavedProjects();
        const filteredProjects = savedProjects.filter(p => p.id !== projectId);
        localStorage.setItem('designProjects', JSON.stringify(filteredProjects));
        console.log('作品已删除:', projectId);
    }

    // 获取所有保存的作品
    getSavedProjects() {
        const saved = localStorage.getItem('designProjects');
        return saved ? JSON.parse(saved) : [];
    }

    // 获取当前模板
    getCurrentTemplate() {
        const container = document.querySelector('.container');
        const classList = container.classList;
        
        for (let className of classList) {
            if (className.startsWith('template-')) {
                return className.replace('template-', '');
            }
        }
        return 'classic'; // 默认模板
    }

    // 获取当前配色方案
    getCurrentColorScheme() {
        const activeScheme = document.querySelector('.color-scheme-item.active');
        return activeScheme ? activeScheme.dataset.scheme : 'blue';
    }

    // 获取自定义图片
    getCustomImages() {
        const logoIcon = document.querySelector('.logo-icon');
        const previewImg = document.getElementById('previewImg');
        
        return {
            appIcon: logoIcon.style.backgroundImage || null,
            screenshot: previewImg.src || null
        };
    }

    // 恢复自定义图片
    restoreCustomImages(images) {
        if (images.appIcon) {
            const logoIcon = document.querySelector('.logo-icon');
            const appIconPreview = document.querySelector('.app-icon-preview');
            
            logoIcon.style.backgroundImage = images.appIcon;
            logoIcon.style.backgroundSize = 'cover';
            logoIcon.style.backgroundPosition = 'center';
            logoIcon.textContent = '';
            
            appIconPreview.style.backgroundImage = images.appIcon;
            appIconPreview.style.backgroundSize = 'cover';
            appIconPreview.style.backgroundPosition = 'center';
            appIconPreview.textContent = '';
        }
        
        if (images.screenshot) {
            const previewImg = document.getElementById('previewImg');
            if (previewImg) {
                previewImg.src = images.screenshot;
            }
        }
    }

    // 设置活动模板
    setActiveTemplate(template) {
        const templateItems = document.querySelectorAll('.template-item');
        templateItems.forEach(item => item.classList.remove('active'));
        
        const targetTemplate = document.querySelector(`[data-template="${template}"]`);
        if (targetTemplate) {
            targetTemplate.classList.add('active');
        }
    }

    // 设置活动配色方案
    setActiveColorScheme(scheme) {
        const colorSchemeItems = document.querySelectorAll('.color-scheme-item');
        colorSchemeItems.forEach(item => item.classList.remove('active'));
        
        const targetScheme = document.querySelector(`[data-scheme="${scheme}"]`);
        if (targetScheme) {
            targetScheme.classList.add('active');
        }
    }

    // 初始化配置面板切换功能
    initConfigPanelToggle() {
        this.isConfigPanelVisible = true;
    }

    // 切换配置面板显示/隐藏
    toggleConfigPanel() {
        const configPanel = document.querySelector('.left-config-panel');
        if (!configPanel) return;

        if (this.isConfigPanelVisible) {
            configPanel.style.transform = 'translateX(-100%) translateY(-50%)';
            configPanel.style.opacity = '0';
            this.isConfigPanelVisible = false;
            // 关闭时取消顶部选中状态
            this.clearActiveToolbarTabs();
        } else {
            configPanel.style.transform = 'translateY(-50%)';
            configPanel.style.opacity = '1';
            this.isConfigPanelVisible = true;
        }
    }

    // 显示配置面板
    showConfigPanel() {
        const configPanel = document.querySelector('.left-config-panel');
        if (!configPanel) return;

        configPanel.style.transform = 'translateY(-50%)';
        configPanel.style.opacity = '1';
        this.isConfigPanelVisible = true;
    }

    // 清除顶部工具栏的选中状态
    clearActiveToolbarTabs() {
        const toolbarTabs = document.querySelectorAll('.toolbar-tab');
        toolbarTabs.forEach(tab => tab.classList.remove('active'));
    }
    
    // 检查是否有未保存的更改
    hasUnsavedChanges() {
        return JSON.stringify(this.config) !== JSON.stringify(this.originalConfig);
    }
    
    // 重置为默认配置
    resetToDefaults() {
        this.config = { ...this.defaultConfig };
        this.originalConfig = { ...this.defaultConfig };
        this.currentProjectId = null;
        localStorage.removeItem('lastProjectId');
        this.applyConfig();
        
        // 重置所有输入框的值
        this.updateAllInputs();
        
        // 触发自动保存创建新项目
        this.triggerAutoSave();
    }
    
    // 更新所有输入框的值
    updateAllInputs() {
        const appNameInput = document.getElementById('appNameInput');
        const mainTitleInput = document.getElementById('mainTitleInput');
        const appDescInput = document.getElementById('appDescInput');
        const appStoreInput = document.getElementById('appStoreInput');
        const googlePlayInput = document.getElementById('googlePlayInput');
        const primaryColorInput = document.getElementById('primaryColorInput');
        const secondaryColorInput = document.getElementById('secondaryColorInput');
        
        if (appNameInput) appNameInput.value = this.config.appName;
        if (mainTitleInput) mainTitleInput.value = this.config.mainTitle;
        if (appDescInput) appDescInput.value = this.config.subtitle;
        if (appStoreInput) appStoreInput.value = this.config.appStoreLink;
        if (googlePlayInput) googlePlayInput.value = this.config.googlePlayLink;
        if (primaryColorInput) primaryColorInput.value = this.config.primaryColor;
        if (secondaryColorInput) secondaryColorInput.value = this.config.secondaryColor;
        
        // 更新颜色渐变
        this.updateColorGradient();
    }
}

// 全局函数，供HTML调用
function toggleConfigPanel() {
    if (window.configManager) {
        window.configManager.toggleConfigPanel();
    }
}

// 导出配置管理器
window.ConfigManager = ConfigManager;