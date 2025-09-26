import React, { useRef, useEffect, useState, Suspense, useMemo } from "react";
import { Canvas, useLoader, useFrame, extend } from "@react-three/fiber";
import {
  OrbitControls,
  useTexture,
  Environment,
  Html,
} from "@react-three/drei";
import { Move, RotateCw } from "lucide-react";
import * as THREE from "three/webgpu";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
import { useApp } from "../context/AppContext";
import { getStyleFontClass } from "../data/styleConfig";
import PhoneModelMesh from "./PhoneModelMesh";

// 扩展 THREE WebGPU 对象到 R3F
extend(THREE);

// WebGPU Canvas 组件
const WebGPUCanvas = (props) => {
  return (
    <Canvas
      {...props}
      flat
      gl={async (glProps) => {
        const renderer = new THREE.WebGPURenderer(glProps);
        await renderer.init();
        return renderer;
      }}
    >
      {props.children}
    </Canvas>
  );
};

function LoadingIndicator() {
  return (
    <div
      className="flex flex-col items-center justify-center h-full text-white/60"
      id="loading"
    >
      <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mb-3"></div>
      <div className="text-sm">加载3D模型中...</div>
    </div>
  );
}

const RotatingModel = ({ customImage, isDiagonalLayout, ...props }) => {
  const groupRef = useRef();

  useFrame(() => {
    if (groupRef.current && isDiagonalLayout) {
      // 只保留diagonal布局的特殊倾斜
      groupRef.current.rotation.z = (-12 * Math.PI) / 180;
      groupRef.current.position.y = 1;
    }
  });

  return (
    <group ref={groupRef}>
      <PhoneModel3D
        position={[0, 0, 0]}
        rotation={[0, Math.PI, 0]}
        scale={10}
        customImage={customImage}
        {...props}
      />
    </group>
  );
};

function PhoneModel3D({ customImage, ...props }) {
  const { state } = useApp();
  const [textureReady, setTextureReady] = useState(false);
  const textureRef = useRef(null);

  // 使用与 model.tsx 完全相同的方式加载 GLTF（DRACO压缩版本）
  const gltf = useLoader(
    GLTFLoader,
    "/models/apple_iphone_15_pro_max_black_draco.glb",
    (loader) => {
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath("/draco/");
      loader.setDRACOLoader(dracoLoader);
    }
  );

  const { nodes, materials } = gltf;

  // 生成默认屏幕内容
  const generateDefaultScreen = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");

    // 获取当前风格的字体配置
    const titleFont = getStyleFontClass(state.currentStyle, "title");
    const subtitleFont = getStyleFontClass(state.currentStyle, "subtitle");

    // Draw background (gradient or solid based on colorMode)
    if (state.design.colorMode === "solid") {
      ctx.fillStyle = state.design.bgColor;
      ctx.fillRect(0, 0, 400, 800);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, 0, 800);
      gradient.addColorStop(0, state.design.bgColor);
      gradient.addColorStop(1, state.design.gradientColor);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 400, 800);
    }

    // Draw APP icon
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(150, 200, 100, 100);
    ctx.fillStyle = state.design.bgColor;
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText(state.appInfo.icon, 200, 265);

    // Draw APP name
    ctx.fillStyle = "#ffffff";
    ctx.font = `${titleFont.fontWeight} 24px ${
      titleFont.fontFamily.split(",")[0]
    }`;
    ctx.fillText(state.appInfo.name, 200, 340);

    // Draw description
    ctx.font = `${subtitleFont.fontWeight} 16px ${
      subtitleFont.fontFamily.split(",")[0]
    }`;
    const subtitleLines = state.appInfo.subtitle.split("\n");
    subtitleLines.forEach((line, index) => {
      ctx.fillText(line, 200, 380 + index * 30);
    });

    // Draw some UI elements
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(40, 500, 320, 60);
    ctx.fillRect(40, 580, 320, 60);
    ctx.fillRect(40, 660, 320, 60);

    return canvas.toDataURL("image/png");
  };

  const defaultScreen = state.screenImage || generateDefaultScreen();
  const imageSource = customImage || defaultScreen;

  // 预加载纹理
  useEffect(() => {
    const loader = new THREE.TextureLoader();
    loader.load(
      imageSource,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.flipY = true;
        texture.needsUpdate = true;
        textureRef.current = texture;
        setTextureReady(true);
      },
      undefined,
      (error) => {
        console.error("Failed to load texture:", error);
        setTextureReady(true); // 即使失败也设置为ready，使用默认材质
      }
    );
  }, [imageSource]);

  // 创建材质
  const imageMaterial = useMemo(() => {
    if (textureReady && textureRef.current) {
      return new THREE.MeshBasicMaterial({
        map: textureRef.current,
        transparent: true,
      });
    }
    // 使用与屏幕内容相匹配的纯色材质
    return new THREE.MeshBasicMaterial({
      color: state.design.bgColor || "#000000",
      transparent: true,
    });
  }, [textureReady, state.design.bgColor]);

  // 使用与 model.tsx 完全相同的逐mesh渲染方式
  return (
    <group {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group
          name="Sketchfab_model"
          rotation={[-Math.PI / 2, 0, 0]}
          userData={{ name: "Sketchfab_model" }}
        >
          <group
            name="USDRoot"
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}
            userData={{ name: "USDRoot" }}
          >
            <group
              name="tracking_node_placeholder"
              userData={{ name: "tracking_node_placeholder" }}
            >
              <group
                name="MBJPHxJFDgaTDhF"
                userData={{ name: "MBJPHxJFDgaTDhF" }}
              >
                <group
                  name="rVbvQyXCLAfnDro"
                  userData={{ name: "rVbvQyXCLAfnDro" }}
                >
                  <group
                    name="rdkdGpTstFFbsnN"
                    userData={{ name: "rdkdGpTstFFbsnN" }}
                  >
                    {/* 使用新组件，传递必要的props */}
                    <PhoneModelMesh
                      nodes={nodes}
                      materials={materials}
                      imageMaterial={imageMaterial}
                    />
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
}

function PhoneModel() {
  const { state } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const orbitRef = useRef();
  const containerRef = useRef(null);

  // 使用3D模型位置代替CSS平移
  const [modelPosition, setModelPosition] = useState([0, 0, 0]);
  const [modelRotation, setModelRotation] = useState(0); // 3D模型的Y轴旋转角度
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({
    x: 0,
    y: 0,
    initialPosition: [0, 0, 0], // 新增：记录拖拽开始时的模型位置
  });

  // 控制图标相关状态
  const [showControlIcons, setShowControlIcons] = useState(false);
  const [interactionMode, setInteractionMode] = useState("move"); // 'move' | 'rotate'
  const [isRotating, setIsRotating] = useState(false);
  const [rotateStart, setRotateStart] = useState({ angle: 0, startAngle: 0 });
  const hideIconTimeoutRef = useRef(null);

  // 悬停状态
  const [isHovered, setIsHovered] = useState(false);

  // 显示控制图标并设置自动隐藏
  const showControlIconsWithTimeout = () => {
    setShowControlIcons(true);

    // 清除之前的定时器
    if (hideIconTimeoutRef.current) {
      clearTimeout(hideIconTimeoutRef.current);
    }

    // 1.5秒后自动隐藏
    hideIconTimeoutRef.current = setTimeout(() => {
      setShowControlIcons(false);
    }, 1500);
  };

  // 移除handleWheel，让OrbitControls处理缩放
  // 只显示控制图标
  const handleWheel = (e) => {
    showControlIconsWithTimeout();
  };

  // 设置OrbitControls参数
  useEffect(() => {
    if (orbitRef.current) {
      orbitRef.current.minDistance = 1.5;
      orbitRef.current.maxDistance = 10;
      orbitRef.current.zoomSpeed = 1;
      orbitRef.current.update();
    }
  }, []);

  // 计算鼠标相对于元素中心的角度
  const calculateAngle = (clientX, clientY, centerX, centerY) => {
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  };

  // 添加动态计算转换系数的函数
  const calculateSensitivity = () => {
    // 根据容器大小和相机FOV动态计算
    if (!containerRef.current) return 0.01;

    const containerHeight = containerRef.current.offsetHeight;
    const fov = 45; // 相机FOV
    const distance = 3; // 相机距离

    // 计算3D空间中可见区域的高度
    const vFov = (fov * Math.PI) / 180;
    const visibleHeight = 2 * Math.tan(vFov / 2) * distance;

    // 像素到3D单位的转换系数
    return visibleHeight / containerHeight;
  };

  // 获取元素中心点坐标
  const getElementCenter = () => {
    if (!containerRef.current) return { x: 0, y: 0 };

    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
  };

  // 处理鼠标按下开始交互
  const handleMouseDown = (e) => {
    // 只在已经显示控制图标时处理拖动/旋转
    if (showControlIcons && e.target.tagName === "CANVAS") {
      if (interactionMode === "move") {
        setIsDragging(true);
        setDragStart({
          x: e.clientX,
          y: e.clientY,
          initialPosition: [...modelPosition], // 记录当前模型位置
        });
      } else if (interactionMode === "rotate") {
        setIsRotating(true);
        setRotateStart({
          angle: modelRotation,
          startX: e.clientX,
        });
      }
      // ❌ 移除这里的 showControlIconsWithTimeout();
    }
  };

  // 处理鼠标移动
  const handleMouseMove = (e) => {
    if (isDragging && interactionMode === "move") {
      const sensitivity = calculateSensitivity(); // 动态计算
      const deltaX = (e.clientX - dragStart.x) * sensitivity;
      const deltaY = -(e.clientY - dragStart.y) * sensitivity;

      setModelPosition([
        dragStart.initialPosition[0] + deltaX,
        dragStart.initialPosition[1] + deltaY,
        dragStart.initialPosition[2],
      ]);
    } else if (isRotating) {
      const deltaX = e.clientX - rotateStart.startX;
      const rotationSpeed = 0.5;
      const newRotation = rotateStart.angle + deltaX * rotationSpeed;
      setModelRotation(newRotation);
    }
  };

  // 处理鼠标释放结束交互
  const handleMouseUp = () => {
    setIsDragging(false);
    setIsRotating(false);
    // 重新显示图标并重置隐藏定时器
    showControlIconsWithTimeout();
  };

  // 处理触摸事件
  const handleTouchStart = (e) => {
    // 只在已经显示控制图标时处理拖动/旋转
    if (showControlIcons && e.touches.length === 1) {
      const touch = e.touches[0];
      if (interactionMode === "move") {
        setIsDragging(true);
        setDragStart({
          x: touch.clientX,
          y: touch.clientY,
          initialPosition: [...modelPosition], // 记录当前位置
        });
      } else if (interactionMode === "rotate") {
        setIsRotating(true);
        setRotateStart({
          angle: modelRotation,
          startX: touch.clientX,
        });
      }
      // ❌ 移除这里的 showControlIconsWithTimeout();
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (isDragging) {
        const sensitivity = calculateSensitivity(); // 动态计算
        const deltaX = (touch.clientX - dragStart.x) * sensitivity;
        const deltaY = -(touch.clientY - dragStart.y) * sensitivity;

        setModelPosition([
          dragStart.initialPosition[0] + deltaX,
          dragStart.initialPosition[1] + deltaY,
          dragStart.initialPosition[2],
        ]);
      } else if (isRotating) {
        const deltaX = touch.clientX - rotateStart.startX;
        const rotationSpeed = 0.5;
        const newRotation = rotateStart.angle + deltaX * rotationSpeed;
        setModelRotation(newRotation);
      }
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    setIsRotating(false);
    showControlIconsWithTimeout();
  };

  // 监听全局鼠标事件
  useEffect(() => {
    if (isDragging || isRotating) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }
  }, [
    isDragging,
    isRotating,
    dragStart,
    rotateStart,
    modelPosition,
    modelRotation,
  ]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (hideIconTimeoutRef.current) {
        clearTimeout(hideIconTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none ${
        isDragging && interactionMode === "move"
          ? "cursor-grabbing"
          : isHovered
          ? "cursor-pointer"
          : showControlIcons
          ? interactionMode === "move"
            ? "cursor-grab"
            : "cursor-crosshair"
          : "cursor-default"
      }`}
      id="canvas-container"
      // onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* 旋转角度提示 */}
      {isRotating && (
        <div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 z-40 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg">
          {Math.round(((modelRotation % 360) + 360) % 360)}°
        </div>
      )}

      {isLoading && <LoadingIndicator />}
      <WebGPUCanvas
        camera={{ position: [0, 0, 3], fov: 45 }} // 固定初始值
        style={{ width: "100%", height: "100%" }}
        onCreated={() => setIsLoading(false)}
        gl={{ antialias: true }}
        shadows
      >
        <ambientLight intensity={0.8} />

        <directionalLight
          position={[5, 5, 5]}
          intensity={0.3}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        <directionalLight position={[-5, 3, -5]} intensity={0.2} />

        <Suspense fallback={null}>
          <group position={modelPosition}>
            <RotatingModel
              key={state.screenImage}
              customImage={state.screenImage}
              modelRotation={modelRotation}
              isDiagonalLayout={state.design.template === "diagonal"}
              showControlIcons={showControlIcons}
              interactionMode={interactionMode}
              onModeChange={setInteractionMode}
              onShowIcons={showControlIconsWithTimeout}
              onHoverChange={setIsHovered}
            />
          </group>
        </Suspense>

        {/* 启用OrbitControls的缩放功能，禁用其他控制 */}
        <OrbitControls
          ref={orbitRef}
          enablePan={true} // ✅ 启用平移
          enableRotate={true} // ✅ 启用自由旋转
          enableZoom={true} // 保持缩放
          minDistance={1.5}
          maxDistance={10}
          zoomSpeed={1}
          enableDamping
          dampingFactor={0.05}
        />
      </WebGPUCanvas>
    </div>
  );
}

export default PhoneModel;
