import React, { useEffect, useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { getStyleFontClass } from '../data/styleConfig';

function PhoneModel2D() {
  const { state } = useApp();
  const canvasRef = useRef(null);
  const [screenContent, setScreenContent] = useState(null);
  const [phoneSize, setPhoneSize] = useState({ width: 0, height: 0 });
  const [fitMode, setFitMode] = useState('cover'); // 'cover' | 'contain' | 'fill'
  const [transform, setTransform] = useState({ 
    scale: 1, 
    rotation: 0, 
    x: 0, 
    y: 0 
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const imgRef = useRef(null);
  const containerRef = useRef(null);

  // Update phone dimensions when image loads
  useEffect(() => {
    const updateSize = () => {
      if (imgRef.current) {
        setPhoneSize({
          width: imgRef.current.offsetWidth,
          height: imgRef.current.offsetHeight
        });
      }
    };

    // Update size when image loads
    if (imgRef.current?.complete) {
      updateSize();
    }

    // Add resize listener
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // 处理鼠标滚轮缩放 - 降低灵敏度
  const handleWheel = (e) => {
    e.preventDefault();
    
    // 降低缩放灵敏度，从10%降到3%
    const scaleFactor = 0.03;
    const delta = e.deltaY > 0 ? (1 - scaleFactor) : (1 + scaleFactor);
    
    setTransform(prev => ({
      ...prev,
      scale: Math.max(0.5, Math.min(3, prev.scale * delta))
    }));
  };

  // 处理鼠标按下开始拖拽
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - transform.x,
      y: e.clientY - transform.y
    });
  };

  // 处理鼠标移动拖拽
  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setTransform(prev => ({
      ...prev,
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    }));
  };

  // 处理鼠标释放结束拖拽
  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 处理触摸事件
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({
        x: touch.clientX - transform.x,
        y: touch.clientY - transform.y
      });
    }
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && isDragging) {
      const touch = e.touches[0];
      setTransform(prev => ({
        ...prev,
        x: touch.clientX - dragStart.x,
        y: touch.clientY - dragStart.y
      }));
    }
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // 重置变换
  const resetTransform = () => {
    setTransform({ scale: 1, rotation: 0, x: 0, y: 0 });
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

  // 保持原始图片质量 - 不进行任何压缩处理
  const preprocessImage = (imageSrc) => {
    return new Promise((resolve) => {
      const targetRatio = 384 / 835; // iPhone 17屏幕比例
      
      const img = new Image();
      img.onload = () => {
        const imgRatio = img.width / img.height;
        
        // 直接使用原图尺寸，不进行任何缩放
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // 启用最高质量的图像平滑
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        if (fitMode === 'fill') {
          // 使用原图尺寸，不缩放
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
        } else if (fitMode === 'contain') {
          let canvasWidth, canvasHeight, drawWidth, drawHeight, offsetX = 0, offsetY = 0;
          
          if (imgRatio > targetRatio) {
            canvasWidth = img.width;
            canvasHeight = img.width / targetRatio;
            drawWidth = img.width;
            drawHeight = img.width / imgRatio;
            offsetY = (canvasHeight - drawHeight) / 2;
          } else {
            canvasHeight = img.height;
            canvasWidth = img.height * targetRatio;
            drawHeight = img.height;
            drawWidth = img.height * imgRatio;
            offsetX = (canvasWidth - drawWidth) / 2;
          }
          
          canvas.width = canvasWidth;
          canvas.height = canvasHeight;
          
          // 填充黑色背景
          ctx.fillStyle = '#000000';
          ctx.fillRect(0, 0, canvasWidth, canvasHeight);
          
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);
        } else {
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
        }
        
        // 使用PNG格式保持最高质量，不压缩
        resolve(canvas.toDataURL('image/png', 1.0));
      };
      
      if (imageSrc.startsWith('data:')) {
        img.src = imageSrc;
      } else {
        img.crossOrigin = 'anonymous';
        img.src = imageSrc;
      }
    });
  };

  // Generate screen content
  const generateScreenContent = () => {
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

  // Update screen content when state changes
  useEffect(() => {
    const updateScreenContent = async () => {
      if (state.screenImage) {
        // 直接使用用户上传的原图，不进行任何处理
        setScreenContent(state.screenImage);
      } else {
        const defaultScreenData = generateScreenContent();
        setScreenContent(defaultScreenData);
      }
    };

    updateScreenContent();
  }, [state.screenImage, state.appInfo, state.design, state.currentStyle, fitMode]);

  return (
    <div className="relative w-full h-[800px] flex items-center justify-center" id="canvas-container-2d">
      <div 
        ref={containerRef}
        className="relative inline-block cursor-grab select-none"
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale}) rotate(${transform.rotation}deg)`,
          transition: isDragging ? 'none' : 'transform 0.1s ease-out'
        }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Screen overlay - 作为背景层，位置在样机下方 */}
        {screenContent && (
          <div 
            className="absolute z-10"
            style={{
              // 基于测试数据: 手机430x879px, 屏幕384x835px
              // 修正计算: 使用正确的参考基准
              top: phoneSize.height > 0 ? `${phoneSize.height * 0.025}px` : '22px',     // 2.5%顶部边距
              left: phoneSize.width > 0 ? `${phoneSize.width * 0.0535}px` : '23px',     // 5.35%左边距
              width: phoneSize.width > 0 ? `${phoneSize.width * 0.893}px` : '384px',    // 89.3%宽度 (384/430)
              height: phoneSize.height > 0 ? `${phoneSize.height * 0.95}px` : '835px',  // 95.0%高度 (835/879)
              // 圆角: 60px相对于屏幕区域的比例
              borderRadius: phoneSize.width > 0 ? `${(phoneSize.width * 0.893) * 0.156}px` : '60px',
              overflow: 'hidden',
              backgroundColor: '#000'
            }}
          >
            <img 
              src={screenContent} 
              alt="Screen content"
              className="w-full h-full"
              style={{
                objectFit: 'cover', // 改为cover以保持原图比例和质量
                objectPosition: 'center'
              }}
            />
          </div>
        )}
        
        {/* iPhone static image - 作为顶层，显示Dynamic Island等细节 */}
        <img 
          ref={imgRef}
          src="/iphone-17-black.png" 
          alt="iPhone 17"
          className="relative z-20 block w-auto h-[700px] drop-shadow-2xl"
          style={{
            filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.15))'
          }}
          onLoad={(e) => {
            setPhoneSize({
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

export default PhoneModel2D;