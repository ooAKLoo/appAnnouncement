// import React, { useRef, useEffect, useState, Suspense, useMemo } from "react";
// import { Canvas, useLoader, useFrame, extend } from "@react-three/fiber";
// import {
//   useTexture,
//   Environment,
//   Html,
// } from "@react-three/drei";
// import { Move, RotateCw } from "lucide-react";
// import * as THREE from "three/webgpu";
// import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
// import { DRACOLoader } from "three/addons/loaders/DRACOLoader.js";
// import { useApp } from "../context/AppContext";
// import { getStyleFontClass } from "../data/styleConfig";
// import PhoneModelMesh from "./PhoneModelMesh";

// // 扩展 THREE WebGPU 对象到 R3F
// extend(THREE);

// // WebGPU Canvas 组件
// const WebGPUCanvas = (props) => {
//   return (
//     <Canvas
//       {...props}
//       flat
//       gl={async (glProps) => {
//         const renderer = new THREE.WebGPURenderer(glProps);
//         await renderer.init();
//         return renderer;
//       }}
//     >
//       {props.children}
//     </Canvas>
//   );
// };

// function LoadingIndicator() {
//   return (
//     <div
//       className="flex flex-col items-center justify-center h-full text-white/60"
//       id="loading"
//     >
//       <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mb-3"></div>
//       <div className="text-sm">加载3D模型中...</div>
//     </div>
//   );
// }

// const RotatingModel = ({
//   customImage,
//   modelRotation,
//   isDiagonalLayout,
//   showControlIcons,
//   interactionMode,
//   onModeChange,
//   onShowIcons,
//   onHoverChange,
//   ...props
// }) => {
//   const groupRef = useRef();
//   const [hovered, setHovered] = useState(false);

//   // 处理悬停状态变化
//   const handleHoverChange = (isHovered) => {
//     setHovered(isHovered);
//     if (onHoverChange) {
//       onHoverChange(isHovered);
//     }
//   };

//   // 处理模型点击
//   const handlePointerDown = (e) => {
//     e.stopPropagation(); // 阻止事件冒泡
//     onShowIcons(); // 显示控制图标
//   };

//   // 应用3D模型的旋转
//   useFrame(() => {
//     if (groupRef.current) {
//       // 应用多轴旋转
//       if (modelRotation !== undefined) {
//         groupRef.current.rotation.x = (modelRotation.x * Math.PI) / 180;
//         groupRef.current.rotation.y = (modelRotation.y * Math.PI) / 180;
//       }
//       // Z轴倾斜（diagonal模板效果）
//       if (isDiagonalLayout) {
//         groupRef.current.rotation.z = (-12 * Math.PI) / 180; // -12度倾斜
//         groupRef.current.position.y = 1; // 略微向上偏移
//       }
//     }
//   });

//   return (
//     <group
//       ref={groupRef}
//       onPointerDown={handlePointerDown} // ✅ 添加点击事件
//       onPointerOver={() => handleHoverChange(true)}
//       onPointerOut={() => handleHoverChange(false)}
//     >
//       <PhoneModel3D
//         position={[0, 0, 0]}
//         rotation={[0, Math.PI, 0]}
//         scale={hovered ? 10.05 : 10} // 悬停时轻微放大
//         customImage={customImage}
//         {...props}
//       />

//       {/* 悬停提示 */}
//       {hovered && !showControlIcons && (
//         <Html
//           position={[0, 1.5, 0]}
//           center
//           distanceFactor={8}
//           style={{
//             pointerEvents: "none",
//           }}
//         >
//           <div className="px-2 py-1 bg-gray-800/80 text-white text-xs rounded whitespace-nowrap">
//             点击查看控制选项
//           </div>
//         </Html>
//       )}

//       {/* HTML元素会自动跟随3D模型，但始终面向屏幕 */}
//       <Html
//         position={[0.5, 1, 0]} // 相对于模型的3D位置（右上角）
//         distanceFactor={8} // 缩放因子
//         occlude // 可被3D物体遮挡
//         style={{
//           transition: "opacity 0.3s",
//           opacity: showControlIcons ? 1 : 0,
//           pointerEvents: showControlIcons ? "auto" : "none",
//         }}
//       >
//         <div className="flex gap-1">
//           {/* 拖拽图标 */}
//           <button
//             className={`w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-110 shadow-lg ${
//               interactionMode === "move"
//                 ? "bg-blue-100 border border-blue-300 text-blue-700"
//                 : "bg-white/90 hover:bg-white border border-gray-200"
//             }`}
//             title="拖拽模式"
//             onClick={(e) => {
//               e.stopPropagation();
//               onModeChange("move");
//               onShowIcons();
//             }}
//           >
//             <Move size={16} />
//           </button>

//           {/* 旋转图标 */}
//           <button
//             className={`w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-110 shadow-lg ${
//               interactionMode === "rotate"
//                 ? "bg-blue-100 border border-blue-300 text-blue-700"
//                 : "bg-white/90 hover:bg-white border border-gray-200"
//             }`}
//             title="旋转模式"
//             onClick={(e) => {
//               e.stopPropagation();
//               onModeChange("rotate");
//               onShowIcons();
//             }}
//           >
//             <RotateCw size={16} />
//           </button>
//         </div>
//       </Html>

//       {/* 模式提示 */}
//       <Html
//         position={[0.5, 1.3, 0]} // 稍微在上方
//         distanceFactor={8}
//         style={{
//           transition: "opacity 0.3s",
//           opacity: showControlIcons ? 1 : 0,
//           pointerEvents: "none",
//         }}
//       >
//         <div className="px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap">
//           {interactionMode === "move" ? "拖拽模式" : "旋转模式"}
//         </div>
//       </Html>
//     </group>
//   );
// };

// function PhoneModel3D({ customImage, ...props }) {
//   const { state } = useApp();
//   const [textureReady, setTextureReady] = useState(false);
//   const textureRef = useRef(null);

//   // 使用与 model.tsx 完全相同的方式加载 GLTF（DRACO压缩版本）
//   const gltf = useLoader(
//     GLTFLoader,
//     "/models/apple_iphone_15_pro_max_black_draco.glb",
//     (loader) => {
//       const dracoLoader = new DRACOLoader();
//       dracoLoader.setDecoderPath("/draco/");
//       loader.setDRACOLoader(dracoLoader);
//     }
//   );

//   const { nodes, materials } = gltf;

//   // 生成默认屏幕内容
//   const generateDefaultScreen = () => {
//     const canvas = document.createElement("canvas");
//     canvas.width = 400;
//     canvas.height = 800;
//     const ctx = canvas.getContext("2d");

//     // 获取当前风格的字体配置
//     const titleFont = getStyleFontClass(state.currentStyle, "title");
//     const subtitleFont = getStyleFontClass(state.currentStyle, "subtitle");

//     // Draw background (gradient or solid based on colorMode)
//     if (state.design.colorMode === "solid") {
//       ctx.fillStyle = state.design.bgColor;
//       ctx.fillRect(0, 0, 400, 800);
//     } else {
//       const gradient = ctx.createLinearGradient(0, 0, 0, 800);
//       gradient.addColorStop(0, state.design.bgColor);
//       gradient.addColorStop(1, state.design.gradientColor);
//       ctx.fillStyle = gradient;
//       ctx.fillRect(0, 0, 400, 800);
//     }

//     // Draw APP icon
//     ctx.fillStyle = "#ffffff";
//     ctx.fillRect(150, 200, 100, 100);
//     ctx.fillStyle = state.design.bgColor;
//     ctx.font = "bold 48px Arial";
//     ctx.textAlign = "center";
//     ctx.fillText(state.appInfo.icon, 200, 265);

//     // Draw APP name
//     ctx.fillStyle = "#ffffff";
//     ctx.font = `${titleFont.fontWeight} 24px ${
//       titleFont.fontFamily.split(",")[0]
//     }`;
//     ctx.fillText(state.appInfo.name, 200, 340);

//     // Draw description
//     ctx.font = `${subtitleFont.fontWeight} 16px ${
//       subtitleFont.fontFamily.split(",")[0]
//     }`;
//     const subtitleLines = state.appInfo.subtitle.split("\n");
//     subtitleLines.forEach((line, index) => {
//       ctx.fillText(line, 200, 380 + index * 30);
//     });

//     // Draw some UI elements
//     ctx.fillStyle = "rgba(255,255,255,0.3)";
//     ctx.fillRect(40, 500, 320, 60);
//     ctx.fillRect(40, 580, 320, 60);
//     ctx.fillRect(40, 660, 320, 60);

//     return canvas.toDataURL("image/png");
//   };

//   const defaultScreen = state.screenImage || generateDefaultScreen();
//   const imageSource = customImage || defaultScreen;

//   // 预加载纹理
//   useEffect(() => {
//     const loader = new THREE.TextureLoader();
//     loader.load(
//       imageSource,
//       (texture) => {
//         texture.colorSpace = THREE.SRGBColorSpace;
//         texture.flipY = true;
//         texture.needsUpdate = true;
//         textureRef.current = texture;
//         setTextureReady(true);
//       },
//       undefined,
//       (error) => {
//         console.error("Failed to load texture:", error);
//         setTextureReady(true); // 即使失败也设置为ready，使用默认材质
//       }
//     );
//   }, [imageSource]);

//   // 创建材质
//   const imageMaterial = useMemo(() => {
//     if (textureReady && textureRef.current) {
//       return new THREE.MeshBasicMaterial({
//         map: textureRef.current,
//         transparent: true,
//       });
//     }
//     // 使用与屏幕内容相匹配的纯色材质
//     return new THREE.MeshBasicMaterial({
//       color: state.design.bgColor || "#000000",
//       transparent: true,
//     });
//   }, [textureReady, state.design.bgColor]);

//   // 使用与 model.tsx 完全相同的逐mesh渲染方式
//   return (
//     <group {...props} dispose={null}>
//       <group name="Sketchfab_Scene">
//         <group
//           name="Sketchfab_model"
//           rotation={[-Math.PI / 2, 0, 0]}
//           userData={{ name: "Sketchfab_model" }}
//         >
//           <group
//             name="USDRoot"
//             rotation={[Math.PI / 2, 0, 0]}
//             scale={0.01}
//             userData={{ name: "USDRoot" }}
//           >
//             <group
//               name="tracking_node_placeholder"
//               userData={{ name: "tracking_node_placeholder" }}
//             >
//               <group
//                 name="MBJPHxJFDgaTDhF"
//                 userData={{ name: "MBJPHxJFDgaTDhF" }}
//               >
//                 <group
//                   name="rVbvQyXCLAfnDro"
//                   userData={{ name: "rVbvQyXCLAfnDro" }}
//                 >
//                   <group
//                     name="rdkdGpTstFFbsnN"
//                     userData={{ name: "rdkdGpTstFFbsnN" }}
//                   >
//                     <PhoneModelMesh
//                       nodes={nodes}
//                       materials={materials}
//                       imageMaterial={imageMaterial}
//                     />
//                   </group>
//                 </group>
//               </group>
//             </group>
//           </group>
//         </group>
//       </group>
//     </group>
//   );
// }

// function PhoneModel() {
//   const { state } = useApp();
//   const [isLoading, setIsLoading] = useState(true);
//   const containerRef = useRef(null);

//   // 使用3D模型位置代替CSS平移
//   const [modelPosition, setModelPosition] = useState([0, 0, 0]);
//   const [modelRotation, setModelRotation] = useState({ x: 0, y: 0 }); // 3D模型的X轴和Y轴旋转角度
//   const [isDragging, setIsDragging] = useState(false);
//   const [dragStart, setDragStart] = useState({
//     x: 0,
//     y: 0,
//     initialPosition: [0, 0, 0], // 新增：记录拖拽开始时的模型位置
//   });

//   // 控制图标相关状态
//   const [showControlIcons, setShowControlIcons] = useState(false);
//   const [interactionMode, setInteractionMode] = useState("move"); // 'move' | 'rotate'
//   const [isRotating, setIsRotating] = useState(false);
//   const [rotateStart, setRotateStart] = useState({ 
//     rotation: { x: 0, y: 0 }, 
//     startX: 0, 
//     startY: 0 
//   });
//   const hideIconTimeoutRef = useRef(null);

//   // 悬停状态
//   const [isHovered, setIsHovered] = useState(false);
  
//   // 添加 requestAnimationFrame 相关 refs
//   const animationFrameRef = useRef(null);
//   const [cachedSensitivity, setCachedSensitivity] = useState(0.01);
  
//   // 自定义缩放状态
//   const [cameraDistance, setCameraDistance] = useState(3);

//   // 显示控制图标并设置自动隐藏
//   const showControlIconsWithTimeout = () => {
//     setShowControlIcons(true);

//     // 清除之前的定时器
//     if (hideIconTimeoutRef.current) {
//       clearTimeout(hideIconTimeoutRef.current);
//     }

//     // 1.5秒后自动隐藏
//     hideIconTimeoutRef.current = setTimeout(() => {
//       setShowControlIcons(false);
//     }, 1500);
//   };

//   // 自定义缩放处理
//   const handleWheel = (e) => {
//     e.preventDefault();
//     const delta = e.deltaY * 0.001;
//     setCameraDistance(prev => Math.max(1.5, Math.min(10, prev + delta)));
//     showControlIconsWithTimeout();
//   };

//   // 缓存敏感度计算
//   useEffect(() => {
//     if (containerRef.current) {
//       const containerHeight = containerRef.current.offsetHeight;
//       const fov = 45;
//       const vFov = (fov * Math.PI) / 180;
//       const visibleHeight = 2 * Math.tan(vFov / 2) * cameraDistance;
//       const newSensitivity = visibleHeight / containerHeight;
      
//       setCachedSensitivity(prevSensitivity => {
//         if (Math.abs(prevSensitivity - newSensitivity) > 0.0001) {
//           return newSensitivity;
//         }
//         return prevSensitivity;
//       });
//     }
//   }, [cameraDistance]);


//   // 处理鼠标按下开始交互
//   const handleMouseDown = (e) => {
//     // 只在已经显示控制图标时处理拖动/旋转
//     if (showControlIcons && e.target.tagName === "CANVAS") {
//       if (interactionMode === "move") {
//         setIsDragging(true);
//         setDragStart({
//           x: e.clientX,
//           y: e.clientY,
//           initialPosition: [...modelPosition], // 记录当前模型位置
//         });
//       } else if (interactionMode === "rotate") {
//         setIsRotating(true);
//         setRotateStart({
//           rotation: { ...modelRotation },
//           startX: e.clientX,
//           startY: e.clientY
//         });
//       }
//       // ❌ 移除这里的 showControlIconsWithTimeout();
//     }
//   };

//   // 处理鼠标移动
//   const handleMouseMove = (e) => {
//     if (isDragging && interactionMode === "move") {
//       const sensitivity = calculateSensitivity(); // 动态计算
//       const deltaX = (e.clientX - dragStart.x) * sensitivity;
//       const deltaY = -(e.clientY - dragStart.y) * sensitivity;

//       setModelPosition([
//         dragStart.initialPosition[0] + deltaX,
//         dragStart.initialPosition[1] + deltaY,
//         dragStart.initialPosition[2],
//       ]);
//     } else if (isRotating) {
//       const deltaX = e.clientX - rotateStart.startX;
//       const deltaY = e.clientY - rotateStart.startY;
//       const rotationSpeed = 0.5;
      
//       setModelRotation({
//         x: rotateStart.rotation.x - deltaY * rotationSpeed,
//         y: rotateStart.rotation.y + deltaX * rotationSpeed
//       });
//     }
//   };

//   // 处理鼠标释放结束交互
//   const handleMouseUp = () => {
//     setIsDragging(false);
//     setIsRotating(false);
//     // 重新显示图标并重置隐藏定时器
//     showControlIconsWithTimeout();
//   };

//   // 处理触摸事件
//   const handleTouchStart = (e) => {
//     // 只在已经显示控制图标时处理拖动/旋转
//     if (showControlIcons && e.touches.length === 1) {
//       const touch = e.touches[0];
//       if (interactionMode === "move") {
//         setIsDragging(true);
//         setDragStart({
//           x: touch.clientX,
//           y: touch.clientY,
//           initialPosition: [...modelPosition], // 记录当前位置
//         });
//       } else if (interactionMode === "rotate") {
//         setIsRotating(true);
//         setRotateStart({
//           rotation: { ...modelRotation },
//           startX: touch.clientX,
//           startY: touch.clientY
//         });
//       }
//       // ❌ 移除这里的 showControlIconsWithTimeout();
//     }
//   };

//   const handleTouchMove = (e) => {
//     e.preventDefault();
//     if (e.touches.length === 1) {
//       const touch = e.touches[0];
//       if (isDragging) {
//         const sensitivity = calculateSensitivity(); // 动态计算
//         const deltaX = (touch.clientX - dragStart.x) * sensitivity;
//         const deltaY = -(touch.clientY - dragStart.y) * sensitivity;

//         setModelPosition([
//           dragStart.initialPosition[0] + deltaX,
//           dragStart.initialPosition[1] + deltaY,
//           dragStart.initialPosition[2],
//         ]);
//       } else if (isRotating) {
//         const deltaX = touch.clientX - rotateStart.startX;
//         const deltaY = touch.clientY - rotateStart.startY;
//         const rotationSpeed = 0.5;
        
//         setModelRotation({
//           x: rotateStart.rotation.x - deltaY * rotationSpeed,
//           y: rotateStart.rotation.y + deltaX * rotationSpeed
//         });
//       }
//     }
//   };

//   const handleTouchEnd = () => {
//     setIsDragging(false);
//     setIsRotating(false);
//     showControlIconsWithTimeout();
//   };

//   // 监听全局鼠标事件
//   useEffect(() => {
//     if (isDragging || isRotating) {
//       document.addEventListener("mousemove", handleMouseMove);
//       document.addEventListener("mouseup", handleMouseUp);
//       return () => {
//         document.removeEventListener("mousemove", handleMouseMove);
//         document.removeEventListener("mouseup", handleMouseUp);
//       };
//     }
//   }, [
//     isDragging,
//     isRotating,
//     dragStart,
//     rotateStart,
//     modelPosition,
//     modelRotation,
//   ]);

//   // 清理定时器
//   useEffect(() => {
//     return () => {
//       if (hideIconTimeoutRef.current) {
//         clearTimeout(hideIconTimeoutRef.current);
//       }
//     };
//   }, []);

//   return (
//     <div
//       ref={containerRef}
//       className={`relative w-full h-full select-none ${
//         isDragging && interactionMode === "move"
//           ? "cursor-grabbing"
//           : isHovered
//           ? "cursor-pointer"
//           : showControlIcons
//           ? interactionMode === "move"
//             ? "cursor-grab"
//             : "cursor-crosshair"
//           : "cursor-default"
//       }`}
//       id="canvas-container"
//       onWheel={handleWheel}
//       onMouseDown={handleMouseDown}
//       onTouchStart={handleTouchStart}
//       onTouchMove={handleTouchMove}
//       onTouchEnd={handleTouchEnd}
//     >
//       {/* 旋转角度提示 */}
//       {isRotating && (
//         <div className="absolute top-[20%] left-1/2 transform -translate-x-1/2 z-40 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg">
//           X: {Math.round(((modelRotation.x % 360) + 360) % 360)}° 
//           Y: {Math.round(((modelRotation.y % 360) + 360) % 360)}°
//         </div>
//       )}

//       {isLoading && <LoadingIndicator />}
//       <WebGPUCanvas
//         camera={{ position: [0, 0, cameraDistance], fov: 45 }}
//         style={{ width: "100%", height: "100%" }}
//         onCreated={() => setIsLoading(false)}
//         gl={{ antialias: true }}
//         shadows
//       >
//         <ambientLight intensity={0.8} />

//         <directionalLight
//           position={[5, 5, 5]}
//           intensity={0.3}
//           castShadow
//           shadow-mapSize={[1024, 1024]}
//         />

//         <directionalLight position={[-5, 3, -5]} intensity={0.2} />

//         <Suspense fallback={null}>
//           <group position={modelPosition}>
//             <RotatingModel
//               key={state.screenImage}
//               customImage={state.screenImage}
//               modelRotation={modelRotation}
//               isDiagonalLayout={state.design.template === "diagonal"}
//               showControlIcons={showControlIcons}
//               interactionMode={interactionMode}
//               onModeChange={setInteractionMode}
//               onShowIcons={showControlIconsWithTimeout}
//               onHoverChange={setIsHovered}
//             />
//           </group>
//         </Suspense>

//       </WebGPUCanvas>
//     </div>
//   );
// }

// export default PhoneModel;
