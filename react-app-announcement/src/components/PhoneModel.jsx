import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { useApp } from '../context/AppContext';
import { getStyleFontClass } from '../data/styleConfig';

function LoadingIndicator() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-white/60" id="loading">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mb-3"></div>
      <div className="text-sm">加载3D模型中...</div>
    </div>
  );
}

function PhoneModel3D() {  // Changed component name to avoid conflicts
  const { state } = useApp();
  const groupRef = useRef();
  const [modelScene, setModelScene] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load GLTF model using useGLTF hook
  const { scene } = useGLTF('/models/apple_iphone_15_pro_max_black.glb');

  useEffect(() => {
    if (scene && !isLoaded) {
      // Clone the scene to avoid modifying the original
      const clonedScene = scene.clone();
      
      // Center and scale the model
      const box = new THREE.Box3().setFromObject(clonedScene);
      const center = box.getCenter(new THREE.Vector3());
      clonedScene.position.sub(center);
      
      const size = box.getSize(new THREE.Vector3());
      const maxSize = Math.max(size.x, size.y, size.z);
      const targetSize = 3.5; // Increased from 3 to 5 for larger display
      clonedScene.scale.multiplyScalar(targetSize / maxSize);
      
      clonedScene.rotation.y = Math.PI ;
      
      // Optimize materials for performance
      clonedScene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = false;
          child.receiveShadow = false;
          
          if (child.material) {
            if (child.material.isMeshStandardMaterial || 
                child.material.isMeshPhysicalMaterial) {
              child.material.envMapIntensity = 0;
              child.material.needsUpdate = true;
            }
          }
        }
      });
      
      setModelScene(clonedScene);
      setIsLoaded(true);
      console.log('iPhone 3D model loaded successfully');
    }
  }, [scene, isLoaded]);

  // Generate default screen content
  const generateDefaultScreen = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');
    
    // 获取当前风格的字体配置
    const titleFont = getStyleFontClass(state.currentStyle, 'title');
    const subtitleFont = getStyleFontClass(state.currentStyle, 'subtitle');

    // Draw background (gradient or solid based on colorMode)
    if (state.design.colorMode === 'solid') {
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
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(150, 200, 100, 100);
    ctx.fillStyle = state.design.bgColor;
    ctx.font = 'bold 48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(state.appInfo.icon, 200, 265);

    // Draw APP name
    ctx.fillStyle = '#ffffff';
    ctx.font = `${titleFont.fontWeight} 24px ${titleFont.fontFamily.split(',')[0]}`;
    ctx.fillText(state.appInfo.name, 200, 340);

    // Draw description
    ctx.font = `${subtitleFont.fontWeight} 16px ${subtitleFont.fontFamily.split(',')[0]}`;
    const subtitleLines = state.appInfo.subtitle.split('\n');
    subtitleLines.forEach((line, index) => {
      ctx.fillText(line, 200, 380 + (index * 30));
    });

    // Draw some UI elements
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillRect(40, 500, 320, 60);
    ctx.fillRect(40, 580, 320, 60);
    ctx.fillRect(40, 660, 320, 60);

    return canvas.toDataURL('image/png');
  };

  // Update screen with image
  const updateScreenWithImage = (imageSrc) => {
    if (!modelScene) {
      console.warn('3D model not loaded yet');
      return;
    }
    
    let screenMesh = null;
    
    // Find the screen mesh by name (from original code)
    modelScene.traverse((child) => {
      if (child.isMesh && child.name === 'xXDHkMplTIDAXLN') {
        screenMesh = child;
        console.log('Found iPhone screen mesh!');
      }
    });
    
    if (!screenMesh) {
      // Search for alternative screen mesh
      modelScene.traverse((child) => {
        if (child.isMesh && child.material) {
          // Check material name
          if (child.material.name === 'pIJKfZsazmcpEiU') {
            screenMesh = child;
            console.log('Found alternative screen mesh:', child.name);
          }
        }
      });
    }
    
    if (screenMesh) {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(imageSrc, (texture) => {
        texture.wrapS = THREE.ClampToEdgeWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.colorSpace = THREE.SRGBColorSpace;
        
        const screenMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          roughness: 0.1,
          metalness: 0,
          emissive: new THREE.Color(0x222222),
          emissiveIntensity: 0.2,
          transparent: false,
          opacity: 1
        });
        
        screenMesh.material = screenMaterial;
        screenMesh.material.needsUpdate = true;
        console.log('Screen texture applied successfully');
      });
    } else {
      console.error('Unable to find suitable screen mesh');
      // Log all mesh names for debugging
      modelScene.traverse((child) => {
        if (child.isMesh) {
          console.log('Mesh found:', child.name, 'Material:', child.material?.name);
        }
      });
    }
  };

  // Update screen when state changes
  useEffect(() => {
    if (modelScene && isLoaded) {
      if (state.screenImage) {
        updateScreenWithImage(state.screenImage);
      } else {
        const defaultScreenData = generateDefaultScreen();
        updateScreenWithImage(defaultScreenData);
      }
    }
  }, [modelScene, isLoaded, state.screenImage, state.appInfo, state.design]);

  if (!modelScene) {
    return null;
  }

  return (
    <primitive 
      ref={groupRef}
      object={modelScene}
    />
  );
}


// Error boundary component for 3D model
class Model3DErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('3D Model Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <group>
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1, 2, 0.1]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
        </group>
      );
    }

    return this.props.children;
  }
}

function PhoneModel() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-[800px]" id="canvas-container">
      {isLoading && <LoadingIndicator />}
      <Model3DErrorBoundary>
        <Canvas
          camera={{ 
            fov: 45, 
            position: [0, 0, 5],
            near: 0.1,
            far: 1000
          }}
          style={{ width: '100%', height: '100%' }}
          onCreated={() => setIsLoading(false)}
          gl={{ 
            antialias: true, 
            alpha: true,
            preserveDrawingBuffer: true
          }}
        >
          {/* Lighting setup matching original */}
          <ambientLight intensity={2.2} />
          <directionalLight 
            position={[5, 5, 5]} 
            intensity={1.5}
            castShadow={false}
          />
          <directionalLight 
            position={[-5, -5, -5]} 
            intensity={0.3}
            castShadow={false}
          />
          
          <Suspense fallback={null}>
            <PhoneModel3D />
          </Suspense>
          
          <OrbitControls 
            enableDamping={true}
            dampingFactor={0.05}
            rotateSpeed={0.5}
            minDistance={2}
            maxDistance={15}
            enablePan={false}
          />
        </Canvas>
      </Model3DErrorBoundary>
    </div>
  );
}

// Preload the model
useGLTF.preload('/models/apple_iphone_15_pro_max_black.glb');

export default PhoneModel;