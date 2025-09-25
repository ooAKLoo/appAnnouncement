import React, { useRef, useEffect, useState, Suspense, useMemo } from 'react';
import { Canvas, useLoader, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, useTexture, Environment, Html } from '@react-three/drei';
import { Move, RotateCw } from 'lucide-react';
import * as THREE from 'three/webgpu';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { useApp } from '../context/AppContext';
import { getStyleFontClass } from '../data/styleConfig';

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
    <div className="flex flex-col items-center justify-center h-full text-white/60" id="loading">
      <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin mb-3"></div>
      <div className="text-sm">加载3D模型中...</div>
    </div>
  );
}

const RotatingModel = ({ customImage, modelRotation, isDiagonalLayout, showControlIcons, interactionMode, onModeChange, onShowIcons, ...props }) => {
  const groupRef = useRef();
  
  // 应用3D模型的旋转
  useFrame(() => {
    if (groupRef.current) {
      // Y轴旋转（用户控制）
      if (modelRotation !== undefined) {
        groupRef.current.rotation.y = modelRotation * Math.PI / 180;
      }
      // Z轴倾斜（diagonal模板效果）
      if (isDiagonalLayout) {
        groupRef.current.rotation.z = -12 * Math.PI / 180; // -12度倾斜
        groupRef.current.position.y = 1; // 略微向上偏移
      }
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
      
      {/* HTML元素会自动跟随3D模型，但始终面向屏幕 */}
      <Html
        position={[0.5, 1, 0]} // 相对于模型的3D位置（右上角）
        distanceFactor={8} // 缩放因子
        occlude // 可被3D物体遮挡
        style={{
          transition: 'opacity 0.3s',
          opacity: showControlIcons ? 1 : 0,
          pointerEvents: showControlIcons ? 'auto' : 'none'
        }}
      >
        <div className="flex gap-1">
          {/* 拖拽图标 */}
          <button
            className={`w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-110 shadow-lg ${
              interactionMode === 'move' 
                ? 'bg-blue-100 border border-blue-300 text-blue-700' 
                : 'bg-white/90 hover:bg-white border border-gray-200'
            }`}
            title="拖拽模式"
            onClick={(e) => {
              e.stopPropagation();
              onModeChange('move');
              onShowIcons();
            }}
          >
            <Move size={16} />
          </button>
          
          {/* 旋转图标 */}
          <button
            className={`w-8 h-8 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-110 shadow-lg ${
              interactionMode === 'rotate' 
                ? 'bg-blue-100 border border-blue-300 text-blue-700' 
                : 'bg-white/90 hover:bg-white border border-gray-200'
            }`}
            title="旋转模式"
            onClick={(e) => {
              e.stopPropagation();
              onModeChange('rotate');
              onShowIcons();
            }}
          >
            <RotateCw size={16} />
          </button>
        </div>
      </Html>
      
      {/* 模式提示 */}
      <Html
        position={[0.5, 1.3, 0]} // 稍微在上方
        distanceFactor={8}
        style={{
          transition: 'opacity 0.3s',
          opacity: showControlIcons ? 1 : 0,
          pointerEvents: 'none'
        }}
      >
        <div className="px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg whitespace-nowrap">
          {interactionMode === 'move' ? '拖拽模式' : '旋转模式'}
        </div>
      </Html>
    </group>
  );
};

function PhoneModel3D({ customImage, ...props }) {
  const { state } = useApp();
  const [textureReady, setTextureReady] = useState(false);
  const textureRef = useRef(null);

  // 使用与 model.tsx 完全相同的方式加载 GLTF（DRACO压缩版本）
  const gltf = useLoader(GLTFLoader, '/models/apple_iphone_15_pro_max_black_draco.glb', (loader) => {
    const dracoLoader = new DRACOLoader()
    dracoLoader.setDecoderPath('/draco/')
    loader.setDRACOLoader(dracoLoader)
  })

  const { nodes, materials } = gltf;

  // 生成默认屏幕内容
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
        console.error('Failed to load texture:', error);
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
      color: state.design.bgColor || '#000000',
      transparent: true,
    });
  }, [textureReady, state.design.bgColor])

  // 使用与 model.tsx 完全相同的逐mesh渲染方式
  return (
    <group {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group
          name="Sketchfab_model"
          rotation={[-Math.PI / 2, 0, 0]}
          userData={{ name: 'Sketchfab_model' }}>
          <group
            name="USDRoot"
            rotation={[Math.PI / 2, 0, 0]}
            scale={0.01}
            userData={{ name: 'USDRoot' }}>
            <group
              name="tracking_node_placeholder"
              userData={{ name: 'tracking_node_placeholder' }}>
              <group name="MBJPHxJFDgaTDhF" userData={{ name: 'MBJPHxJFDgaTDhF' }}>
                <group name="rVbvQyXCLAfnDro" userData={{ name: 'rVbvQyXCLAfnDro' }}>
                  <group name="rdkdGpTstFFbsnN" userData={{ name: 'rdkdGpTstFFbsnN' }}>
                    <group name="bMosPntExNwiJNs" userData={{ name: 'bMosPntExNwiJNs' }}>
                      <mesh
                        name="ttmRoLdJipiIOmf"
                        castShadow
                        receiveShadow
                        geometry={nodes.ttmRoLdJipiIOmf?.geometry}
                        material={materials.hUlRcbieVuIiOXG}
                        userData={{ name: 'ttmRoLdJipiIOmf' }}
                      />
                      <group name="HcyBnTbtxefaLfx" userData={{ name: 'HcyBnTbtxefaLfx' }}>
                        <mesh
                          name="DjsDkGiopeiEJZK"
                          castShadow
                          receiveShadow
                          geometry={nodes.DjsDkGiopeiEJZK?.geometry}
                          material={materials.iCxrnlRvbVOguYp}
                          userData={{ name: 'DjsDkGiopeiEJZK' }}
                        />
                        <mesh
                          name="zraMDXCGczVnffU"
                          castShadow
                          receiveShadow
                          geometry={nodes.zraMDXCGczVnffU?.geometry}
                          material={materials.hUlRcbieVuIiOXG}
                          userData={{ name: 'zraMDXCGczVnffU' }}
                        />
                        <mesh
                          name="buRWvyqhBBgcJFo"
                          castShadow
                          receiveShadow
                          geometry={nodes.buRWvyqhBBgcJFo?.geometry}
                          material={materials.eHgELfGhsUorIYR}
                          userData={{ name: 'buRWvyqhBBgcJFo' }}
                        />
                        <mesh
                          name="MrMmlCAsAxJpYqQ_0"
                          castShadow
                          receiveShadow
                          geometry={nodes.MrMmlCAsAxJpYqQ_0?.geometry}
                          material={materials.dxCVrUCvYhjVxqy}
                          userData={{ name: 'MrMmlCAsAxJpYqQ_0' }}
                        />
                        <mesh
                          name="KVYuugCtKRpLNRG_0"
                          castShadow
                          receiveShadow
                          geometry={nodes.KVYuugCtKRpLNRG_0?.geometry}
                          material={materials.mvjnAONQuIshyfX}
                          userData={{ name: 'KVYuugCtKRpLNRG_0' }}
                        />
                        <mesh
                          name="wqbHSzWaUxBCwxY_0"
                          castShadow
                          receiveShadow
                          geometry={nodes.wqbHSzWaUxBCwxY_0?.geometry}
                          material={materials.MHFGNLrDQbTNima}
                          userData={{ name: 'wqbHSzWaUxBCwxY_0' }}
                        />
                        <group name="yOlFnklNiZttLOW" userData={{ name: 'yOlFnklNiZttLOW' }}>
                          <mesh
                            name="QvGDcbDApaGssma"
                            castShadow
                            receiveShadow
                            geometry={nodes.QvGDcbDApaGssma?.geometry}
                            material={materials.kUhjpatHUvkBwfM}
                            userData={{ name: 'QvGDcbDApaGssma' }}
                          />
                          <mesh
                            name="MGPAkjCLsByKXcN"
                            castShadow
                            receiveShadow
                            geometry={nodes.MGPAkjCLsByKXcN?.geometry}
                            material={materials.kUhjpatHUvkBwfM}
                            userData={{ name: 'MGPAkjCLsByKXcN' }}
                          />
                          <mesh
                            name="vFwJFNASGvEHWhs"
                            castShadow
                            receiveShadow
                            geometry={nodes.vFwJFNASGvEHWhs?.geometry}
                            material={materials.RJoymvEsaIItifI}
                            userData={{ name: 'vFwJFNASGvEHWhs' }}
                          />
                          <mesh
                            name="fjHkOQLEMoyeYKr"
                            castShadow
                            receiveShadow
                            geometry={nodes.fjHkOQLEMoyeYKr?.geometry}
                            material={materials.AhrzSsKcKjghXhP}
                            userData={{ name: 'fjHkOQLEMoyeYKr' }}
                          />
                          <mesh
                            name="RvfXLdAOBoQdZkP"
                            castShadow
                            receiveShadow
                            geometry={nodes.RvfXLdAOBoQdZkP?.geometry}
                            material={materials.hUlRcbieVuIiOXG}
                            userData={{ name: 'RvfXLdAOBoQdZkP' }}
                          />
                          <mesh
                            name="VTXyqxbrBeQSTEt"
                            castShadow
                            receiveShadow
                            geometry={nodes.VTXyqxbrBeQSTEt?.geometry}
                            material={materials.eHgELfGhsUorIYR}
                            userData={{ name: 'VTXyqxbrBeQSTEt' }}
                          />
                          <mesh
                            name="evAxFwhaQUwXuua"
                            castShadow
                            receiveShadow
                            geometry={nodes.evAxFwhaQUwXuua?.geometry}
                            material={materials.KSIxMqttXxxmOYl}
                            userData={{ name: 'evAxFwhaQUwXuua' }}
                          />
                          <mesh
                            name="USxQiqZgxHbRvqB"
                            castShadow
                            receiveShadow
                            geometry={nodes.USxQiqZgxHbRvqB?.geometry}
                            material={materials.mcPrzcBUcdqUybC}
                            userData={{ name: 'USxQiqZgxHbRvqB' }}
                          />
                        </group>
                        <group name="UoRZOKZDdwJJsVl" userData={{ name: 'UoRZOKZDdwJJsVl' }}>
                          <mesh
                            name="TvgBVmqNmSrFVfW"
                            castShadow
                            receiveShadow
                            geometry={nodes.TvgBVmqNmSrFVfW?.geometry}
                            material={materials.pIhYLPqiSQOZTjn}
                            userData={{ name: 'TvgBVmqNmSrFVfW' }}
                          />
                        </group>
                        <group name="ZoJjqNAakQjcNhW" userData={{ name: 'ZoJjqNAakQjcNhW' }}>
                          <mesh
                            name="xJhdvBbfHMKCBPl"
                            castShadow
                            receiveShadow
                            geometry={nodes.xJhdvBbfHMKCBPl?.geometry}
                            material={materials.dxCVrUCvYhjVxqy}
                            userData={{ name: 'xJhdvBbfHMKCBPl' }}
                          />
                          <mesh
                            name="eYSJBzbqIfsHPsw"
                            castShadow
                            receiveShadow
                            geometry={nodes.eYSJBzbqIfsHPsw?.geometry}
                            material={materials.hUlRcbieVuIiOXG}
                            userData={{ name: 'eYSJBzbqIfsHPsw' }}
                          />
                          <mesh
                            name="KbMHiTYyrBmkZwz"
                            castShadow
                            receiveShadow
                            geometry={nodes.KbMHiTYyrBmkZwz?.geometry}
                            material={materials.dxCVrUCvYhjVxqy}
                            userData={{ name: 'KbMHiTYyrBmkZwz' }}
                          />
                          <mesh
                            name="sVqcZvpZKhwSmoN"
                            castShadow
                            receiveShadow
                            geometry={nodes.sVqcZvpZKhwSmoN?.geometry}
                            material={materials.dxCVrUCvYhjVxqy}
                            userData={{ name: 'sVqcZvpZKhwSmoN' }}
                          />
                          <mesh
                            name="GuYJryuYunhpphO"
                            castShadow
                            receiveShadow
                            geometry={nodes.GuYJryuYunhpphO?.geometry}
                            material={materials.eShKpuMNVJTRrgg}
                            userData={{ name: 'GuYJryuYunhpphO' }}
                          />
                          <mesh
                            name="DOjZomXdJsbbvcr"
                            castShadow
                            receiveShadow
                            geometry={nodes.DOjZomXdJsbbvcr?.geometry}
                            material={materials.eShKpuMNVJTRrgg}
                            userData={{ name: 'DOjZomXdJsbbvcr' }}
                          />
                          <mesh
                            name="cnreaSmJRdAuFia"
                            castShadow
                            receiveShadow
                            geometry={nodes.cnreaSmJRdAuFia?.geometry}
                            material={materials.eShKpuMNVJTRrgg}
                            userData={{ name: 'cnreaSmJRdAuFia' }}
                          />
                          <group name="ZUpoBLZWQSTiNbu" userData={{ name: 'ZUpoBLZWQSTiNbu' }}>
                            <mesh
                              name="HKHhmqmAZAOaaKY"
                              castShadow
                              receiveShadow
                              geometry={nodes.HKHhmqmAZAOaaKY?.geometry}
                              material={materials.dxCVrUCvYhjVxqy}
                              userData={{ name: 'HKHhmqmAZAOaaKY' }}
                            />
                            <mesh
                              name="IZQgEjTfhbNtjHR"
                              castShadow
                              receiveShadow
                              geometry={nodes.IZQgEjTfhbNtjHR?.geometry}
                              material={materials.eShKpuMNVJTRrgg}
                              userData={{ name: 'IZQgEjTfhbNtjHR' }}
                            />
                          </group>
                        </group>
                        <group name="gxFsxFJsSGiHLmU" userData={{ name: 'gxFsxFJsSGiHLmU' }}>
                          <mesh
                            name="pvdHknDTGDzVpwc"
                            castShadow
                            receiveShadow
                            geometry={nodes.pvdHknDTGDzVpwc?.geometry}
                            material={materials.xdyiJLYTYRfJffH}
                            userData={{ name: 'pvdHknDTGDzVpwc' }}
                          />
                          <mesh
                            name="CfghdUoyzvwzIum"
                            castShadow
                            receiveShadow
                            geometry={nodes.CfghdUoyzvwzIum?.geometry}
                            material={materials.jpGaQNgTtEGkTfo}
                            userData={{ name: 'CfghdUoyzvwzIum' }}
                          />
                          <mesh
                            name="MHfUXxLdYldKhVJ_0"
                            castShadow
                            receiveShadow
                            geometry={nodes.MHfUXxLdYldKhVJ_0?.geometry}
                            material={materials.dxCVrUCvYhjVxqy}
                            userData={{ name: 'MHfUXxLdYldKhVJ_0' }}
                          />
                          <mesh
                            name="TxLQyfBdakwBPHu_0"
                            castShadow
                            receiveShadow
                            geometry={nodes.TxLQyfBdakwBPHu_0?.geometry}
                            material={materials.eShKpuMNVJTRrgg}
                            userData={{ name: 'TxLQyfBdakwBPHu_0' }}
                          />
                        </group>
                      </group>
                      <group name="mfFUMfbDmZhhOWo" userData={{ name: 'mfFUMfbDmZhhOWo' }}>
                        <mesh
                          name="DjdhycfQYjKMDyn"
                          castShadow
                          receiveShadow
                          geometry={nodes.DjdhycfQYjKMDyn?.geometry}
                          material={materials.ujsvqBWRMnqdwPx}
                          userData={{ name: 'DjdhycfQYjKMDyn' }}
                        />
                        <mesh
                          name="usFLmqcyrnltBUr"
                          castShadow
                          receiveShadow
                          geometry={nodes.usFLmqcyrnltBUr?.geometry}
                          material={materials.sxNzrmuTqVeaXdg}
                          userData={{ name: 'usFLmqcyrnltBUr' }}
                        />
                        <group name="HzsqHeSJsfveFUX" userData={{ name: 'HzsqHeSJsfveFUX' }}>
                          {/* 屏幕mesh - 使用自定义材质 */}
                          <mesh
                            name="xXDHkMplTIDAXLN"
                            castShadow
                            receiveShadow={false}
                            geometry={nodes.xXDHkMplTIDAXLN?.geometry}
                            material={imageMaterial}
                            userData={{ name: 'xXDHkMplTIDAXLN' }}
                          />
                          <mesh
                            name="IZbjANwSMLfgcvD"
                            castShadow
                            receiveShadow
                            geometry={nodes.IZbjANwSMLfgcvD?.geometry}
                            material={materials.hUlRcbieVuIiOXG}
                            userData={{ name: 'IZbjANwSMLfgcvD' }}
                          />
                          <mesh
                            name="SysBlPspVQNIcce"
                            castShadow
                            receiveShadow
                            geometry={nodes.SysBlPspVQNIcce?.geometry}
                            material={materials.ujsvqBWRMnqdwPx}
                            userData={{ name: 'SysBlPspVQNIcce' }}
                          />
                          <mesh
                            name="vELORlCJixqPHsZ"
                            castShadow
                            receiveShadow
                            geometry={nodes.vELORlCJixqPHsZ?.geometry}
                            material={materials.zFdeDaGNRwzccye}
                            userData={{ name: 'vELORlCJixqPHsZ' }}
                          />
                        </group>
                        <group name="tqKcchoqxZAjtuJ" userData={{ name: 'tqKcchoqxZAjtuJ' }}>
                          <mesh
                            name="IMPDFDiRXhPIUMV"
                            castShadow
                            receiveShadow
                            geometry={nodes.IMPDFDiRXhPIUMV?.geometry}
                            material={materials.hUlRcbieVuIiOXG}
                            userData={{ name: 'IMPDFDiRXhPIUMV' }}
                          />
                          <mesh
                            name="EbQGKrWAqhBHiMv"
                            castShadow
                            receiveShadow
                            geometry={nodes.EbQGKrWAqhBHiMv?.geometry}
                            material={materials.TBLSREBUyLMVtJa}
                            userData={{ name: 'EbQGKrWAqhBHiMv' }}
                          />
                          <mesh
                            name="EddVrWkqZTlvmci"
                            castShadow
                            receiveShadow
                            geometry={nodes.EddVrWkqZTlvmci?.geometry}
                            material={materials.xNrofRCqOXXHVZt}
                            userData={{ name: 'EddVrWkqZTlvmci' }}
                          />
                          <mesh
                            name="aGrbyjnzqoVJenz"
                            castShadow
                            receiveShadow
                            geometry={nodes.aGrbyjnzqoVJenz?.geometry}
                            material={materials.xNrofRCqOXXHVZt}
                            userData={{ name: 'aGrbyjnzqoVJenz' }}
                          />
                          <mesh
                            name="KSWlaxBcnPDpFCs"
                            castShadow
                            receiveShadow
                            geometry={nodes.KSWlaxBcnPDpFCs?.geometry}
                            material={materials.yQQySPTfbEJufve}
                            userData={{ name: 'KSWlaxBcnPDpFCs' }}
                          />
                        </group>
                        <group name="jDbFLXkDWIFxkkS" userData={{ name: 'jDbFLXkDWIFxkkS' }}>
                          <mesh
                            name="AQkWXGdRSkSZMav"
                            castShadow
                            receiveShadow
                            geometry={nodes.AQkWXGdRSkSZMav?.geometry}
                            material={materials.ujsvqBWRMnqdwPx}
                            userData={{ name: 'AQkWXGdRSkSZMav' }}
                          />
                        </group>
                      </group>
                      <group name="AeiRnzwRtMFJBlp" userData={{ name: 'AeiRnzwRtMFJBlp' }}>
                        <group name="lFhazxDamUcxZIL" userData={{ name: 'lFhazxDamUcxZIL' }}>
                          <mesh
                            name="TakBsdEjEytCAMK"
                            castShadow
                            receiveShadow
                            geometry={nodes.TakBsdEjEytCAMK?.geometry}
                            material={materials.ZQfGMLaFcpPaLMU}
                            userData={{ name: 'TakBsdEjEytCAMK' }}
                          />
                          <mesh
                            name="IykfmVvLplTsTEW"
                            castShadow
                            receiveShadow
                            geometry={nodes.IykfmVvLplTsTEW?.geometry}
                            material={materials.dwrMminMXjXXeek}
                            userData={{ name: 'IykfmVvLplTsTEW' }}
                          />
                        </group>
                        <group name="PzwwYtxiYzbngZl" userData={{ name: 'PzwwYtxiYzbngZl' }}>
                          <mesh
                            name="wLfSXtbwRlBrwof"
                            castShadow
                            receiveShadow
                            geometry={nodes.wLfSXtbwRlBrwof?.geometry}
                            material={materials.oZRkkORNzkufnGD}
                            userData={{ name: 'wLfSXtbwRlBrwof' }}
                          />
                          <mesh
                            name="WJwwVjsahIXbJpU"
                            castShadow
                            receiveShadow
                            geometry={nodes.WJwwVjsahIXbJpU?.geometry}
                            material={materials.yhcAXNGcJWCqtIS}
                            userData={{ name: 'WJwwVjsahIXbJpU' }}
                          />
                          <mesh
                            name="cibcwsZWGgGfpme"
                            castShadow
                            receiveShadow
                            geometry={nodes.cibcwsZWGgGfpme?.geometry}
                            material={materials.ZQfGMLaFcpPaLMU}
                            userData={{ name: 'cibcwsZWGgGfpme' }}
                          />
                          <mesh
                            name="YfrJNXgMvGOAfzz"
                            castShadow
                            receiveShadow
                            geometry={nodes.YfrJNXgMvGOAfzz?.geometry}
                            material={materials.bCgzXjHOanGdTFV}
                            userData={{ name: 'YfrJNXgMvGOAfzz' }}
                          />
                          <mesh
                            name="DCLCbjzqejuvsqH"
                            castShadow
                            receiveShadow
                            geometry={nodes.DCLCbjzqejuvsqH?.geometry}
                            material={materials.vhaEJjZoqGtyLdo}
                            userData={{ name: 'DCLCbjzqejuvsqH' }}
                          />
                          <mesh
                            name="dkQXkqysxzfHFiP"
                            castShadow
                            receiveShadow
                            geometry={nodes.dkQXkqysxzfHFiP?.geometry}
                            material={materials.hUlRcbieVuIiOXG}
                            userData={{ name: 'dkQXkqysxzfHFiP' }}
                          />
                          <mesh
                            name="FscwyiLIVNWUuKe"
                            castShadow
                            receiveShadow
                            geometry={nodes.FscwyiLIVNWUuKe?.geometry}
                            material={materials.fkUApOHLQsMUdfd}
                            userData={{ name: 'FscwyiLIVNWUuKe' }}
                          />
                        </group>
                        <group name="DkixFPrDptubOHd" userData={{ name: 'DkixFPrDptubOHd' }}>
                          <group name="UWqABIyaOofdVYc" userData={{ name: 'UWqABIyaOofdVYc' }}>
                            <mesh
                              name="CdalkzDVnwgdEhS"
                              castShadow
                              receiveShadow
                              geometry={nodes.CdalkzDVnwgdEhS?.geometry}
                              material={materials.jlzuBkUzuJqgiAK}
                              userData={{ name: 'CdalkzDVnwgdEhS' }}
                            />
                            <mesh
                              name="NtjcIgolNGgYlCg"
                              castShadow
                              receiveShadow
                              geometry={nodes.NtjcIgolNGgYlCg?.geometry}
                              material={materials.PpwUTnTFZJXxCoE}
                              userData={{ name: 'NtjcIgolNGgYlCg' }}
                            />
                            <mesh
                              name="zOPceDOPdLNSscX"
                              castShadow
                              receiveShadow
                              geometry={nodes.zOPceDOPdLNSscX?.geometry}
                              material={materials.eShKpuMNVJTRrgg}
                              userData={{ name: 'zOPceDOPdLNSscX' }}
                            />
                            <mesh
                              name="bxjlJpbNESedyat"
                              castShadow
                              receiveShadow
                              geometry={nodes.bxjlJpbNESedyat?.geometry}
                              material={materials.xNrofRCqOXXHVZt}
                              userData={{ name: 'bxjlJpbNESedyat' }}
                            />
                            <mesh
                              name="ehFpgEdYijLjwka"
                              castShadow
                              receiveShadow
                              geometry={nodes.ehFpgEdYijLjwka?.geometry}
                              material={materials.xNrofRCqOXXHVZt}
                              userData={{ name: 'ehFpgEdYijLjwka' }}
                            />
                            <mesh
                              name="IXWuqsIeTqBFLIy"
                              castShadow
                              receiveShadow
                              geometry={nodes.IXWuqsIeTqBFLIy?.geometry}
                              material={materials.EuTsEfyoAnyJIih}
                              userData={{ name: 'IXWuqsIeTqBFLIy' }}
                            />
                            <mesh
                              name="qlwPlhojsxIgqwa"
                              castShadow
                              receiveShadow
                              geometry={nodes.qlwPlhojsxIgqwa?.geometry}
                              material={materials.EszxgwYUTxbhBrC}
                              userData={{ name: 'qlwPlhojsxIgqwa' }}
                            />
                            <mesh
                              name="bpqFtgUKAOOPYpk"
                              castShadow
                              receiveShadow
                              geometry={nodes.bpqFtgUKAOOPYpk?.geometry}
                              material={materials.yQQySPTfbEJufve}
                              userData={{ name: 'bpqFtgUKAOOPYpk' }}
                            />
                            <mesh
                              name="dxVZiHfQBLkPYHO"
                              castShadow
                              receiveShadow
                              geometry={nodes.dxVZiHfQBLkPYHO?.geometry}
                              material={materials.hUlRcbieVuIiOXG}
                              userData={{ name: 'dxVZiHfQBLkPYHO' }}
                            />
                            <mesh
                              name="guvLdFXlBjMoNra"
                              castShadow
                              receiveShadow
                              geometry={nodes.guvLdFXlBjMoNra?.geometry}
                              material={materials.fkUApOHLQsMUdfd}
                              userData={{ name: 'guvLdFXlBjMoNra' }}
                            />
                          </group>
                          <group name="opnyVnejEsnQETV" userData={{ name: 'opnyVnejEsnQETV' }}>
                            <mesh
                              name="PRPzbUhYhabBDYt"
                              castShadow
                              receiveShadow
                              geometry={nodes.PRPzbUhYhabBDYt?.geometry}
                              material={materials.jlzuBkUzuJqgiAK}
                              userData={{ name: 'PRPzbUhYhabBDYt' }}
                            />
                            <mesh
                              name="oOTDgAlTGbFYzBo"
                              castShadow
                              receiveShadow
                              geometry={nodes.oOTDgAlTGbFYzBo?.geometry}
                              material={materials.PpwUTnTFZJXxCoE}
                              userData={{ name: 'oOTDgAlTGbFYzBo' }}
                            />
                            <mesh
                              name="hGKQDeRmDnGNdjb"
                              castShadow
                              receiveShadow
                              geometry={nodes.hGKQDeRmDnGNdjb?.geometry}
                              material={materials.eShKpuMNVJTRrgg}
                              userData={{ name: 'hGKQDeRmDnGNdjb' }}
                            />
                            <mesh
                              name="XRoKUoMkItkzNYL"
                              castShadow
                              receiveShadow
                              geometry={nodes.XRoKUoMkItkzNYL?.geometry}
                              material={materials.jlzuBkUzuJqgiAK}
                              userData={{ name: 'XRoKUoMkItkzNYL' }}
                            />
                            <mesh
                              name="FjtgRCsnzEoHpCy"
                              castShadow
                              receiveShadow
                              geometry={nodes.FjtgRCsnzEoHpCy?.geometry}
                              material={materials.xNrofRCqOXXHVZt}
                              userData={{ name: 'FjtgRCsnzEoHpCy' }}
                            />
                            <mesh
                              name="gJeeYWdxrKsnsVD"
                              castShadow
                              receiveShadow
                              geometry={nodes.gJeeYWdxrKsnsVD?.geometry}
                              material={materials.xNrofRCqOXXHVZt}
                              userData={{ name: 'gJeeYWdxrKsnsVD' }}
                            />
                            <mesh
                              name="KOgQmlOdVEyKocf"
                              castShadow
                              receiveShadow
                              geometry={nodes.KOgQmlOdVEyKocf?.geometry}
                              material={materials.jlzuBkUzuJqgiAK}
                              userData={{ name: 'KOgQmlOdVEyKocf' }}
                            />
                            <mesh
                              name="gTmqYtKthFeRVJL"
                              castShadow
                              receiveShadow
                              geometry={nodes.gTmqYtKthFeRVJL?.geometry}
                              material={materials.xNrofRCqOXXHVZt}
                              userData={{ name: 'gTmqYtKthFeRVJL' }}
                            />
                            <mesh
                              name="obVkazjvaXyXFtA"
                              castShadow
                              receiveShadow
                              geometry={nodes.obVkazjvaXyXFtA?.geometry}
                              material={materials.EuTsEfyoAnyJIih}
                              userData={{ name: 'obVkazjvaXyXFtA' }}
                            />
                            <mesh
                              name="zFlMfSCaOdRDBFx"
                              castShadow
                              receiveShadow
                              geometry={nodes.zFlMfSCaOdRDBFx?.geometry}
                              material={materials.EszxgwYUTxbhBrC}
                              userData={{ name: 'zFlMfSCaOdRDBFx' }}
                            />
                            <mesh
                              name="ooeiSEXgcJckXsp"
                              castShadow
                              receiveShadow
                              geometry={nodes.ooeiSEXgcJckXsp?.geometry}
                              material={materials.yQQySPTfbEJufve}
                              userData={{ name: 'ooeiSEXgcJckXsp' }}
                            />
                            <mesh
                              name="lfXEACUihtLFGfq"
                              castShadow
                              receiveShadow
                              geometry={nodes.lfXEACUihtLFGfq?.geometry}
                              material={materials.hUlRcbieVuIiOXG}
                              userData={{ name: 'lfXEACUihtLFGfq' }}
                            />
                            <mesh
                              name="eWbcqPskBBXuZDe"
                              castShadow
                              receiveShadow
                              geometry={nodes.eWbcqPskBBXuZDe?.geometry}
                              material={materials.fkUApOHLQsMUdfd}
                              userData={{ name: 'eWbcqPskBBXuZDe' }}
                            />
                          </group>
                          <group name="GekGWBPcEuQbIrR" userData={{ name: 'GekGWBPcEuQbIrR' }}>
                            <mesh
                              name="AdjkxvMXIDEHBMM"
                              castShadow
                              receiveShadow
                              geometry={nodes.AdjkxvMXIDEHBMM?.geometry}
                              material={materials.eShKpuMNVJTRrgg}
                              userData={{ name: 'AdjkxvMXIDEHBMM' }}
                            />
                            <mesh
                              name="drpRvcOgsocXGbn"
                              castShadow
                              receiveShadow
                              geometry={nodes.drpRvcOgsocXGbn?.geometry}
                              material={materials.PpwUTnTFZJXxCoE}
                              userData={{ name: 'drpRvcOgsocXGbn' }}
                            />
                            <mesh
                              name="KXVnYLSfTdVnSOf"
                              castShadow
                              receiveShadow
                              geometry={nodes.KXVnYLSfTdVnSOf?.geometry}
                              material={materials.jlzuBkUzuJqgiAK}
                              userData={{ name: 'KXVnYLSfTdVnSOf' }}
                            />
                            <mesh
                              name="FFAjDZTPwYrUKAV"
                              castShadow
                              receiveShadow
                              geometry={nodes.FFAjDZTPwYrUKAV?.geometry}
                              material={materials.xNrofRCqOXXHVZt}
                              userData={{ name: 'FFAjDZTPwYrUKAV' }}
                            />
                            <mesh
                              name="AwsQCWysocWlYzN"
                              castShadow
                              receiveShadow
                              geometry={nodes.AwsQCWysocWlYzN?.geometry}
                              material={materials.xNrofRCqOXXHVZt}
                              userData={{ name: 'AwsQCWysocWlYzN' }}
                            />
                            <mesh
                              name="wJqHahKxdxecSAC"
                              castShadow
                              receiveShadow
                              geometry={nodes.wJqHahKxdxecSAC?.geometry}
                              material={materials.EuTsEfyoAnyJIih}
                              userData={{ name: 'wJqHahKxdxecSAC' }}
                            />
                            <mesh
                              name="SRYqzKwamLGuEGm"
                              castShadow
                              receiveShadow
                              geometry={nodes.SRYqzKwamLGuEGm?.geometry}
                              material={materials.EszxgwYUTxbhBrC}
                              userData={{ name: 'SRYqzKwamLGuEGm' }}
                            />
                            <mesh
                              name="yxqQUnbopbiRvZr"
                              castShadow
                              receiveShadow
                              geometry={nodes.yxqQUnbopbiRvZr?.geometry}
                              material={materials.yQQySPTfbEJufve}
                              userData={{ name: 'yxqQUnbopbiRvZr' }}
                            />
                            <mesh
                              name="xtMgDHhPqFLAHyB"
                              castShadow
                              receiveShadow
                              geometry={nodes.xtMgDHhPqFLAHyB?.geometry}
                              material={materials.hUlRcbieVuIiOXG}
                              userData={{ name: 'xtMgDHhPqFLAHyB' }}
                            />
                            <mesh
                              name="nnqwwoLVdMJlHIF"
                              castShadow
                              receiveShadow
                              geometry={nodes.nnqwwoLVdMJlHIF?.geometry}
                              material={materials.fkUApOHLQsMUdfd}
                              userData={{ name: 'nnqwwoLVdMJlHIF' }}
                            />
                          </group>
                          <group name="rMbqHxTbHeRAIuc" userData={{ name: 'rMbqHxTbHeRAIuc' }}>
                            <mesh
                              name="pXBNoLiaMwsDHRF"
                              castShadow
                              receiveShadow
                              geometry={nodes.pXBNoLiaMwsDHRF?.geometry}
                              material={materials.yiDkEwDSyEhavuP}
                              userData={{ name: 'pXBNoLiaMwsDHRF' }}
                            />
                            <mesh
                              name="SCoTCDlNLPQMMyt"
                              castShadow
                              receiveShadow
                              geometry={nodes.SCoTCDlNLPQMMyt?.geometry}
                              material={materials.yiDkEwDSyEhavuP}
                              userData={{ name: 'SCoTCDlNLPQMMyt' }}
                            />
                            <mesh
                              name="fdZyCEcqJDKBWVW"
                              castShadow
                              receiveShadow
                              geometry={nodes.fdZyCEcqJDKBWVW?.geometry}
                              material={materials.hUlRcbieVuIiOXG}
                              userData={{ name: 'fdZyCEcqJDKBWVW' }}
                            />
                          </group>
                          <group name="iVIwUpzUeaqgBWi" userData={{ name: 'iVIwUpzUeaqgBWi' }}>
                            <mesh
                              name="IkoiNqATMVoZFKD"
                              castShadow
                              receiveShadow
                              geometry={nodes.IkoiNqATMVoZFKD?.geometry}
                              material={materials.hiVunnLeAHkwGEo}
                              userData={{ name: 'IkoiNqATMVoZFKD' }}
                            />
                            <mesh
                              name="rqgRAGHOwnuBypi"
                              castShadow
                              receiveShadow
                              geometry={nodes.rqgRAGHOwnuBypi?.geometry}
                              material={materials.HGhEhpqSBZRnjHC}
                              userData={{ name: 'rqgRAGHOwnuBypi' }}
                            />
                            <mesh
                              name="npMJxzurVJQlumk"
                              castShadow
                              receiveShadow
                              geometry={nodes.npMJxzurVJQlumk?.geometry}
                              material={materials.JJvGZqtXqnnFakR}
                              userData={{ name: 'npMJxzurVJQlumk' }}
                            />
                          </group>
                        </group>
                      </group>
                    </group>
                  </group>
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  )
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
    initialPosition: [0, 0, 0] // 新增：记录拖拽开始时的模型位置
  });
  
  // 控制图标相关状态
  const [showControlIcons, setShowControlIcons] = useState(false);
  const [interactionMode, setInteractionMode] = useState('move'); // 'move' | 'rotate'
  const [isRotating, setIsRotating] = useState(false);
  const [rotateStart, setRotateStart] = useState({ angle: 0, startAngle: 0 });
  const hideIconTimeoutRef = useRef(null);
  

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
      y: rect.top + rect.height / 2
    };
  };

  // 处理鼠标按下开始交互
  const handleMouseDown = (e) => {
    if (e.target.tagName === 'CANVAS') {
      if (interactionMode === 'move') {
        setIsDragging(true);
        setDragStart({
          x: e.clientX,
          y: e.clientY,
          initialPosition: [...modelPosition] // 记录当前模型位置
        });
      } else if (interactionMode === 'rotate') {
        setIsRotating(true);
        setRotateStart({
          angle: modelRotation,
          startX: e.clientX
        });
      }
      // 显示控制图标
      showControlIconsWithTimeout();
    }
  };

  // 处理鼠标移动
const handleMouseMove = (e) => {
  if (isDragging && interactionMode === 'move') {
    const sensitivity = calculateSensitivity(); // 动态计算
    const deltaX = (e.clientX - dragStart.x) * sensitivity;
    const deltaY = -(e.clientY - dragStart.y) * sensitivity;
    
    setModelPosition([
      dragStart.initialPosition[0] + deltaX,
      dragStart.initialPosition[1] + deltaY,
      dragStart.initialPosition[2]
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
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      if (interactionMode === 'move') {
        setIsDragging(true);
        setDragStart({
          x: touch.clientX,
          y: touch.clientY,
          initialPosition: [...modelPosition] // 记录当前位置
        });
      } else if (interactionMode === 'rotate') {
        setIsRotating(true);
        setRotateStart({
          angle: modelRotation,
          startX: touch.clientX
        });
      }
      // 显示控制图标
      showControlIconsWithTimeout();
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
        dragStart.initialPosition[2]
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
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isRotating, dragStart, rotateStart, modelPosition, modelRotation]);


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
        interactionMode === 'move' ? 'cursor-grab' : 'cursor-crosshair'
      } ${isDragging && interactionMode === 'move' ? 'cursor-grabbing' : ''}`} 
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
        style={{ width: '100%', height: '100%' }}
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
        
        <directionalLight 
          position={[-5, 3, -5]} 
          intensity={0.2} 
        />
        
        <Suspense fallback={null}>
          <group position={modelPosition}>
            <RotatingModel 
              key={state.screenImage} 
              customImage={state.screenImage}
              modelRotation={modelRotation}
              isDiagonalLayout={state.design.template === 'diagonal'}
              showControlIcons={showControlIcons}
              interactionMode={interactionMode}
              onModeChange={setInteractionMode}
              onShowIcons={showControlIconsWithTimeout}
            />
          </group>
        </Suspense>
        
        {/* 启用OrbitControls的缩放功能，禁用其他控制 */}
      <OrbitControls 
  ref={orbitRef}
  enablePan={false}
  enableRotate={false}
  enableZoom={true}
  minDistance={1.5}
  maxDistance={10}
  
  // 优化缩放体验
  zoomSpeed={0.5}           // 降低缩放速度，更精细控制
  enableDamping={true}      // 确保启用阻尼
  dampingFactor={0.1}       // 增加阻尼，更丝滑
  
  // 添加这些参数进一步优化
  rotateSpeed={0.5}         // 即使禁用也设置，保持一致性
  panSpeed={0.5}
  maxPolarAngle={Math.PI}   // 限制垂直旋转范围
  minPolarAngle={0}
/>
      </WebGPUCanvas>
    </div>
  );
}

export default PhoneModel;