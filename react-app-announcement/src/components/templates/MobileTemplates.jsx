import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import StyledText from '../common/StyledText';
import Editable from '../common/Editable';

// 经典模板 - 左文右图
export const ClassicTemplate = ({ appInfo }) => {
  const { state } = useApp();

  return (
    <>
      <Editable path="appInfo.icon" x={380} y={240}>
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-white/20 flex items-center justify-center text-3xl font-bold">
          {appInfo.iconImage ? (
            <img src={appInfo.iconImage} alt="App Icon" className="w-full h-full object-cover" />
          ) : (
            appInfo.icon
          )}
        </div>
      </Editable>

      <Editable path="appInfo.name" x={480} y={265}>
        <StyledText className="text-2xl font-semibold">{appInfo.name}</StyledText>
      </Editable>

      <Editable path="appInfo.title" x={380} y={350}>
        <StyledText element="h1" className="text-5xl font-bold leading-tight max-w-lg">{appInfo.title}</StyledText>
      </Editable>

      <Editable path="appInfo.subtitle" x={380} y={460}>
        <StyledText element="p" className="text-xl leading-loose max-w-md opacity-90">{appInfo.subtitle}</StyledText>
      </Editable>

      {/* 下载按钮 */}
      {state.downloads.showAppStore && (
        <Editable path="downloads.showAppStore" x={380} y={570}>
          <div className="inline-flex items-center gap-3 px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm cursor-default">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <StyledText className="font-medium text-[17px]">App Store</StyledText>
          </div>
        </Editable>
      )}

      {state.downloads.showGooglePlay && (
        <Editable path="downloads.showGooglePlay" x={580} y={570}>
          <div className="inline-flex items-center gap-3 px-7 py-3.5 bg-white/10 hover:bg-white/20 border border-white/30 rounded-xl transition-all duration-300 backdrop-blur-sm cursor-default">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            <StyledText className="font-medium text-[17px]">Google Play</StyledText>
          </div>
        </Editable>
      )}
    </>
  );
};

// 居中模板
export const CenterTemplate = ({ appInfo }) => {
  const { state } = useApp();
  const centerX = useMemo(() => {
    return typeof window !== 'undefined' ? window.innerWidth / 2 - 32 : 600;
  }, []);

  return (
    <>
      <Editable path="appInfo.icon" x={centerX - 115} y={100}>
        <div className="w-[54px] h-[54px] rounded-[13px] overflow-hidden bg-white/20 flex items-center justify-center text-[22px] font-bold">
          {appInfo.iconImage ? (
            <img src={appInfo.iconImage} alt="App Icon" className="w-full h-full object-cover" />
          ) : (
            appInfo.icon
          )}
        </div>
      </Editable>

      <Editable path="appInfo.name" x={centerX - 42} y={123}>
        <StyledText className="text-base font-semibold">{appInfo.name}</StyledText>
      </Editable>

      <Editable path="appInfo.title" x={centerX - 200} y={155}>
        <StyledText element="h1" className="text-[28px] font-bold leading-tight w-[400px] text-center">{appInfo.title}</StyledText>
      </Editable>

      <Editable path="appInfo.subtitle" x={centerX - 190} y={210}>
        <StyledText element="p" className="text-[15px] leading-relaxed w-[380px] opacity-85 text-center">{appInfo.subtitle}</StyledText>
      </Editable>

      {/* 下载按钮 - 居中 */}
      {state.downloads.showAppStore && (
        <Editable path="downloads.showAppStore" x={centerX - 155} y={265}>
          <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg transition-all duration-300 backdrop-blur-sm cursor-default">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
            </svg>
            <StyledText className="font-medium text-[13px]">App Store</StyledText>
          </div>
        </Editable>
      )}

      {state.downloads.showGooglePlay && (
        <Editable path="downloads.showGooglePlay" x={centerX + 10} y={265}>
          <div className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded-lg transition-all duration-300 backdrop-blur-sm cursor-default">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.5,12.92 20.16,13.19L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" />
            </svg>
            <StyledText className="font-medium text-[13px]">Google Play</StyledText>
          </div>
        </Editable>
      )}
    </>
  );
};

