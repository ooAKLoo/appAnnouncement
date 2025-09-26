import React from 'react';
import StyledText from '../common/StyledText';

// 经典模板 - 左文右图
export const ClassicTemplate = ({ appInfo, alignment }) => {
  const logoAlignment = {
    'left': 'justify-start',
    'center': 'justify-center', 
    'right': 'justify-end'
  }[alignment];

  return (
    <>
      <div className={`flex items-center gap-3 mb-12 ${logoAlignment}`}>
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/20 flex items-center justify-center text-2xl font-bold">
          {appInfo.iconImage ? (
            <img 
              src={appInfo.iconImage} 
              alt="App Icon" 
              className="w-full h-full object-cover"
            />
          ) : (
            appInfo.icon
          )}
        </div>
        <StyledText variant="app-name" template="classic">
          {appInfo.name}
        </StyledText>
      </div>

      <StyledText 
        variant="title" 
        element="h1" 
        template="classic" 
        className="mb-8"
      >
        {appInfo.title}
      </StyledText>

      <StyledText 
        variant="subtitle" 
        element="p" 
        template="classic"
        className="mb-12"
      >
        {appInfo.subtitle}
      </StyledText>
    </>
  );
};

// 居中模板
export const CenterTemplate = ({ appInfo, alignment }) => {
  return (
    <>
      <div className="flex items-center justify-center gap-4 mb-12">
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/20 flex items-center justify-center text-2xl font-bold">
          {appInfo.iconImage ? (
            <img 
              src={appInfo.iconImage} 
              alt="App Icon" 
              className="w-full h-full object-cover"
            />
          ) : (
            appInfo.icon
          )}
        </div>
        <StyledText variant="app-name" template="center">
          {appInfo.name}
        </StyledText>
      </div>

      <StyledText 
        variant="title" 
        element="h1" 
        template="center" 
        className="mb-8"
      >
        {appInfo.title}
      </StyledText>

      <StyledText 
        variant="subtitle" 
        element="p" 
        template="center"
        className="mb-12"
      >
        {appInfo.subtitle}
      </StyledText>
    </>
  );
};

// 简约模板 - 左图右文
export const MinimalTemplate = ({ appInfo, alignment }) => {
  const logoAlignment = {
    'left': 'justify-start',
    'center': 'justify-center', 
    'right': 'justify-end'
  }[alignment];

  return (
    <>
      <div className={`flex items-center gap-3 mb-12 ${logoAlignment}`}>
        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-white/20 flex items-center justify-center text-2xl font-bold">
          {appInfo.iconImage ? (
            <img 
              src={appInfo.iconImage} 
              alt="App Icon" 
              className="w-full h-full object-cover"
            />
          ) : (
            appInfo.icon
          )}
        </div>
        <StyledText variant="app-name" template="minimal">
          {appInfo.name}
        </StyledText>
      </div>

      <StyledText 
        variant="title" 
        element="h1" 
        template="minimal" 
        className="mb-8"
      >
        {appInfo.title}
      </StyledText>

      <StyledText 
        variant="subtitle" 
        element="p" 
        template="minimal"
        className="mb-12"
      >
        {appInfo.subtitle}
      </StyledText>
    </>
  );
};

// 上下布局模板
export const TopBottomTemplate = ({ appInfo }) => (
  <div className="flex items-center gap-6 justify-center">
    <div className="w-20 h-20 rounded-3xl overflow-hidden bg-white/20 flex items-center justify-center text-3xl font-bold flex-shrink-0">
      {appInfo.iconImage ? (
        <img 
          src={appInfo.iconImage} 
          alt="App Icon" 
          className="w-full h-full object-cover"
        />
      ) : (
        appInfo.icon
      )}
    </div>
    
    <div className="flex-1 flex flex-col justify-center min-h-[80px]">
      <StyledText 
        variant="title" 
        element="h1" 
        template="topBottom" 
        className="mb-2"
      >
        {appInfo.title}
      </StyledText>
      <StyledText 
        variant="subtitle" 
        element="p" 
        template="topBottom"
      >
        {appInfo.subtitle}
      </StyledText>
    </div>
    
    <div className="flex items-end h-20">
      <StyledText 
        variant="app-name" 
        template="topBottom"
      >
        {appInfo.name}
      </StyledText>
    </div>
  </div>
);

// 对角线模板
export const DiagonalTemplate = ({ appInfo, features, contentSections, alignment }) => {
  const iconAlignment = {
    'left': 'justify-start',
    'center': 'justify-center', 
    'right': 'justify-end'
  }[alignment];

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-8">
        <div className={`flex items-end gap-4 mb-8 ${iconAlignment}`}>
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-white/20 flex items-center justify-center text-lg font-bold flex-shrink-0">
            {appInfo.iconImage ? (
              <img 
                src={appInfo.iconImage} 
                alt="App Icon" 
                className="w-full h-full object-cover"
              />
            ) : (
              appInfo.icon || '📱'
            )}
          </div>
          <StyledText 
            variant="app-name" 
            template="diagonal"
          >
            {appInfo.name}
          </StyledText>
        </div>

        <StyledText 
          variant="title" 
          element="h1" 
          template="diagonal"
          className="mb-6"
        >
          {appInfo.title}
        </StyledText>

        <StyledText 
          variant="subtitle" 
          element="p" 
          template="diagonal"
          className="mb-8"
        >
          {appInfo.subtitle}
        </StyledText>

        {contentSections.features && features.length > 0 && (
          <div className="space-y-4 text-lg opacity-90 mt-10">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <StyledText variant="text" className="mt-1">•</StyledText>
                <StyledText variant="text">{feature.title}</StyledText>
              </div>
            ))}
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
};

