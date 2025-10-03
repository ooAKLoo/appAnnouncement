import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import StyledText from '../common/StyledText';
import Editable from '../common/Editable';

// Product Hunt 模板1 - 居中图标
export const ProductHuntCenterTemplate = () => {
  const { state } = useApp();
  const productHuntInfo = state.productHuntInfo || {
    badge: 'NOW AVAILABLE',
    name: 'Postory',
    tagline: 'Create your story, share your moments',
    iconImage: '/postory-icon.png'
  };

  const centerX = useMemo(() => {
    return typeof window !== 'undefined' ? window.innerWidth / 2 : 600;
  }, []);

  return (
    <>
      <Editable path="productHuntInfo.badge" x={centerX - 55} y={200}>
        <StyledText className="text-xs font-semibold tracking-widest uppercase opacity-60">
          {productHuntInfo.badge}
        </StyledText>
      </Editable>

      <Editable path="productHuntInfo.iconImage" x={centerX - 80} y={250}>
        <div className="w-40 h-40 rounded-3xl overflow-hidden bg-white/10 flex items-center justify-center">
          {productHuntInfo.iconImage ? (
            <img src={productHuntInfo.iconImage} alt="App Icon" className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl font-bold">{productHuntInfo.name.charAt(0)}</span>
          )}
        </div>
      </Editable>

      <Editable path="productHuntInfo.name" x={centerX - 60} y={420}>
        <StyledText className="text-3xl font-bold">
          {productHuntInfo.name}
        </StyledText>
      </Editable>

      <Editable path="productHuntInfo.tagline" x={centerX - 180} y={480}>
        <StyledText className="text-lg opacity-70 text-center w-[360px]">
          {productHuntInfo.tagline}
        </StyledText>
      </Editable>

      {state.downloads.showAppStore && (
        <Editable path="downloads.showAppStore" x={centerX - 85} y={560}>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 border border-white/30 rounded-xl cursor-default">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <StyledText className="font-medium">App Store</StyledText>
          </div>
        </Editable>
      )}
    </>
  );
};

// Product Hunt 模板2 - 上图标
export const ProductHuntTopTemplate = () => {
  const { state } = useApp();
  const productHuntInfo = state.productHuntInfo || {
    name: 'Postory',
    tagline: 'Create your story, share your moments',
    description: 'Transform your ideas into beautiful stories',
    iconImage: '/postory-icon.png'
  };

  const centerX = useMemo(() => {
    return typeof window !== 'undefined' ? window.innerWidth / 2 : 600;
  }, []);

  return (
    <>
      <Editable path="productHuntInfo.iconImage" x={centerX - 75} y={150}>
        <div className="w-36 h-36 rounded-3xl overflow-hidden bg-white/10 flex items-center justify-center">
          {productHuntInfo.iconImage ? (
            <img src={productHuntInfo.iconImage} alt="App Icon" className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl font-bold">{productHuntInfo.name.charAt(0)}</span>
          )}
        </div>
      </Editable>

      <Editable path="productHuntInfo.name" x={centerX - 65} y={330}>
        <StyledText className="text-4xl font-bold">
          {productHuntInfo.name}
        </StyledText>
      </Editable>

      <Editable path="productHuntInfo.tagline" x={centerX - 210} y={400}>
        <StyledText className="text-xl opacity-70 text-center w-[420px]">
          {productHuntInfo.tagline}
        </StyledText>
      </Editable>

      <Editable path="productHuntInfo.description" x={centerX - 200} y={460}>
        <StyledText className="text-base opacity-50 text-center w-[400px]">
          {productHuntInfo.description}
        </StyledText>
      </Editable>
    </>
  );
};

// 音频工具页 - Voice AI 模板
export const VoiceAITemplate = () => {
  const centerX = useMemo(() => {
    return typeof window !== 'undefined' ? window.innerWidth / 2 : 600;
  }, []);

  return (
    <>
      {/* 主标题 (2行) */}
      <Editable path="productHuntInfo.title" x={centerX - 220} y={100}>
        <StyledText className="text-3xl font-bold text-center w-[440px] leading-tight">
          Your <span className="text-pink-500">Voice</span>,
          <br />Supercharged by AI
        </StyledText>
      </Editable>

      {/* 副标题 (2行) */}
      <Editable path="productHuntInfo.subtitle" x={centerX - 200} y={170}>
        <StyledText className="text-base opacity-70 text-center w-[400px] leading-relaxed">
          Instant audio transformation powered by AI.
          Create, edit, and enhance with just your voice.
        </StyledText>
      </Editable>

      {/* 音频播放器区域 */}
      <Editable path="productHuntInfo.audioPlayer" x={centerX - 240} y={250}>
        <div className="w-[480px] h-[260px] bg-gray-900/60 border border-white/20 rounded-2xl p-6">
          {/* 波形图示 */}
          <div className="flex items-end gap-1 h-20 mb-6">
            {[...Array(48)].map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-pink-500 to-purple-500 rounded-full"
                style={{ height: `${20 + Math.random() * 80}%` }}
              ></div>
            ))}
          </div>

          {/* 播放控制栏 */}
          <div className="w-full h-1.5 bg-white/10 rounded-full mb-6">
            <div className="w-2/5 h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
          </div>

          {/* 功能图标组 */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center cursor-pointer hover:scale-110 transition-transform">
              <StyledText className="text-lg">▶</StyledText>
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
              <StyledText className="text-base">⏮</StyledText>
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
              <StyledText className="text-base">⏭</StyledText>
            </div>
            <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/20 transition-colors">
              <StyledText className="text-base">🔊</StyledText>
            </div>
          </div>

          {/* 输入框区域 */}
          <div className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
            <StyledText className="text-xs opacity-50">Tell me what you want to create...</StyledText>
          </div>
        </div>
      </Editable>
    </>
  );
};

// Palify 模板 - 设备对比展示
export const PalifyTemplate = () => {
  const { state } = useApp();
  const centerX = useMemo(() => {
    return typeof window !== 'undefined' ? window.innerWidth / 2 : 600;
  }, []);

  const productHuntInfo = state.productHuntInfo || {
    welcome: 'Welcome to Palify',
    tagline: 'Your All-in-One Professional Networking & Growth Platform'
  };

  return (
    <>
      {/* 欢迎文字 */}
      <Editable path="productHuntInfo.welcome" x={centerX - 100} y={80}>
        <StyledText className="text-sm opacity-60 text-center w-[200px]">
          {productHuntInfo.welcome}
        </StyledText>
      </Editable>

      {/* 主标题 */}
      <Editable path="productHuntInfo.tagline" x={centerX - 180} y={120}>
        <StyledText className="text-3xl font-bold text-center w-[360px] leading-tight">
          {productHuntInfo.tagline}
        </StyledText>
      </Editable>

      {/* 设备展示区域容器 */}
      <Editable path="productHuntInfo.deviceContainer" x={centerX - 260} y={210}>
        <div className="w-[520px] h-[300px] bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-white/20 rounded-3xl p-6 flex items-center justify-center gap-6">
          {/* 手机界面 */}
          <div className="w-[160px] h-[260px] bg-white/95 border border-gray-300 rounded-3xl p-4 shadow-2xl">
            {/* 顶部按钮 */}
            <div className="flex gap-2 mb-4">
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
              <div className="w-5 h-5 bg-gray-300 rounded"></div>
            </div>

            {/* App Icon */}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl mb-3"></div>

            {/* 文字内容 */}
            <div className="space-y-2 mb-4">
              <div className="w-full h-2.5 bg-gray-200 rounded"></div>
              <div className="w-3/4 h-2.5 bg-gray-200 rounded"></div>
            </div>

            {/* 内容卡片 */}
            <div className="w-full h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl"></div>
          </div>

          {/* 平板界面 */}
          <div className="w-[280px] h-[260px] bg-gray-900 border border-gray-700 rounded-3xl p-5 shadow-2xl">
            {/* 顶部按钮 */}
            <div className="flex gap-2 mb-4">
              <div className="w-6 h-6 bg-gray-700 rounded"></div>
              <div className="w-6 h-6 bg-gray-700 rounded"></div>
            </div>

            {/* 大型展示卡片 */}
            <div className="w-full h-36 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl mb-4 flex items-center justify-center">
              <StyledText className="text-3xl">📱</StyledText>
            </div>

            {/* 文字内容 */}
            <div className="space-y-2">
              <div className="w-full h-2.5 bg-gray-700 rounded"></div>
              <div className="w-2/3 h-2.5 bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </Editable>
    </>
  );
};
