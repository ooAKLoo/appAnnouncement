// 下载功能管理模块
class DownloadManager {
    constructor(configManager) {
        this.configManager = configManager;
        this.init();
    }

    // 初始化下载功能
    init() {
        this.setupEventListeners();
    }

    // 设置事件监听器
    setupEventListeners() {
        // 点击外部关闭下载菜单
        document.addEventListener('click', (e) => {
            const dropdown = document.querySelector('.download-dropdown');
            if (dropdown && !dropdown.contains(e.target)) {
                dropdown.classList.remove('active');
                const menu = document.getElementById('downloadMenu');
                if (menu) menu.classList.remove('show');
            }
        });
    }

    // 切换下载菜单
    toggleDownloadMenu() {
        const dropdown = document.querySelector('.download-dropdown');
        const menu = document.getElementById('downloadMenu');
        
        if (dropdown && menu) {
            dropdown.classList.toggle('active');
            menu.classList.toggle('show');
        }
    }

    // 下载函数
    async downloadAs(format) {
        try {
            // 关闭下载菜单
            const dropdown = document.querySelector('.download-dropdown');
            const menu = document.getElementById('downloadMenu');
            if (dropdown) dropdown.classList.remove('active');
            if (menu) menu.classList.remove('show');
            
            // 临时隐藏工具栏和配置面板
            const elementsToHide = [
                '.top-toolbar',
                '.left-config-panel',
                '.image-preview'
            ];
            
            const hiddenElements = [];
            elementsToHide.forEach(selector => {
                const element = document.querySelector(selector);
                if (element) {
                    hiddenElements.push({
                        element,
                        originalDisplay: element.style.display
                    });
                    element.style.display = 'none';
                }
            });
            
            // 获取要截图的区域
            const container = document.querySelector('.container');
            if (!container) {
                throw new Error('找不到容器元素');
            }
            
            // 使用 html2canvas 截图
            const canvas = await html2canvas(container, {
                backgroundColor: null,
                scale: 2, // 提高图片质量
                useCORS: true,
                allowTaint: true,
                width: container.scrollWidth,
                height: container.scrollHeight,
                logging: false, // 关闭日志
                foreignObjectRendering: true
            });
            
            const config = this.configManager.getConfig();
            const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
            const appName = config.appName || 'APP';
            
            await this.processDownload(canvas, format, appName, timestamp);
            
            // 恢复显示工具栏和配置面板
            hiddenElements.forEach(({ element, originalDisplay }) => {
                element.style.display = originalDisplay || '';
            });
            
        } catch (error) {
            console.error('下载失败:', error);
            this.showErrorMessage('下载失败，请稍后重试');
            
            // 确保恢复UI显示
            this.restoreUIElements();
        }
    }

    // 处理下载逻辑
    async processDownload(canvas, format, appName, timestamp) {
        switch (format) {
            case 'png':
                this.downloadPNG(canvas, appName, timestamp);
                break;
            case 'jpg':
                this.downloadJPG(canvas, appName, timestamp);
                break;
            case 'pdf':
                await this.downloadPDF(canvas, appName, timestamp);
                break;
            default:
                throw new Error('不支持的格式');
        }
    }

    // 下载PNG格式
    downloadPNG(canvas, appName, timestamp) {
        const link = document.createElement('a');
        link.download = `${appName}-宣发页面-${timestamp}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    // 下载JPG格式
    downloadJPG(canvas, appName, timestamp) {
        const link = document.createElement('a');
        link.download = `${appName}-宣发页面-${timestamp}.jpg`;
        link.href = canvas.toDataURL('image/jpeg', 0.9);
        link.click();
    }

    // 下载PDF格式
    async downloadPDF(canvas, appName, timestamp) {
        if (!window.jspdf) {
            throw new Error('PDF库未加载');
        }

        const { jsPDF } = window.jspdf;
        const imgData = canvas.toDataURL('image/png');
        
        // 计算PDF尺寸
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = imgWidth / imgHeight;
        
        let pdfWidth, pdfHeight;
        if (ratio > 1) {
            // 横向
            pdfWidth = 297; // A4 横向宽度 (mm)
            pdfHeight = 297 / ratio;
        } else {
            // 纵向
            pdfHeight = 210; // A4 纵向高度 (mm) 
            pdfWidth = 210 * ratio;
        }
        
        const pdf = new jsPDF(ratio > 1 ? 'landscape' : 'portrait', 'mm', 'a4');
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${appName}-宣发页面-${timestamp}.pdf`);
    }

    // 显示错误消息
    showErrorMessage(message) {
        // 创建临时错误提示
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.9);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
        `;
        errorDiv.textContent = message;
        document.body.appendChild(errorDiv);

        // 3秒后移除
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, 3000);
    }

    // 显示成功消息
    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 128, 0, 0.9);
            color: white;
            padding: 16px 24px;
            border-radius: 8px;
            z-index: 10000;
            font-size: 14px;
            font-weight: 500;
        `;
        successDiv.textContent = message;
        document.body.appendChild(successDiv);

        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.parentNode.removeChild(successDiv);
            }
        }, 2000);
    }

    // 恢复UI元素显示
    restoreUIElements() {
        const elementsToRestore = [
            '.top-toolbar',
            '.left-config-panel',
            '.image-preview'
        ];
        
        elementsToRestore.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.style.display = '';
            }
        });
    }

    // 检查浏览器支持
    checkBrowserSupport() {
        const support = {
            canvas: !!document.createElement('canvas').getContext,
            html2canvas: typeof html2canvas !== 'undefined',
            jsPDF: typeof window.jspdf !== 'undefined'
        };

        return support;
    }

    // 获取下载统计
    getDownloadStats() {
        // 可以添加下载统计逻辑
        return {
            totalDownloads: localStorage.getItem('download_count') || 0,
            lastDownload: localStorage.getItem('last_download') || null
        };
    }

    // 更新下载统计
    updateDownloadStats(format) {
        const currentCount = parseInt(localStorage.getItem('download_count') || '0');
        localStorage.setItem('download_count', (currentCount + 1).toString());
        localStorage.setItem('last_download', new Date().toISOString());
        localStorage.setItem('last_download_format', format);
    }

    // 清除下载缓存
    clearDownloadCache() {
        localStorage.removeItem('download_count');
        localStorage.removeItem('last_download');
        localStorage.removeItem('last_download_format');
    }
}

// 全局函数，供HTML调用
window.toggleDownloadMenu = function() {
    if (window.downloadManager) {
        window.downloadManager.toggleDownloadMenu();
    }
};

window.downloadAs = function(format) {
    if (window.downloadManager) {
        window.downloadManager.downloadAs(format);
    }
};

// 导出下载管理器
window.DownloadManager = DownloadManager;