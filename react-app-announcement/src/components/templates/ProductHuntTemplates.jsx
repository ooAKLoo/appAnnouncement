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

// 图3: 开发者文档页 - Klavis AI Strata 模板
export const KlavisStrataTemplate = () => {
  const { state } = useApp();
  const centerX = useMemo(() => {
    return typeof window !== 'undefined' ? window.innerWidth / 2 : 600;
  }, []);

  return (
    <>
      {/* Logo */}
      <Editable path="productHuntInfo.logo" x={100} y={80}>
        <StyledText className="text-2xl font-bold">K</StyledText>
      </Editable>

      {/* 品牌名 */}
      <Editable path="productHuntInfo.brand" x={centerX + 160} y={80}>
        <StyledText className="text-xl font-semibold">Klavis AI</StyledText>
      </Editable>

      {/* 主标题 */}
      <Editable path="productHuntInfo.title" x={centerX - 200} y={140}>
        <StyledText className="text-3xl font-bold text-center w-[400px]">
          Built for Developers
        </StyledText>
      </Editable>

      {/* 副标题 */}
      <Editable path="productHuntInfo.subtitle" x={centerX - 180} y={190}>
        <StyledText className="text-lg opacity-70 text-center w-[360px]">
          Fast, simple, and powerful API
        </StyledText>
      </Editable>

      {/* Tab 标签页 */}
      <Editable path="productHuntInfo.tabs" x={centerX - 240} y={250}>
        <div className="w-[480px] border-b border-white/10">
          <div className="flex gap-6 px-4">
            <div className="pb-3 border-b-2 border-transparent opacity-50">
              <StyledText className="text-sm">Curl</StyledText>
            </div>
            <div className="pb-3 border-b-2 border-blue-500">
              <StyledText className="text-sm font-semibold">Python</StyledText>
            </div>
            <div className="pb-3 border-b-2 border-transparent opacity-50">
              <StyledText className="text-sm">TypeScript</StyledText>
            </div>
          </div>
        </div>
      </Editable>

      {/* 代码展示区域 (8-10行代码) */}
      <Editable path="productHuntInfo.codeBlock" x={centerX - 240} y={305}>
        <div className="w-[480px] h-[240px] bg-gray-900/70 border border-white/20 rounded-b-xl p-6 font-mono text-sm leading-relaxed">
          <div className="space-y-1">
            <div><StyledText className="text-green-400">from</StyledText><StyledText className="text-white"> klavis </StyledText><StyledText className="text-green-400">import</StyledText><StyledText className="text-white"> Client</StyledText></div>
            <div><StyledText className="text-white opacity-0">_</StyledText></div>
            <div><StyledText className="text-purple-400">client</StyledText><StyledText className="text-white"> = Client(</StyledText><StyledText className="text-yellow-400">api_key</StyledText><StyledText className="text-white">=</StyledText><StyledText className="text-orange-300">"your-key"</StyledText><StyledText className="text-white">)</StyledText></div>
            <div><StyledText className="text-white opacity-0">_</StyledText></div>
            <div><StyledText className="text-purple-400">response</StyledText><StyledText className="text-white"> = client.generate(</StyledText></div>
            <div><StyledText className="text-white">    </StyledText><StyledText className="text-yellow-400">prompt</StyledText><StyledText className="text-white">=</StyledText><StyledText className="text-orange-300">"Hello world"</StyledText><StyledText className="text-white">,</StyledText></div>
            <div><StyledText className="text-white">    </StyledText><StyledText className="text-yellow-400">model</StyledText><StyledText className="text-white">=</StyledText><StyledText className="text-orange-300">"strata-v1"</StyledText></div>
            <div><StyledText className="text-white">)</StyledText></div>
          </div>
        </div>
      </Editable>
    </>
  );
};

// 图4: 营销平台主页 - Influencer Marketing 模板
export const InfluencerMarketingTemplate = () => {
  const centerX = useMemo(() => {
    return typeof window !== 'undefined' ? window.innerWidth / 2 : 600;
  }, []);

  return (
    <>
      {/* 左侧卡片 - 数据展示 */}
      <Editable path="productHuntInfo.leftCard" x={100} y={180}>
        <div className="w-[160px] h-[220px] bg-white/10 border border-white/20 rounded-2xl p-5">
          <StyledText className="text-xs font-semibold opacity-70 mb-3">Performance</StyledText>
          <StyledText className="text-3xl font-bold mb-1">85%</StyledText>
          <StyledText className="text-xs opacity-50 mb-6">Conversion Rate</StyledText>

          {/* 头像组 */}
          <div className="flex -space-x-2 mt-auto">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full border-2 border-gray-900"></div>
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full border-2 border-gray-900"></div>
            <div className="w-8 h-8 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full border-2 border-gray-900"></div>
          </div>
        </div>
      </Editable>

      {/* 中心区域 - 主标题 (2行) */}
      <Editable path="productHuntInfo.centerTitle" x={centerX - 140} y={120}>
        <StyledText className="text-3xl font-bold text-center w-[280px] leading-tight">
          AI-Powered Influencer Marketing
        </StyledText>
      </Editable>

      {/* 中心区域 - Logo */}
      <Editable path="productHuntInfo.centerLogo" x={centerX - 40} y={200}>
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
          <StyledText className="text-3xl">🚀</StyledText>
        </div>
      </Editable>

      {/* 中心区域 - 功能卡片 */}
      <Editable path="productHuntInfo.centerCard" x={centerX - 100} y={300}>
        <div className="w-[200px] h-[100px] bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/30 rounded-2xl p-4">
          <StyledText className="text-lg font-semibold">Outreach</StyledText>
          <StyledText className="text-xs opacity-60 mt-1">Send campaigns in bulk</StyledText>
        </div>
      </Editable>

      {/* 右侧卡片 - 头像组 */}
      <Editable path="productHuntInfo.rightCard" x={centerX + 140} y={180}>
        <div className="w-[160px] h-[220px] bg-white/10 border border-white/20 rounded-2xl p-5">
          {/* 头像组 */}
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full"></div>
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-full"></div>
            <div className="w-10 h-10 bg-gradient-to-br from-red-400 to-pink-500 rounded-full"></div>
          </div>

          {/* 功能按钮 */}
          <div className="space-y-2">
            <div className="w-full h-8 bg-white/10 rounded-lg flex items-center px-3">
              <StyledText className="text-xs">Search</StyledText>
            </div>
            <div className="w-full h-8 bg-white/10 rounded-lg flex items-center px-3">
              <StyledText className="text-xs">Filter</StyledText>
            </div>
          </div>
        </div>
      </Editable>

      {/* 社交媒体图标组 */}
      <Editable path="productHuntInfo.socialIcons" x={centerX - 80} y={430}>
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-blue-500/30 rounded-full flex items-center justify-center border border-blue-400/50">
            <StyledText className="text-xs">in</StyledText>
          </div>
          <div className="w-10 h-10 bg-pink-500/30 rounded-full flex items-center justify-center border border-pink-400/50">
            <StyledText className="text-xs">ig</StyledText>
          </div>
          <div className="w-10 h-10 bg-purple-500/30 rounded-full flex items-center justify-center border border-purple-400/50">
            <StyledText className="text-xs">tw</StyledText>
          </div>
          <div className="w-10 h-10 bg-red-500/30 rounded-full flex items-center justify-center border border-red-400/50">
            <StyledText className="text-xs">yt</StyledText>
          </div>
        </div>
      </Editable>
    </>
  );
};

// 图5: 团队介绍页 - Scrumball 模板
export const ScrumballTemplate = () => {
  const centerX = useMemo(() => {
    return typeof window !== 'undefined' ? window.innerWidth / 2 : 600;
  }, []);

  return (
    <>
      {/* APP Name */}
      <Editable path="productHuntInfo.appName" x={centerX - 80} y={80}>
        <StyledText className="text-2xl font-bold">Scrumball</StyledText>
      </Editable>

      {/* 主标题 (2行) */}
      <Editable path="productHuntInfo.title" x={centerX - 160} y={130}>
        <StyledText className="text-3xl font-bold text-center w-[320px] leading-tight">
          Meet Your 24/7 AI Team
        </StyledText>
      </Editable>

      {/* 卡片1 - 角色 + 头像 */}
      <Editable path="productHuntInfo.card1" x={110} y={230}>
        <div className="w-[140px] h-[180px] bg-gradient-to-br from-blue-500/20 to-blue-600/30 border border-white/30 rounded-2xl p-4 flex flex-col items-center">
          <StyledText className="text-xs font-semibold opacity-70 mb-4">Role</StyledText>

          {/* 头像 */}
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full mb-3 flex items-center justify-center">
            <StyledText className="text-2xl">📊</StyledText>
          </div>

          <StyledText className="text-sm font-semibold text-center">Brand Strategist</StyledText>
        </div>
      </Editable>

      {/* 卡片2 - 角色 + 头像 */}
      <Editable path="productHuntInfo.card2" x={centerX - 70} y={230}>
        <div className="w-[140px] h-[180px] bg-gradient-to-br from-purple-500/20 to-purple-600/30 border border-white/30 rounded-2xl p-4 flex flex-col items-center">
          <StyledText className="text-xs font-semibold opacity-70 mb-4">Role</StyledText>

          {/* 头像 */}
          <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full mb-3 flex items-center justify-center">
            <StyledText className="text-2xl">🎯</StyledText>
          </div>

          <StyledText className="text-sm font-semibold text-center">Creator Scout</StyledText>
        </div>
      </Editable>

      {/* 卡片3 - 角色 + 头像 */}
      <Editable path="productHuntInfo.card3" x={centerX + 110} y={230}>
        <div className="w-[140px] h-[180px] bg-gradient-to-br from-pink-500/20 to-pink-600/30 border border-white/30 rounded-2xl p-4 flex flex-col items-center">
          <StyledText className="text-xs font-semibold opacity-70 mb-4">Role</StyledText>

          {/* 头像 */}
          <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mb-3 flex items-center justify-center">
            <StyledText className="text-2xl">✉️</StyledText>
          </div>

          <StyledText className="text-sm font-semibold text-center">Outreach Expert</StyledText>
        </div>
      </Editable>
    </>
  );
};

// 图6: 音频工具页 - Voice AI 模板
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

// 图7: 产品启动页 - Speak. Create. Launch 模板
export const SpeakCreateLaunchTemplate = () => {
  const centerX = useMemo(() => {
    return typeof window !== 'undefined' ? window.innerWidth / 2 : 600;
  }, []);

  return (
    <>
      {/* 主标题 (2行) */}
      <Editable path="productHuntInfo.title" x={centerX - 180} y={80}>
        <StyledText className="text-4xl font-bold text-center w-[360px] leading-tight">
          Speak. Create.
          <br />Launch.
        </StyledText>
      </Editable>

      {/* 描述文字 (2行) */}
      <Editable path="productHuntInfo.description" x={centerX - 200} y={160}>
        <StyledText className="text-base opacity-70 text-center w-[400px] leading-relaxed">
          AI-powered content creation platform.
          Turn your ideas into reality in seconds.
        </StyledText>
      </Editable>

      {/* CTA 按钮 */}
      <Editable path="productHuntInfo.ctaButton" x={centerX - 85} y={220}>
        <div className="px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full cursor-pointer hover:scale-105 transition-transform shadow-lg">
          <StyledText className="font-semibold">Start Free Trial</StyledText>
        </div>
      </Editable>

      {/* 播放器界面 */}
      <Editable path="productHuntInfo.playerInterface" x={120} y={300}>
        <div className="w-[220px] h-[180px] bg-gray-900/60 border border-white/20 rounded-2xl p-5 shadow-xl">
          <StyledText className="text-xs font-semibold mb-4 opacity-70">Audio Player</StyledText>

          {/* 波形 */}
          <div className="flex items-end gap-0.5 h-12 mb-4">
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="flex-1 bg-gradient-to-t from-pink-500 to-purple-500 rounded-sm"
                style={{ height: `${30 + Math.random() * 70}%` }}
              ></div>
            ))}
          </div>

          {/* 控制栏 */}
          <div className="w-full h-1 bg-white/10 rounded-full mb-3">
            <div className="w-1/3 h-full bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
          </div>

          <div className="flex gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-500 rounded-full flex items-center justify-center">
              <StyledText className="text-xs">▶</StyledText>
            </div>
            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
              <StyledText className="text-xs">⏸</StyledText>
            </div>
          </div>
        </div>
      </Editable>

      {/* 设置面板 */}
      <Editable path="productHuntInfo.settingsPanel" x={centerX + 80} y={300}>
        <div className="w-[220px] h-[180px] bg-gray-900/60 border border-white/20 rounded-2xl p-5 shadow-xl">
          <StyledText className="text-xs font-semibold mb-4 opacity-70">Settings</StyledText>

          {/* 选项组 */}
          <div className="space-y-3">
            <div className="w-full h-10 bg-white/10 rounded-lg flex items-center px-3">
              <StyledText className="text-xs">Voice Type</StyledText>
            </div>
            <div className="w-full h-10 bg-white/10 rounded-lg flex items-center px-3">
              <StyledText className="text-xs">Language</StyledText>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 h-9 bg-purple-500/30 rounded-lg flex items-center justify-center border border-purple-400/50">
                <StyledText className="text-xs font-semibold">Save</StyledText>
              </div>
              <div className="flex-1 h-9 bg-pink-500/30 rounded-lg flex items-center justify-center border border-pink-400/50">
                <StyledText className="text-xs font-semibold">Export</StyledText>
              </div>
            </div>
          </div>
        </div>
      </Editable>
    </>
  );
};

// 图8: 网络平台落地页 - Palify 模板
export const PalifyTemplate = () => {
  const centerX = useMemo(() => {
    return typeof window !== 'undefined' ? window.innerWidth / 2 : 600;
  }, []);

  return (
    <>
      {/* 欢迎文字 (1行) */}
      <Editable path="productHuntInfo.welcome" x={centerX - 100} y={80}>
        <StyledText className="text-sm opacity-60 text-center w-[200px]">
          Welcome to Palify
        </StyledText>
      </Editable>

      {/* 主标题 (2行) */}
      <Editable path="productHuntInfo.title" x={centerX - 180} y={120}>
        <StyledText className="text-3xl font-bold text-center w-[360px] leading-tight">
          Your All-in-One
          <br />Platform
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

// 图1: 短视频应用落地页 - Clips 模板
export const ClipsTemplate = () => {
  const centerX = useMemo(() => {
    return typeof window !== 'undefined' ? window.innerWidth / 2 : 600;
  }, []);

  return (
    <>
      {/* Logo 区域 */}
      <Editable path="productHuntInfo.logo" x={centerX - 40} y={60}>
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
          <StyledText className="text-2xl font-bold">C</StyledText>
        </div>
      </Editable>

      {/* 主标题 */}
      <Editable path="productHuntInfo.title" x={centerX - 200} y={150}>
        <StyledText className="text-4xl font-bold text-center w-[400px]">
          Capture Every Moment
        </StyledText>
      </Editable>

      {/* 副标题 */}
      <Editable path="productHuntInfo.subtitle" x={centerX - 180} y={210}>
        <StyledText className="text-lg opacity-70 text-center w-[360px]">
          Create stunning short videos
        </StyledText>
      </Editable>

      {/* 描述文字 */}
      <Editable path="productHuntInfo.description" x={centerX - 220} y={260}>
        <StyledText className="text-sm opacity-60 text-center w-[440px] leading-relaxed">
          Transform your ideas into beautiful stories with AI-powered editing tools.
          Share your creativity with the world in just a few taps.
        </StyledText>
      </Editable>

      {/* 手机图片 1 */}
      <Editable path="productHuntInfo.phone1" x={120} y={340}>
        <div className="w-[140px] h-[240px] bg-gradient-to-br from-purple-500/30 to-blue-500/20 border border-white/30 rounded-3xl p-3 shadow-2xl">
          <div className="w-full h-full bg-white/10 rounded-2xl flex items-center justify-center">
            <StyledText className="text-xs opacity-50">Video 1</StyledText>
          </div>
        </div>
      </Editable>

      {/* 手机图片 2 */}
      <Editable path="productHuntInfo.phone2" x={centerX - 70} y={340}>
        <div className="w-[140px] h-[240px] bg-gradient-to-br from-pink-500/30 to-purple-500/20 border border-white/30 rounded-3xl p-3 shadow-2xl">
          <div className="w-full h-full bg-white/10 rounded-2xl flex items-center justify-center">
            <StyledText className="text-xs opacity-50">Video 2</StyledText>
          </div>
        </div>
      </Editable>

      {/* 手机图片 3 */}
      <Editable path="productHuntInfo.phone3" x={centerX + 120} y={340}>
        <div className="w-[140px] h-[240px] bg-gradient-to-br from-blue-500/30 to-green-500/20 border border-white/30 rounded-3xl p-3 shadow-2xl">
          <div className="w-full h-full bg-white/10 rounded-2xl flex items-center justify-center">
            <StyledText className="text-xs opacity-50">Video 3</StyledText>
          </div>
        </div>
      </Editable>
    </>
  );
};
