// 图片上传管理模块
class UploadManager {
    constructor(configManager, model3DManager) {
        this.configManager = configManager;
        this.model3DManager = model3DManager;
        this.init();
    }

    // 初始化上传功能
    init() {
        this.setupEventListeners();
    }

    // 设置事件监听器
    setupEventListeners() {
        const uploadInput = document.getElementById('screenUpload');
        const iconUploadInput = document.getElementById('iconUpload');

        // 图片上传处理
        if (uploadInput) {
            uploadInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.updateScreenWithImage(e.target.result);
                        this.showImagePreview(e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        // APP图标上传处理
        if (iconUploadInput) {
            iconUploadInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        this.updateAppIcon(e.target.result);
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }

    // 更新3D模型屏幕图像
    updateScreenWithImage(imageSrc) {
        this.model3DManager.updateScreenWithImage(imageSrc);
    }

    // 显示图片预览
    showImagePreview(imageSrc) {
        const preview = document.getElementById('imagePreview');
        const previewImg = document.getElementById('previewImg');

        if (preview && previewImg) {
            previewImg.src = imageSrc;
            preview.classList.add('show');

            // 3秒后自动隐藏预览
            setTimeout(() => {
                preview.classList.remove('show');
            }, 3000);
        }
    }

    // 使用默认屏幕
    useDefaultScreen() {
        const defaultImage = this.model3DManager.generateDefaultScreen();
        this.updateScreenWithImage(defaultImage);
        this.showImagePreview(defaultImage);
    }

    // APP图标更新函数
    updateAppIcon(iconSrc) {
        // 更新主logo图标
        const logoIcon = document.querySelector('.logo-icon');
        if (logoIcon) {
            logoIcon.style.backgroundImage = `url(${iconSrc})`;
            logoIcon.style.backgroundSize = 'cover';
            logoIcon.style.backgroundPosition = 'center';
            logoIcon.textContent = '';
        }

        // 更新屏幕预览中的图标
        const appIconPreview = document.querySelector('.app-icon-preview');
        if (appIconPreview) {
            appIconPreview.style.backgroundImage = `url(${iconSrc})`;
            appIconPreview.style.backgroundSize = 'cover';
            appIconPreview.style.backgroundPosition = 'center';
            appIconPreview.textContent = '';
        }
    }

    // 验证文件类型
    validateFileType(file, allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']) {
        return allowedTypes.includes(file.type);
    }

    // 验证文件大小
    validateFileSize(file, maxSize = 5 * 1024 * 1024) { // 默认5MB
        return file.size <= maxSize;
    }

    // 压缩图片
    compressImage(file, quality = 0.8) {
        return new Promise((resolve) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                // 设置画布尺寸
                const maxWidth = 1200;
                const maxHeight = 1200;
                let { width, height } = img;

                // 计算缩放比例
                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                // 绘制图片
                ctx.drawImage(img, 0, 0, width, height);

                // 转换为blob
                canvas.toBlob(resolve, 'image/jpeg', quality);
            };

            img.src = URL.createObjectURL(file);
        });
    }

    // 处理拖拽上传
    setupDragAndDrop(targetElement) {
        if (!targetElement) return;

        targetElement.addEventListener('dragover', (e) => {
            e.preventDefault();
            targetElement.classList.add('drag-over');
        });

        targetElement.addEventListener('dragleave', (e) => {
            e.preventDefault();
            targetElement.classList.remove('drag-over');
        });

        targetElement.addEventListener('drop', (e) => {
            e.preventDefault();
            targetElement.classList.remove('drag-over');

            const files = e.dataTransfer.files;
            if (files.length > 0) {
                const file = files[0];
                if (this.validateFileType(file)) {
                    this.handleFileUpload(file);
                } else {
                    console.error('不支持的文件类型');
                }
            }
        });
    }

    // 处理文件上传
    async handleFileUpload(file) {
        try {
            // 验证文件
            if (!this.validateFileType(file)) {
                throw new Error('不支持的文件类型');
            }

            if (!this.validateFileSize(file)) {
                throw new Error('文件大小超过限制');
            }

            // 压缩图片（如果需要）
            let processedFile = file;
            if (file.size > 1024 * 1024) { // 大于1MB时压缩
                processedFile = await this.compressImage(file);
            }

            // 读取文件
            const reader = new FileReader();
            reader.onload = (e) => {
                this.updateScreenWithImage(e.target.result);
                this.showImagePreview(e.target.result);
            };
            reader.readAsDataURL(processedFile);

        } catch (error) {
            console.error('文件处理失败:', error);
            // 可以添加用户提示
        }
    }

    // 重置上传状态
    resetUpload() {
        const uploadInputs = document.querySelectorAll('input[type="file"]');
        uploadInputs.forEach(input => {
            input.value = '';
        });

        // 隐藏预览
        const preview = document.getElementById('imagePreview');
        if (preview) {
            preview.classList.remove('show');
        }
    }

    // 获取上传的文件信息
    getUploadInfo() {
        return {
            hasScreenImage: this.model3DManager.currentScreenMesh !== null,
            hasCustomIcon: document.querySelector('.logo-icon').style.backgroundImage !== ''
        };
    }
}

// 全局函数，供HTML调用
window.useDefaultScreen = function() {
    if (window.uploadManager) {
        window.uploadManager.useDefaultScreen();
    }
};

// 导出上传管理器
window.UploadManager = UploadManager;