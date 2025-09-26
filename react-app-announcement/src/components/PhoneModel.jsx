import React, { useRef, useEffect, useState, Suspense, useMemo } from "react";
import { Canvas, useLoader, useFrame, extend } from "@react-three/fiber";
import {
  OrbitControls,
  useTexture,
  Environment,
  Html,
  TransformControls,
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

// 移除外部的 RotatingModel，直接在内部处理
const InnerModel = ({ customImage, isDiagonalLayout, modelTransform }) => {
  const groupRef = useRef();
  const hasSetDiagonalTransform = useRef(false);

  useFrame(() => {
    if (groupRef.current && isDiagonalLayout && !hasSetDiagonalTransform.current) {
      groupRef.current.rotation.z = (-12 * Math.PI) / 180;
      groupRef.current.position.y = modelTransform.position[1] + 1;
      hasSetDiagonalTransform.current = true;
    } else if (!isDiagonalLayout && hasSetDiagonalTransform.current) {
      groupRef.current.rotation.z = 0;
      groupRef.current.position.y = modelTransform.position[1];
      hasSetDiagonalTransform.current = false;
    }
  });

  return (
    <group ref={groupRef}>
      <PhoneModel3D
        position={[0, 0, 0]}
        rotation={[0, Math.PI, 0]}
        scale={10}
        customImage={customImage}
      />
    </group>
  );
};

function PhoneModel3D({ customImage, ...props }) {
  const { state } = useApp();
  const [textureReady, setTextureReady] = useState(false);
  const textureRef = useRef(null);

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

  const generateDefaultScreen = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 400;
    canvas.height = 800;
    const ctx = canvas.getContext("2d");

    const titleFont = getStyleFontClass(state.currentStyle, "title");
    const subtitleFont = getStyleFontClass(state.currentStyle, "subtitle");

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

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(150, 200, 100, 100);
    ctx.fillStyle = state.design.bgColor;
    ctx.font = "bold 48px Arial";
    ctx.textAlign = "center";
    ctx.fillText(state.appInfo.icon, 200, 265);

    ctx.fillStyle = "#ffffff";
    ctx.font = `${titleFont.fontWeight} 24px ${
      titleFont.fontFamily.split(",")[0]
    }`;
    ctx.fillText(state.appInfo.name, 200, 340);

    ctx.font = `${subtitleFont.fontWeight} 16px ${
      subtitleFont.fontFamily.split(",")[0]
    }`;
    const subtitleLines = state.appInfo.subtitle.split("\n");
    subtitleLines.forEach((line, index) => {
      ctx.fillText(line, 200, 380 + index * 30);
    });

    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(40, 500, 320, 60);
    ctx.fillRect(40, 580, 320, 60);
    ctx.fillRect(40, 660, 320, 60);

    return canvas.toDataURL("image/png");
  };

  const defaultScreen = useMemo(() => {
    return state.screenImage || generateDefaultScreen();
  }, [state.screenImage, state.design, state.appInfo, state.currentStyle]);
  
  const imageSource = customImage || defaultScreen;

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
        setTextureReady(true);
      }
    );
  }, [imageSource]);

  const imageMaterial = useMemo(() => {
    if (textureReady && textureRef.current) {
      return new THREE.MeshBasicMaterial({
        map: textureRef.current,
        transparent: true,
      });
    }
    return new THREE.MeshBasicMaterial({
      color: state.design.bgColor || "#000000",
      transparent: true,
    });
  }, [textureReady, state.design.bgColor]);

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
  const controlsRef = useRef();
  const transformControlsRef = useRef();
  const modelGroupRef = useRef();
  
  // 保存模型的transform状态
  const [modelTransform, setModelTransform] = useState({
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    scale: 1
  });
  
  const [transformMode, setTransformMode] = useState('translate');
  const [isTransformEnabled, setIsTransformEnabled] = useState(false);

  // 处理TransformControls的变化
  const handleTransformChange = () => {
    if (modelGroupRef.current) {
      setModelTransform({
        position: modelGroupRef.current.position.toArray(),
        rotation: modelGroupRef.current.rotation.toArray().slice(0, 3),
        scale: modelGroupRef.current.scale.x // 假设是uniform scale
      });
    }
  };

  return (
    <div className="relative w-full h-full select-none" id="canvas-container">
      {/* Transform Controls UI */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
        <button
          onClick={() => setIsTransformEnabled(!isTransformEnabled)}
          className={`px-3 py-2 rounded-lg backdrop-blur-md border transition-all duration-300 ${
            isTransformEnabled
              ? "bg-blue-500/20 border-blue-400/50 text-blue-300"
              : "bg-white/10 border-white/20 text-white/70 hover:bg-white/20"
          }`}
        >
          {isTransformEnabled ? "退出变换" : "变换模式"}
        </button>
        
        {isTransformEnabled && (
          <div className="flex gap-1">
            <button
              onClick={() => setTransformMode("translate")}
              className={`p-2 rounded backdrop-blur-md border transition-all duration-300 ${
                transformMode === "translate"
                  ? "bg-green-500/20 border-green-400/50 text-green-300"
                  : "bg-white/10 border-white/20 text-white/70 hover:bg-white/20"
              }`}
            >
              <Move size={16} />
            </button>
            <button
              onClick={() => setTransformMode("rotate")}
              className={`p-2 rounded backdrop-blur-md border transition-all duration-300 ${
                transformMode === "rotate"
                  ? "bg-orange-500/20 border-orange-400/50 text-orange-300"
                  : "bg-white/10 border-white/20 text-white/70 hover:bg-white/20"
              }`}
            >
              <RotateCw size={16} />
            </button>
          </div>
        )}
        
        {/* 重置按钮 */}
        {!isTransformEnabled && (
          modelTransform.position[0] !== 0 || 
          modelTransform.position[1] !== 0 || 
          modelTransform.position[2] !== 0 ||
          modelTransform.rotation[0] !== 0 ||
          modelTransform.rotation[1] !== 0 ||
          modelTransform.rotation[2] !== 0
        ) && (
          <button
            onClick={() => {
              setModelTransform({
                position: [0, 0, 0],
                rotation: [0, 0, 0],
                scale: 1
              });
              if (modelGroupRef.current) {
                modelGroupRef.current.position.set(0, 0, 0);
                modelGroupRef.current.rotation.set(0, 0, 0);
                modelGroupRef.current.scale.set(1, 1, 1);
              }
            }}
            className="px-3 py-2 rounded-lg backdrop-blur-md border bg-red-500/20 border-red-400/50 text-red-300"
          >
            重置位置
          </button>
        )}
      </div>
      
      {isLoading && <LoadingIndicator />}
      
      <WebGPUCanvas
        camera={{ position: [0, 0, 3], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
        onCreated={() => setIsLoading(false)}
        gl={{ antialias: true }}
        shadows
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={0.3} castShadow />
        <directionalLight position={[-5, 3, -5]} intensity={0.2} />

        <Suspense fallback={null}>
          {/* 持久化的模型组 */}
          <group
            ref={modelGroupRef}
            position={modelTransform.position}
            rotation={modelTransform.rotation}
            scale={modelTransform.scale}
          >
            <InnerModel
              customImage={state.screenImage}
              isDiagonalLayout={state.design.template === "diagonal"}
              modelTransform={modelTransform}
            />
          </group>

          {/* TransformControls独立渲染 */}
          {isTransformEnabled && (
            <TransformControls
              ref={transformControlsRef}
              object={modelGroupRef.current}
              mode={transformMode}
              size={0.8}
              onChange={handleTransformChange}
              onDragging={(dragging) => {
                if (controlsRef.current) {
                  controlsRef.current.enabled = !dragging;
                }
              }}
            />
          )}
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableRotate={!isTransformEnabled}
          enableZoom={true}
          minDistance={1.5}
          maxDistance={10}
          enableDamping
          dampingFactor={0.05}
        />
      </WebGPUCanvas>
    </div>
  );
}

export default PhoneModel;