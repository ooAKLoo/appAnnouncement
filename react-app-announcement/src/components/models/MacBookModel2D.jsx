import React, { useEffect, useState, useRef } from 'react';
import { RotateCw } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getStyleFontClass } from '../../data/styleConfig';

function MacBookModel2D() {
  const { state, updateModelState, generateTemplateCode } = useApp();
  const [screenContent, setScreenContent] = useState(null);
  const [macbookSize, setMacbookSize] = useState({ width: 0, height: 0 });
  const [transform, setTransform] = useState({
    scale: state.modelState.scale || 1,
    rotation: state.modelState.rotation?.z || 0,
    x: state.modelState.position?.x || 0,
    y: state.modelState.position?.y || 0
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  // 旋转图标相关状态
  const [showRotateIcon, setShowRotateIcon] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [rotateStart, setRotateStart] = useState({ angle: 0, startAngle: 0 });
  const hideIconTimeoutRef = useRef(null);

  // Update macbook dimensions when image loads
  useEffect(() => {
    const updateSize = () => {
      if (imgRef.current) {
        setMacbookSize({
          width: imgRef.current.offsetWidth,
          height: imgRef.current.offsetHeight
        });
      }
    };

    if (imgRef.current?.complete) {
      updateSize();
    }

    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 处理鼠标滚轮缩放
  const handleWheel = (e) => {
    e.preventDefault();
    const scaleFactor = 0.03;
    const delta = e.deltaY > 0 ? (1 - scaleFactor) : (1 + scaleFactor);

    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale * delta))
    }));

    showRotateIconWithTimeout();
  };

  // 处理鼠标拖拽
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - transform.x,
      y: e.clientY - transform.y
    });
    showRotateIconWithTimeout();
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }));
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 显示旋转图标并设置自动隐藏
  const showRotateIconWithTimeout = () => {
    setShowRotateIcon(true);

    if (hideIconTimeoutRef.current) {
      clearTimeout(hideIconTimeoutRef.current);
    }

    hideIconTimeoutRef.current = setTimeout(() => {
      setShowRotateIcon(false);
    }, 1500);
  };

  // 计算角度
  const calculateAngle = (clientX, clientY, centerX, centerY) => {
    const deltaX = clientX - centerX;
    const deltaY = clientY - centerY;
    return Math.atan2(deltaY, deltaX) * (180 / Math.PI);
  };

  // 获取元素中心点
  const getElementCenter = () => {
    if (!containerRef.current) return { x: 0, y: 0 };

    const rect = containerRef.current.getBoundingClientRect();
    return {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2
    };
  };

  // 旋转处理
  const handleRotateMouseDown = (e) => {
    e.stopPropagation();
    setIsRotating(true);

    const center = getElementCenter();
    const startAngle = calculateAngle(e.clientX, e.clientY, center.x, center.y);

    setRotateStart({
      angle: transform.rotation,
      startAngle: startAngle
    });
  };

  const handleRotateMouseMove = (e) => {
    if (!isRotating) return;

    const center = getElementCenter();
    const currentAngle = calculateAngle(e.clientX, e.clientY, center.x, center.y);
    const angleDiff = currentAngle - rotateStart.startAngle;
    const newRotation = rotateStart.angle + angleDiff;

    setTransform(prev => ({
      ...prev,
      rotation: newRotation
    }));
  };

  const handleRotateMouseUp = () => {
    setIsRotating(false);
    showRotateIconWithTimeout();
  };

  // 监听全局鼠标事件
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  useEffect(() => {
    if (isRotating) {
      document.addEventListener('mousemove', handleRotateMouseMove);
      document.addEventListener('mouseup', handleRotateMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleRotateMouseMove);
        document.removeEventListener('mouseup', handleRotateMouseUp);
      };
    }
  }, [isRotating, rotateStart]);

  // 监听模板版本号变化，同步外部 modelState（避免拖动时的循环更新）
  useEffect(() => {
    if (state.modelState.position && state.modelState.rotation && !isDragging && !isRotating) {
      setTransform({
        scale: state.modelState.scale || 1,
        rotation: state.modelState.rotation.z || 0,
        x: state.modelState.position.x || 0,
        y: state.modelState.position.y || 0
      });
    }
  }, [state.templateVersion, state.modelType]);

  // 同步 MacBook 2D 模型状态到全局 context（总是保存，不限于模板编辑模式）
  useEffect(() => {
    updateModelState({
      scale: transform.scale,
      rotation: { x: 0, y: 0, z: transform.rotation },
      position: { x: transform.x, y: transform.y, z: 0 }
    });

    // 只在模板编辑模式下生成代码
    if (state.templateEditMode) {
      setTimeout(() => generateTemplateCode(), 50);
    }
  }, [transform, state.templateEditMode, updateModelState, generateTemplateCode]);

  useEffect(() => {
    return () => {
      if (hideIconTimeoutRef.current) {
        clearTimeout(hideIconTimeoutRef.current);
      }
    };
  }, []);

  // 生成默认屏幕内容（MacBook 桌面）
  const generateScreenContent = () => {
    const canvas = document.createElement('canvas');
    // MacBook 屏幕比例 1632 x 1058
    canvas.width = 1632;
    canvas.height = 1058;
    const ctx = canvas.getContext('2d');

    // 获取当前风格的字体配置
    const titleFont = getStyleFontClass(state.currentStyle, 'title');
    const subtitleFont = getStyleFontClass(state.currentStyle, 'subtitle');

    // Draw background (gradient or solid based on colorMode)
    if (state.design.colorMode === 'solid') {
      ctx.fillStyle = state.design.bgColor;
      ctx.fillRect(0, 0, 1632, 1058);
    } else {
      const gradient = ctx.createLinearGradient(0, 0, 0, 1058);
      gradient.addColorStop(0, state.design.bgColor);
      gradient.addColorStop(1, state.design.gradientColor);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 1632, 1058);
    }

    // Draw APP icon (居中显示)
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(716, 329, 200, 200);
    ctx.fillStyle = state.design.bgColor;
    ctx.font = 'bold 96px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(state.appInfo.icon, 816, 459);

    // Draw APP name
    ctx.fillStyle = '#ffffff';
    ctx.font = `${titleFont.fontWeight} 48px ${titleFont.fontFamily.split(',')[0]}`;
    ctx.fillText(state.appInfo.name, 816, 580);

    // Draw description
    ctx.font = `${subtitleFont.fontWeight} 32px ${subtitleFont.fontFamily.split(',')[0]}`;
    const subtitleLines = state.appInfo.subtitle.split('\n');
    subtitleLines.forEach((line, index) => {
      ctx.fillText(line, 816, 650 + (index * 50));
    });

    // Draw some UI elements (macOS style windows)
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.fillRect(100, 800, 600, 80);
    ctx.fillRect(750, 800, 600, 80);
    ctx.fillRect(1400, 800, 150, 80);

    return canvas.toDataURL('image/png');
  };

  // 预处理图片以适配 MacBook 屏幕比例
  const preprocessImage = (imageSrc) => {
    return new Promise((resolve) => {
      // 根据实际尺寸：屏幕 1632x1058，MacBook 整体 2048x1349.5
      // 屏幕比例：1632 / 1058 ≈ 1.542
      const targetRatio = 1632 / 1058;

      const img = new Image();
      img.onload = () => {
        const imgRatio = img.width / img.height;

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        // 启用最高质量的图像平滑
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        // cover模式：按比例裁剪，保持原图质量
        canvas.width = img.width;
        canvas.height = img.height;

        if (imgRatio > targetRatio) {
          // 图片更宽，按高度适配，裁剪左右
          const drawWidth = img.height * targetRatio;
          const offsetX = (img.width - drawWidth) / 2;
          ctx.drawImage(img, offsetX, 0, drawWidth, img.height, 0, 0, img.width, img.height);
        } else {
          // 图片更高，按宽度适配，裁剪上下
          const drawHeight = img.width / targetRatio;
          const offsetY = (img.height - drawHeight) / 2;
          ctx.drawImage(img, 0, offsetY, img.width, drawHeight, 0, 0, img.width, img.height);
        }

        // 使用PNG格式保持最高质量
        resolve(canvas.toDataURL('image/png', 1.0));
      };

      if (imageSrc.startsWith('data:') || imageSrc.startsWith('blob:')) {
        img.src = imageSrc;
      } else {
        img.crossOrigin = 'anonymous';
        img.src = imageSrc;
      }
    });
  };

  // 使用用户上传的截图作为屏幕内容
  useEffect(() => {
    const updateScreenContent = async () => {
      if (state.screenImage) {
        const processedImage = await preprocessImage(state.screenImage);
        setScreenContent(processedImage);
      } else {
        // 如果没有上传图片，生成默认内容
        const defaultScreenData = generateScreenContent();
        setScreenContent(defaultScreenData);
      }
    };

    updateScreenContent();
  }, [
    state.screenImage,
    state.design.bgColor,
    state.design.gradientColor,
    state.design.colorMode,
    state.appInfo.icon,
    state.appInfo.name,
    state.appInfo.subtitle,
    state.currentStyle
  ]);

  return (
    <div
      className="macbook-model-2d relative w-full h-[800px] flex items-center justify-center"
      id="canvas-container-2d"
      style={{ pointerEvents: 'auto' }}
      onContextMenu={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <div
        ref={containerRef}
        className="relative inline-block cursor-grab select-none"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale}) rotate(${transform.rotation}deg)`,
          transition: isDragging || isRotating ? 'none' : 'transform 0.3s ease-out'
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
      >

        {/* 旋转控制按钮 */}
        {showRotateIcon && (
          <div
            className={`absolute -top-2 -right-2 z-30 w-8 h-8 bg-white/90 hover:bg-white backdrop-blur-sm border border-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-110 shadow-lg cursor-grab ${
              isRotating ? 'cursor-grabbing' : ''
            }`}
            title="拖拽旋转模型"
            onMouseDown={handleRotateMouseDown}
          >
            <RotateCw size={16} />
          </div>
        )}

        {/* 旋转角度提示 */}
        {isRotating && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-40 px-2 py-1 bg-gray-800 text-white text-xs rounded shadow-lg">
            {Math.round(((transform.rotation % 360) + 360) % 360)}°
          </div>
        )}

        {/* 屏幕内容 */}
        {screenContent && (
          <div
            className="absolute z-10"
            style={{
              // 基于 Figma 实测数据：
              // MacBook: 2048 × 1349.5px (X:6394, Y:-10319)
              // 屏幕区域: 1632 × 1058px (X:6602, Y:-10173)
              // 左边距: 6602 - 6394 = 208px
              // 顶部距: -10173 - (-10319) = 146px
              // 圆角: 23px（按屏幕宽度比例缩放，23/1632）
              top: macbookSize.height > 0 ? `${macbookSize.height * (146 / 1349.5)}px` : '146px',
              left: macbookSize.width > 0 ? `${macbookSize.width * (208 / 2048)}px` : '208px',
              width: macbookSize.width > 0 ? `${macbookSize.width * (1632 / 2048)}px` : '1632px',
              height: macbookSize.height > 0 ? `${macbookSize.height * (1058 / 1349.5)}px` : '1058px',
              // 圆角按屏幕区域宽度比例缩放
              borderRadius: macbookSize.width > 0
                ? `${macbookSize.width * (1632 / 2048) * (23 / 1632)}px ${macbookSize.width * (1632 / 2048) * (23 / 1632)}px 0 0`
                : '23px 23px 0 0',
              overflow: 'hidden',
              backgroundColor: '#000'
            }}
          >
            <img
              src={screenContent}
              alt="Screen content"
              className="w-full h-full"
              style={{
                objectFit: 'cover',
                objectPosition: 'center'
              }}
            />
          </div>
        )}

        {/* MacBook 图片 */}
        <img
          ref={imgRef}
          src="/macbook-mockup.png"
          alt="MacBook"
          className="relative z-20 block w-auto h-[500px] drop-shadow-2xl"
          style={{
            filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))'
          }}
          onLoad={(e) => {
            setMacbookSize({
              width: e.target.offsetWidth,
              height: e.target.offsetHeight
            });
          }}
          draggable={false}
        />
      </div>
    </div>
  );
}

export default MacBookModel2D;
