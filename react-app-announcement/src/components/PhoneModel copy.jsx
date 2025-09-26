// import React, { useRef, useEffect, useState, Suspense, useMemo } from "react";
// import { Canvas, useLoader, useFrame, extend } from "@react-three/fiber";
// import {
//   OrbitControls,
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

// const RotatingModel = ({ customImage, isDiagonalLayout, modelPosition, ...props }) => {
//   const groupRef = useRef();
//   const frameCount = useRef(0);

//   useFrame((state) => {
//     frameCount.current++;
    
//     // 每60帧输出一次调试信息
//     if (frameCount.current % 60 === 0) {
//       console.log('=== RotatingModel Debug (每秒) ===');
//       console.log('模型位置 (modelPosition):', modelPosition);
//       if (groupRef.current) {
//         console.log('Group实际位置:', groupRef.current.position.toArray());
//         console.log('Group旋转:', groupRef.current.rotation.toArray());
//       }
//       console.log('相机位置:', state.camera.position.toArray());
//       console.log('================================');
//     }

//     if (groupRef.current && isDiagonalLayout) {
//       groupRef.current.rotation.z = (-12 * Math.PI) / 180;
//       groupRef.current.position.y = 1;
//     }
//   });

//   // 监听 modelPosition 变化
//   useEffect(() => {
//     console.log('🔄 modelPosition 更新:', modelPosition);
//   }, [modelPosition]);

//   return (
//     <group ref={groupRef} position={modelPosition}>
//       <PhoneModel3D
//         position={[0, 0, 0]}
//         rotation={[0, Math.PI, 0]}
//         scale={10}
//         customImage={customImage}
//         {...props}
//       />
//     </group>
//   );
// };

// function PhoneModel3D({ customImage, ...props }) {
//   const { state } = useApp();
//   const [textureReady, setTextureReady] = useState(false);
//   const textureRef = useRef(null);

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

//   const generateDefaultScreen = () => {
//     const canvas = document.createElement("canvas");
//     canvas.width = 400;
//     canvas.height = 800;
//     const ctx = canvas.getContext("2d");

//     const titleFont = getStyleFontClass(state.currentStyle, "title");
//     const subtitleFont = getStyleFontClass(state.currentStyle, "subtitle");

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

//     ctx.fillStyle = "#ffffff";
//     ctx.fillRect(150, 200, 100, 100);
//     ctx.fillStyle = state.design.bgColor;
//     ctx.font = "bold 48px Arial";
//     ctx.textAlign = "center";
//     ctx.fillText(state.appInfo.icon, 200, 265);

//     ctx.fillStyle = "#ffffff";
//     ctx.font = `${titleFont.fontWeight} 24px ${
//       titleFont.fontFamily.split(",")[0]
//     }`;
//     ctx.fillText(state.appInfo.name, 200, 340);

//     ctx.font = `${subtitleFont.fontWeight} 16px ${
//       subtitleFont.fontFamily.split(",")[0]
//     }`;
//     const subtitleLines = state.appInfo.subtitle.split("\n");
//     subtitleLines.forEach((line, index) => {
//       ctx.fillText(line, 200, 380 + index * 30);
//     });

//     ctx.fillStyle = "rgba(255,255,255,0.3)";
//     ctx.fillRect(40, 500, 320, 60);
//     ctx.fillRect(40, 580, 320, 60);
//     ctx.fillRect(40, 660, 320, 60);

//     return canvas.toDataURL("image/png");
//   };

//   const defaultScreen = state.screenImage || generateDefaultScreen();
//   const imageSource = customImage || defaultScreen;

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
//         setTextureReady(true);
//       }
//     );
//   }, [imageSource]);

//   const imageMaterial = useMemo(() => {
//     if (textureReady && textureRef.current) {
//       return new THREE.MeshBasicMaterial({
//         map: textureRef.current,
//         transparent: true,
//       });
//     }
//     return new THREE.MeshBasicMaterial({
//       color: state.design.bgColor || "#000000",
//       transparent: true,
//     });
//   }, [textureReady, state.design.bgColor]);

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
//   const controlsRef = useRef();
//   const [modelPosition, setModelPosition] = useState([0, 0, 0]);
//   const changeCount = useRef(0);

//   // 监听 OrbitControls 的变化，同步模型位置
//   useEffect(() => {
//     if (!controlsRef.current) return;
    
//     console.log('✅ OrbitControls 已挂载');
    
//     const controls = controlsRef.current;
//     const handleChange = () => {
//       changeCount.current++;
      
//       // 获取当前 target
//       const targetArray = [
//         controls.target.x,
//         controls.target.y,
//         controls.target.z
//       ];
      
//       // 每10次变化输出一次，避免刷屏
//       if (changeCount.current % 10 === 0) {
//         console.log('📍 OrbitControls Change 事件:');
//         console.log('  - Target:', targetArray);
//         console.log('  - 当前模型位置:', modelPosition);
//         console.log('  - 相机位置:', controls.object.position.toArray());
//       }
      
//       // 更新模型位置
//       setModelPosition(targetArray);
//     };
    
//     // 监听各种交互事件
//     const handleStart = () => {
//       console.log('🟢 开始交互 (start event)');
//     };
    
//     const handleEnd = () => {
//       console.log('🔴 结束交互 (end event)');
//       console.log('最终 Target:', controls.target.toArray());
//       console.log('最终相机位置:', controls.object.position.toArray());
//     };
    
//     controls.addEventListener('change', handleChange);
//     controls.addEventListener('start', handleStart);
//     controls.addEventListener('end', handleEnd);
    
//     return () => {
//       controls.removeEventListener('change', handleChange);
//       controls.removeEventListener('start', handleStart);
//       controls.removeEventListener('end', handleEnd);
//     };
//   }, [modelPosition]);

//   // 监听 modelPosition 状态变化
//   useEffect(() => {
//     console.log('🔄 State: modelPosition 已更新为:', modelPosition);
//   }, [modelPosition]);

//   return (
//     <div className="relative w-full h-full select-none" id="canvas-container">
//       {isLoading && <LoadingIndicator />}
      
//       <WebGPUCanvas
//         camera={{ position: [0, 0, 3], fov: 45 }}
//         style={{ width: "100%", height: "100%" }}
//         onCreated={({ camera, scene }) => {
//           console.log('🎬 Canvas 创建完成');
//           console.log('初始相机位置:', camera.position.toArray());
//           setIsLoading(false);
//         }}
//         gl={{ antialias: true }}
//         shadows
//       >
//         <ambientLight intensity={0.8} />
//         <directionalLight position={[5, 5, 5]} intensity={0.3} castShadow />
//         <directionalLight position={[-5, 3, -5]} intensity={0.2} />

//         <Suspense fallback={null}>
//           <RotatingModel
//             key={state.screenImage}
//             customImage={state.screenImage}
//             isDiagonalLayout={state.design.template === "diagonal"}
//             modelPosition={modelPosition}
//           />
//         </Suspense>

//         <OrbitControls
//           ref={controlsRef}
//           enablePan={true}
//           enableRotate={true}
//           enableZoom={true}
//           minDistance={1.5}
//           maxDistance={10}
//           enableDamping
//           dampingFactor={0.05}
//           mouseButtons={{
//             LEFT: THREE.MOUSE.ROTATE,
//             MIDDLE: THREE.MOUSE.DOLLY,
//             RIGHT: THREE.MOUSE.PAN
//           }}
//           onUpdate={(self) => {
//             console.log('🔧 OrbitControls onUpdate - Target:', self.target.toArray());
//           }}
//         />
//       </WebGPUCanvas>
//     </div>
//   );
// }

// export default PhoneModel;