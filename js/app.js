// 主应用管理器
class AppManager {
    constructor() {
        this.configManager = null;
        this.model3DManager = null;
        this.uploadManager = null;
        this.downloadManager = null;
        this.projectManager = null;
        this.isInitialized = false;
    }

    // 初始化应用
    async init() {
        try {
            console.log('开始初始化应用...');
            
            // 初始化配置管理器
            this.configManager = new ConfigManager();
            console.log('配置管理器初始化完成');
            
            // 初始化3D模型管理器
            this.model3DManager = new Model3DManager(this.configManager);
            console.log('3D模型管理器初始化完成');
            
            // 初始化上传管理器
            this.uploadManager = new UploadManager(this.configManager, this.model3DManager);
            console.log('上传管理器初始化完成');
            
            // 初始化下载管理器
            this.downloadManager = new DownloadManager(this.configManager);
            console.log('下载管理器初始化完成');
            
            // 初始化项目管理器
            this.projectManager = new ProjectManager(this.configManager);
            console.log('项目管理器初始化完成');
            
            // 设置全局引用
            window.configManager = this.configManager;
            window.model3DManager = this.model3DManager;
            window.uploadManager = this.uploadManager;
            window.downloadManager = this.downloadManager;
            window.projectManager = this.projectManager;
            
            // 初始化3D场景
            await this.init3DScene();
            
            // 初始化Lucide图标
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
                console.log('Lucide图标初始化完成');
            }
            
            this.isInitialized = true;
            console.log('应用初始化完成！');
            
        } catch (error) {
            console.error('应用初始化失败:', error);
            this.showInitError(error);
        }
    }

    // 初始化3D场景
    async init3DScene() {
        return new Promise((resolve, reject) => {
            try {
                // 等待DOM完全加载
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', () => {
                        this.model3DManager.init3D();
                        resolve();
                    });
                } else {
                    this.model3DManager.init3D();
                    resolve();
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    // 显示初始化错误
    showInitError(error) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 20px;
            border-radius: 8px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            max-width: 400px;
            text-align: center;
        `;
        errorDiv.innerHTML = `
            <h3 style="margin: 0 0 10px 0;">应用初始化失败</h3>
            <p style="margin: 0 0 10px 0;">${error.message}</p>
            <button onclick="this.parentNode.remove()" style="
                background: white;
                color: red;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
            ">关闭</button>
        `;
        document.body.appendChild(errorDiv);
    }

    // 获取应用状态
    getAppStatus() {
        return {
            isInitialized: this.isInitialized,
            hasConfigManager: !!this.configManager,
            hasModel3DManager: !!this.model3DManager,
            hasUploadManager: !!this.uploadManager,
            hasDownloadManager: !!this.downloadManager,
            hasProjectManager: !!this.projectManager,
            model3DLoaded: this.model3DManager && !!this.model3DManager.getModel()
        };
    }

    // 重新初始化应用
    async reinitialize() {
        console.log('重新初始化应用...');
        this.isInitialized = false;
        await this.init();
    }

    // 销毁应用
    destroy() {
        // 清理事件监听器和资源
        if (this.model3DManager && this.model3DManager.getRenderer()) {
            const renderer = this.model3DManager.getRenderer();
            renderer.dispose();
        }
        
        // 清理全局引用
        window.configManager = null;
        window.model3DManager = null;
        window.uploadManager = null;
        window.downloadManager = null;
        window.projectManager = null;
        
        this.configManager = null;
        this.model3DManager = null;
        this.uploadManager = null;
        this.downloadManager = null;
        this.projectManager = null;
        this.isInitialized = false;
        
        console.log('应用已销毁');
    }

    // 检查依赖
    checkDependencies() {
        const dependencies = {
            THREE: typeof THREE !== 'undefined',
            html2canvas: typeof html2canvas !== 'undefined',
            jsPDF: typeof window.jspdf !== 'undefined',
            lucide: typeof lucide !== 'undefined'
        };

        const missing = Object.keys(dependencies).filter(key => !dependencies[key]);
        
        if (missing.length > 0) {
            console.warn('缺少依赖库:', missing);
            return false;
        }
        
        return true;
    }

    // 获取性能信息
    getPerformanceInfo() {
        if (!this.model3DManager) return null;
        
        const renderer = this.model3DManager.getRenderer();
        if (!renderer) return null;
        
        return {
            drawCalls: renderer.info.render.calls,
            triangles: renderer.info.render.triangles,
            points: renderer.info.render.points,
            lines: renderer.info.render.lines,
            geometries: renderer.info.memory.geometries,
            textures: renderer.info.memory.textures
        };
    }
}

// 创建全局应用实例
window.appManager = new AppManager();

// 页面加载完成后初始化应用
window.addEventListener('load', async () => {
    console.log('页面加载完成，开始初始化应用...');
    
    // 检查依赖
    if (!window.appManager.checkDependencies()) {
        console.error('依赖检查失败，应用可能无法正常工作');
    }
    
    // 初始化应用
    await window.appManager.init();
});

// 页面卸载时清理资源
window.addEventListener('beforeunload', () => {
    if (window.appManager) {
        window.appManager.destroy();
    }
});

// 导出应用管理器
window.AppManager = AppManager;