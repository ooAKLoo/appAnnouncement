import React from 'react';
import StyledText from '../common/StyledText';
import EditableWrapper from '../EditableWrapper';

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

      <EditableWrapper
        elementType="title"
        elementId="app-title"
        elementPath="appInfo.title"
        className="mb-8"
      >
        <StyledText 
          variant="title" 
          element="h1" 
          template="classic"
        >
          {appInfo.title}
        </StyledText>
      </EditableWrapper>

      <EditableWrapper
        elementType="subtitle"
        elementId="app-subtitle"
        elementPath="appInfo.subtitle"
        className="mb-12"
      >
        <StyledText 
          variant="subtitle" 
          element="p" 
          template="classic"
        >
          {appInfo.subtitle}
        </StyledText>
      </EditableWrapper>
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

      <EditableWrapper
        elementType="title"
        elementId="app-title-center"
        elementPath="appInfo.title"
        className="mb-8"
      >
        <StyledText 
          variant="title" 
          element="h1" 
          template="center"
        >
          {appInfo.title}
        </StyledText>
      </EditableWrapper>

      <EditableWrapper
        elementType="subtitle"
        elementId="app-subtitle-center"
        elementPath="appInfo.subtitle"
        className="mb-12"
      >
        <StyledText 
          variant="subtitle" 
          element="p" 
          template="center"
        >
          {appInfo.subtitle}
        </StyledText>
      </EditableWrapper>
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

      <EditableWrapper
        elementType="title"
        elementId="app-title-minimal"
        elementPath="appInfo.title"
        className="mb-8"
      >
        <StyledText 
          variant="title" 
          element="h1" 
          template="minimal"
        >
          {appInfo.title}
        </StyledText>
      </EditableWrapper>

      <EditableWrapper
        elementType="subtitle"
        elementId="app-subtitle-minimal"
        elementPath="appInfo.subtitle"
        className="mb-12"
      >
        <StyledText 
          variant="subtitle" 
          element="p" 
          template="minimal"
        >
          {appInfo.subtitle}
        </StyledText>
      </EditableWrapper>
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
      <EditableWrapper
        elementType="title"
        elementId="app-title-topbottom"
        elementPath="appInfo.title"
        className="mb-2"
      >
        <StyledText 
          variant="title" 
          element="h1" 
          template="topBottom"
        >
          {appInfo.title}
        </StyledText>
      </EditableWrapper>
      <EditableWrapper
        elementType="subtitle"
        elementId="app-subtitle-topbottom"
        elementPath="appInfo.subtitle"
      >
        <StyledText 
          variant="subtitle" 
          element="p" 
          template="topBottom"
        >
          {appInfo.subtitle}
        </StyledText>
      </EditableWrapper>
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

        <EditableWrapper
          elementType="title"
          elementId="app-title-diagonal"
          elementPath="appInfo.title"
          className="mb-6"
        >
          <StyledText 
            variant="title" 
            element="h1" 
            template="diagonal"
          >
            {appInfo.title}
          </StyledText>
        </EditableWrapper>

        <EditableWrapper
          elementType="subtitle"
          elementId="app-subtitle-diagonal"
          elementPath="appInfo.subtitle"
          className="mb-8"
        >
          <StyledText 
            variant="subtitle" 
            element="p" 
            template="diagonal"
          >
            {appInfo.subtitle}
          </StyledText>
        </EditableWrapper>

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

