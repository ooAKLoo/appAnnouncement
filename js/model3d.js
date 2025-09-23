// 3D模型管理模块
class Model3DManager {
    constructor(configManager) {
        this.configManager = configManager;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.model = null;
        this.controls = null;
        this.currentScreenMesh = null;
    }

    // 初始化3D场景
    init3D() {
        const container = document.getElementById('canvas-container');
        const width = container.clientWidth;
        const height = container.clientHeight;

        // 创建场景
        this.scene = new THREE.Scene();
        
        // 创建相机
        this.camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 1000);
        this.camera.position.set(0, 0, 5);

        // 创建渲染器 - 添加正确的渲染设置
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            alpha: true 
        });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        
        // 关键：设置正确的色彩空间和色调映射
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.4;
        
        container.appendChild(this.renderer.domElement);

        // 添加环境光照
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 5, 5);
        directionalLight.castShadow = true;
        this.scene.add(directionalLight);

        const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
        backLight.position.set(-5, 3, -5);
        this.scene.add(backLight);

        // 添加点光源增强高光
        const pointLight = new THREE.PointLight(0xffffff, 0.5);
        pointLight.position.set(2, 3, 4);
        this.scene.add(pointLight);

        // 创建简单的环境贴图（渐变天空）
        const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
        pmremGenerator.compileEquirectangularShader();
        
        // 创建渐变环境
        const envScene = new THREE.Scene();
        envScene.background = new THREE.Color(0xf0f0f0);
        const envTexture = pmremGenerator.fromScene(envScene).texture;
        this.scene.environment = envTexture;

        // 轨道控制
        this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.rotateSpeed = 0.5;
        this.controls.minDistance = 3;
        this.controls.maxDistance = 8;
        this.controls.enablePan = false;

        // 加载GLTF模型
        const loader = new THREE.GLTFLoader();
        const config = this.configManager.getConfig();
        
        loader.load(
            config.modelPath,
            (gltf) => {
                this.model = gltf.scene;
                
                // 居中和缩放
                const box = new THREE.Box3().setFromObject(this.model);
                const center = box.getCenter(new THREE.Vector3());
                this.model.position.sub(center);
                
                const size = box.getSize(new THREE.Vector3());
                const maxSize = Math.max(size.x, size.y, size.z);
                const targetSize = 3;
                this.model.scale.multiplyScalar(targetSize / maxSize);
                
                this.model.rotation.y = -Math.PI / 6;
                
                // 关键改动：保留原始材质，只调整必要属性
                this.model.traverse((child) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        
                        // 不要替换材质！只在必要时修复
                        if (child.material) {
                            // 确保材质响应环境光
                            if (child.material.isMeshStandardMaterial || 
                                child.material.isMeshPhysicalMaterial) {
                                child.material.envMapIntensity = 1.5;
                                child.material.needsUpdate = true;
                            }
                        }
                    }
                });
                
                this.scene.add(this.model);
                document.getElementById('loading').style.display = 'none';
                
                // 清理
                pmremGenerator.dispose();
                
                this.animate();
            },
            (xhr) => {
                if (xhr.total > 0) {
                    const percentComplete = (xhr.loaded / xhr.total) * 100;
                    console.log('加载进度：' + percentComplete.toFixed(2) + '%');
                }
            },
            (error) => {
                console.error('模型加载错误：', error);
                // 创建简单的几何体作为备用
                this.createFallbackModel();
            }
        );

        window.addEventListener('resize', () => this.onWindowResize());
    }

    // 创建备用模型
    createFallbackModel() {
        const geometry = new THREE.BoxGeometry(1, 2, 0.1);
        const material = new THREE.MeshStandardMaterial({ 
            color: 0x333333,
            metalness: 0.7,
            roughness: 0.3 
        });
        this.model = new THREE.Mesh(geometry, material);
        this.model.position.set(0, 0, 0);
        this.scene.add(this.model);
        
        document.getElementById('loading').style.display = 'none';
        console.log('使用备用模型');
        this.animate();
    }

    // 窗口大小改变处理
    onWindowResize() {
        const container = document.getElementById('canvas-container');
        const width = container.clientWidth;
        const height = container.clientHeight;

        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    // 动画循环
    animate() {
        requestAnimationFrame(() => this.animate());

        // 更新控制器
        this.controls.update();

        // 自动旋转（可选）
        if (this.model && !this.controls.autoRotate) {
            // this.model.rotation.y += 0.002;
        }

        this.renderer.render(this.scene, this.camera);
    }

    // 更新屏幕图像
    updateScreenWithImage(imageSrc) {
        if (!this.model) {
            console.warn('3D模型尚未加载完成');
            return;
        }
        
        let screenFound = false;
        
        this.model.traverse((child) => {
            if (child.isMesh && child.name === 'xXDHkMplTIDAXLN') {
                console.log('找到iPhone屏幕网格！');
                
                const textureLoader = new THREE.TextureLoader();
                const screenTexture = textureLoader.load(imageSrc, (texture) => {
                    // 关键修改：调整贴图映射
                    texture.flipY = true;
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    texture.encoding = THREE.sRGBEncoding;
                    
                    // 添加：确保贴图完全覆盖
                    texture.repeat.set(1, 1);
                    texture.offset.set(0, 0);
                    
                    // 添加：调整贴图中心点
                    texture.center.set(0.5, 0.5);
                    
                    const screenMaterial = new THREE.MeshStandardMaterial({
                        map: texture,
                        roughness: 1,
                        metalness: 0,
                        envMapIntensity: 0.5,
                        // 添加：确保不透明
                        transparent: false,
                        opacity: 1,
                        side: THREE.FrontSide
                    });
                    
                    child.material = screenMaterial;
                    child.material.needsUpdate = true;
                    
                    // 添加：检查并调整底部黑色区域
                    child.geometry.computeBoundingBox();
                    
                    this.currentScreenMesh = child;
                    screenFound = true;
                });
            }
        });
        
        if (!screenFound) {
            console.warn('未找到屏幕网格 xXDHkMplTIDAXLN');
            // 备用方案：寻找其他可能的屏幕网格
            this.searchAlternativeScreen(imageSrc);
        }
    }

    // 备用搜索函数
    searchAlternativeScreen(imageSrc) {
        this.model.traverse((child) => {
            if (child.isMesh && child.material) {
                // 查找可能是屏幕的材质
                if (child.material.name === 'pIJKfZsazmcpEiU' || 
                    child.geometry.boundingBox) {
                    const box = new THREE.Box3().setFromObject(child);
                    const size = box.getSize(new THREE.Vector3());
                    // 判断是否为屏幕尺寸的网格
                    if (size.y > size.x * 1.5 && size.y < size.x * 2.5) {
                        console.log('找到备用屏幕网格:', child.name);
                        // 应用贴图
                        const textureLoader = new THREE.TextureLoader();
                        const screenTexture = textureLoader.load(imageSrc);
                        child.material.map = screenTexture;
                        child.material.needsUpdate = true;
                    }
                }
            }
        });
    }

    // 生成默认屏幕内容
    generateDefaultScreen() {
        const canvas = document.createElement('canvas');
        canvas.width = 400;
        canvas.height = 800;
        const ctx = canvas.getContext('2d');

        const config = this.configManager.getConfig();

        // 绘制渐变背景
        const gradient = ctx.createLinearGradient(0, 0, 0, 800);
        gradient.addColorStop(0, config.primaryColor);
        gradient.addColorStop(1, config.secondaryColor);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 400, 800);

        // 绘制APP图标
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(150, 200, 100, 100);
        ctx.fillStyle = config.primaryColor;
        ctx.font = 'bold 48px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(config.appIcon, 200, 265);

        // 绘制APP名称
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px Arial';
        ctx.fillText(config.appName, 200, 340);

        // 绘制描述文字
        ctx.font = '16px Arial';
        const subtitleLines = config.subtitle.split('\n');
        subtitleLines.forEach((line, index) => {
            ctx.fillText(line, 200, 380 + (index * 30));
        });

        // 绘制一些UI元素
        ctx.fillStyle = 'rgba(255,255,255,0.3)';
        ctx.fillRect(40, 500, 320, 60);
        ctx.fillRect(40, 580, 320, 60);
        ctx.fillRect(40, 660, 320, 60);

        return canvas.toDataURL('image/png');
    }

    // 获取模型实例
    getModel() {
        return this.model;
    }

    // 获取场景实例
    getScene() {
        return this.scene;
    }

    // 获取渲染器实例
    getRenderer() {
        return this.renderer;
    }
}

// 导出3D模型管理器
window.Model3DManager = Model3DManager;