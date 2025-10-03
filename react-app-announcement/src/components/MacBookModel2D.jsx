import React, { useEffect, useState, useRef } from 'react';
import { RotateCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

function MacBookModel2D() {
  const { state } = useApp();
  const [screenContent, setScreenContent] = useState(null);
  const [macbookSize, setMacbookSize] = useState({ width: 0, height: 0 });
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

  useEffect(() => {
    return () => {
      if (hideIconTimeoutRef.current) {
        clearTimeout(hideIconTimeoutRef.current);
      }
    };
  }, []);

  // 使用用户上传的截图作为屏幕内容
  useEffect(() => {
    if (state.screenImage) {
      setScreenContent(state.screenImage);
    }
  }, [state.screenImage]);

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
              top: macbookSize.height > 0 ? `${macbookSize.height * 0.055}px` : '30px',
              left: macbookSize.width > 0 ? `${macbookSize.width * 0.105}px` : '65px',
              width: macbookSize.width > 0 ? `${macbookSize.width * 0.79}px` : '488px',
              height: macbookSize.height > 0 ? `${macbookSize.height * 0.71}px` : '307px',
              borderRadius: macbookSize.width > 0 ? `${(macbookSize.width * 0.79) * 0.02}px` : '10px',
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
