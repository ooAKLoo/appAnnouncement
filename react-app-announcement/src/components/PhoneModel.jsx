import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useLoader, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, useTexture, Environment } from '@react-three/drei';
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

const RotatingModel = ({ customImage, ...props }) => {
  const groupRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const rotationSpeedRef = useRef(0.005);
  const transitionProgressRef = useRef(0);
  
  const normalSpeed = 0.005;
  const hoverSpeed = 0.0015;
  
  const cubicInOut = (t) => {
    return t < 0.5
      ? 4 * t * t * t
      : 0.5 * Math.pow(2 * t - 2, 3) + 1;
  };
  
  // 注释掉自动旋转功能
  // useFrame((_, delta) => {
  //   if (groupRef.current) {
  //     const transitionDirection = isHovered ? -1 : 1;
  //     
  //     transitionProgressRef.current = Math.max(
  //       0, 
  //       Math.min(
  //         1, 
  //         transitionProgressRef.current + transitionDirection * delta * 1.5
  //       )
  //     );
  //     
  //     const easedProgress = cubicInOut(transitionProgressRef.current);
  //     
  //     rotationSpeedRef.current = THREE.MathUtils.lerp(
  //       hoverSpeed,
  //       normalSpeed,
  //       easedProgress
  //     );
  //     
  //     groupRef.current.rotation.y += rotationSpeedRef.current;
  //   }
  // });
  
  return (
    <group 
      ref={groupRef}
    >
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

  // 使用与 model.tsx 完全相同的方式处理纹理 - 优先使用 customImage
  const defaultScreen = state.screenImage || generateDefaultScreen();
  const imageTexture = useTexture(customImage || defaultScreen);
  
  imageTexture.colorSpace = THREE.SRGBColorSpace;

  // 使用MeshBasicMaterial，不受光照影响，模拟真实的自发光屏幕
  const imageMaterial = new THREE.MeshBasicMaterial({ 
    map: imageTexture,
    transparent: true,
  })

  useEffect(() => {
    if (imageTexture) {
      imageTexture.flipY = true  // 改为true来翻转图片
      imageTexture.needsUpdate = true
    }
  }, [imageTexture, customImage])

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
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="relative w-full h-[800px]" id="canvas-container">
      {isLoading && <LoadingIndicator />}
      <WebGPUCanvas
        camera={{ 
          fov: 45, 
          position: [0, 0, 3],
          near: 0.1,
          far: 1000
        }}
        style={{ width: '100%', height: '100%' }}
        onCreated={() => setIsLoading(false)}
        gl={{ antialias: true }}
        shadows // 启用阴影
      >
        {/* 移除黑色背景 */}
        <ambientLight intensity={0.8} />
        
        {/* 降低光线强度以减少反射 */}
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
        
        <Suspense fallback={
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[1, 2, 0.1]} />
            <meshStandardMaterial color="#666666" />
          </mesh>
        }>
          <RotatingModel />
        </Suspense>
        
        <OrbitControls 
          enableDamping
          dampingFactor={0.05}
          minDistance={1.5}
          maxDistance={10}
        />
        
        {/* 移除HDR环境光照以减少反射 */}
        {/* <Suspense fallback={null}>
          <Environment files="/studio_small_03_4k.hdr" />
        </Suspense> */}
        
      </WebGPUCanvas>
    </div>
  );
}

export default PhoneModel;