import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import StyledText from '../common/StyledText';
import Editable from '../common/Editable';

// 经典模板 - 左文右图
export const ClassicTemplate = ({ appInfo }) => {
  const { state } = useApp();

  return (
    <>
      <Editable path="appInfo.icon" x={100} y={100}>
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/20 flex items-center justify-center text-2xl font-bold">
          {appInfo.iconImage ? (
            <img src={appInfo.iconImage} alt="App Icon" className="w-full h-full object-cover" />
          ) : (
            appInfo.icon
          )}
        </div>
      </Editable>

      <Editable path="appInfo.name" x={180} y={115}>
        <StyledText className="text-xl font-semibold">{appInfo.name}</StyledText>
      </Editable>

      <Editable path="appInfo.title" x={100} y={200}>
        <StyledText element="h1" className="text-4xl font-bold leading-normal">{appInfo.title}</StyledText>
      </Editable>

      <Editable path="appInfo.subtitle" x={100} y={320}>
        <StyledText element="p" className="text-lg leading-loose">{appInfo.subtitle}</StyledText>
      </Editable>

      {/* 下载按钮 */}
      {state.downloads.showAppStore && (
        <Editable path="downloads.showAppStore" x={100} y={450}>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm cursor-default">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <StyledText className="font-medium">App Store</StyledText>
          </div>
        </Editable>
      )}

      {state.downloads.showGooglePlay && (
        <Editable path="downloads.showGooglePlay" x={280} y={450}>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm cursor-default">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            <StyledText className="font-medium">Google Play</StyledText>
          </div>
        </Editable>
      )}
    </>
  );
};

// 居中模板
export const CenterTemplate = ({ appInfo }) => {
  const { state } = useApp();
  // 使用 useMemo 确保 centerX 只计算一次，避免重渲染导致位置跳动
  const centerX = useMemo(() => {
    return typeof window !== 'undefined' ? window.innerWidth / 2 - 32 : 600;
  }, []);

  return (
    <>
      <Editable path="appInfo.icon" x={centerX - 50} y={100}>
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/20 flex items-center justify-center text-2xl font-bold">
          {appInfo.iconImage ? (
            <img src={appInfo.iconImage} alt="App Icon" className="w-full h-full object-cover" />
          ) : (
            appInfo.icon
          )}
        </div>
      </Editable>

      <Editable path="appInfo.name" x={centerX + 30} y={115}>
        <StyledText className="text-xl font-semibold">{appInfo.name}</StyledText>
      </Editable>

      <Editable path="appInfo.title" x={centerX - 200} y={200}>
        <StyledText element="h1" className="text-4xl font-bold leading-normal max-w-md">{appInfo.title}</StyledText>
      </Editable>

      <Editable path="appInfo.subtitle" x={centerX - 200} y={320}>
        <StyledText element="p" className="text-lg leading-loose max-w-md">{appInfo.subtitle}</StyledText>
      </Editable>

      {/* 下载按钮 - 居中 */}
      {state.downloads.showAppStore && (
        <Editable path="downloads.showAppStore" x={centerX - 180} y={450}>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm cursor-default">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <StyledText className="font-medium">App Store</StyledText>
          </div>
        </Editable>
      )}

      {state.downloads.showGooglePlay && (
        <Editable path="downloads.showGooglePlay" x={centerX} y={450}>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm cursor-default">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            <StyledText className="font-medium">Google Play</StyledText>
          </div>
        </Editable>
      )}
    </>
  );
};

// 上下布局模板
export const TopBottomTemplate = ({ appInfo }) => {
  const { state } = useApp();
  // 使用 useMemo 确保 centerX 只计算一次
  const centerX = useMemo(() => {
    return typeof window !== 'undefined' ? window.innerWidth / 2 : 600;
  }, []);

  return (
    <>
      <Editable path="appInfo.icon" x={centerX - 300} y={300}>
        <div className="w-20 h-20 rounded-3xl overflow-hidden bg-white/20 flex items-center justify-center text-3xl font-bold">
          {appInfo.iconImage ? (
            <img src={appInfo.iconImage} alt="App Icon" className="w-full h-full object-cover" />
          ) : (
            appInfo.icon
          )}
        </div>
      </Editable>

      <Editable path="appInfo.title" x={centerX - 200} y={310}>
        <StyledText element="h1" className="text-4xl font-bold leading-normal max-w-md">{appInfo.title}</StyledText>
      </Editable>

      <Editable path="appInfo.subtitle" x={centerX - 200} y={370}>
        <StyledText element="p" className="text-lg leading-loose max-w-md">{appInfo.subtitle}</StyledText>
      </Editable>

      <Editable path="appInfo.name" x={centerX + 200} y={330}>
        <StyledText className="text-xl font-semibold">{appInfo.name}</StyledText>
      </Editable>

      {/* 下载按钮 */}
      {state.downloads.showAppStore && (
        <Editable path="downloads.showAppStore" x={centerX - 180} y={480}>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm cursor-default">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <StyledText className="font-medium">App Store</StyledText>
          </div>
        </Editable>
      )}

      {state.downloads.showGooglePlay && (
        <Editable path="downloads.showGooglePlay" x={centerX} y={480}>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm cursor-default">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            <StyledText className="font-medium">Google Play</StyledText>
          </div>
        </Editable>
      )}
    </>
  );
};

// 对角线模板
export const DiagonalTemplate = ({ appInfo }) => {
  const { state } = useApp();

  return (
    <>
      <Editable path="appInfo.icon" x={100} y={100}>
        <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/20 flex items-center justify-center text-lg font-bold">
          {appInfo.iconImage ? (
            <img src={appInfo.iconImage} alt="App Icon" className="w-full h-full object-cover" />
          ) : (
            appInfo.icon || '📱'
          )}
        </div>
      </Editable>

      <Editable path="appInfo.name" x={180} y={115}>
        <StyledText className="text-xl font-semibold">{appInfo.name}</StyledText>
      </Editable>

      <Editable path="appInfo.title" x={100} y={200}>
        <StyledText element="h1" className="text-4xl font-bold leading-normal">{appInfo.title}</StyledText>
      </Editable>

      <Editable path="appInfo.subtitle" x={100} y={320}>
        <StyledText element="p" className="text-lg leading-loose">{appInfo.subtitle}</StyledText>
      </Editable>

      {/* 下载按钮 */}
      {state.downloads.showAppStore && (
        <Editable path="downloads.showAppStore" x={100} y={450}>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm cursor-default">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <StyledText className="font-medium">App Store</StyledText>
          </div>
        </Editable>
      )}

      {state.downloads.showGooglePlay && (
        <Editable path="downloads.showGooglePlay" x={280} y={450}>
          <div className="inline-flex items-center gap-3 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm cursor-default">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            <StyledText className="font-medium">Google Play</StyledText>
          </div>
        </Editable>
      )}
    </>
  );
};

// Product Hunt 模板1 - 居中图标
export const ProductHuntCenterTemplate = () => {
  const { state } = useApp();
  const productHuntInfo = state.productHuntInfo || {
    badge: 'NOW AVAILABLE',
    name: 'Postory',
    tagline: 'Create your story, share your moments',
    iconImage: '/postory-icon.png'
  };

  // 使用 useMemo 确保 centerX 只计算一次
  const centerX = useMemo(() => {
    return typeof window !== 'undefined' ? window.innerWidth / 2 : 600;
  }, []);

  return (
    <>
      {/* 顶部徽章 */}
      <Editable path="productHuntInfo.badge" x={centerX - 55} y={200}>
        <StyledText className="text-xs font-semibold tracking-widest uppercase opacity-60">
          {productHuntInfo.badge}
        </StyledText>
      </Editable>

      {/* 大图标 */}
      <Editable path="productHuntInfo.iconImage" x={centerX - 80} y={250}>
        <div className="w-40 h-40 rounded-3xl overflow-hidden bg-white/10 flex items-center justify-center">
          {productHuntInfo.iconImage ? (
            <img src={productHuntInfo.iconImage} alt="App Icon" className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl font-bold">{productHuntInfo.name.charAt(0)}</span>
          )}
        </div>
      </Editable>

      {/* 应用名称 */}
      <Editable path="productHuntInfo.name" x={centerX - 60} y={420}>
        <StyledText className="text-3xl font-bold">
          {productHuntInfo.name}
        </StyledText>
      </Editable>

      {/* Tagline */}
      <Editable path="productHuntInfo.tagline" x={centerX - 180} y={480}>
        <StyledText className="text-lg opacity-70 text-center w-[360px]">
          {productHuntInfo.tagline}
        </StyledText>
      </Editable>

      {/* 下载按钮 */}
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

  // 使用 useMemo 确保 centerX 只计算一次
  const centerX = useMemo(() => {
    return typeof window !== 'undefined' ? window.innerWidth / 2 : 600;
  }, []);

  return (
    <>
      {/* 顶部图标 */}
      <Editable path="productHuntInfo.iconImage" x={centerX - 75} y={150}>
        <div className="w-36 h-36 rounded-3xl overflow-hidden bg-white/10 flex items-center justify-center">
          {productHuntInfo.iconImage ? (
            <img src={productHuntInfo.iconImage} alt="App Icon" className="w-full h-full object-cover" />
          ) : (
            <span className="text-6xl font-bold">{productHuntInfo.name.charAt(0)}</span>
          )}
        </div>
      </Editable>

      {/* 应用名称 */}
      <Editable path="productHuntInfo.name" x={centerX - 65} y={330}>
        <StyledText className="text-4xl font-bold">
          {productHuntInfo.name}
        </StyledText>
      </Editable>

      {/* Tagline */}
      <Editable path="productHuntInfo.tagline" x={centerX - 210} y={400}>
        <StyledText className="text-xl opacity-70 text-center w-[420px]">
          {productHuntInfo.tagline}
        </StyledText>
      </Editable>

      {/* Description */}
      <Editable path="productHuntInfo.description" x={centerX - 200} y={460}>
        <StyledText className="text-base opacity-50 text-center w-[400px]">
          {productHuntInfo.description}
        </StyledText>
      </Editable>
    </>
  );
};
