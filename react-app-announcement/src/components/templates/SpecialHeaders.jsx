import React from 'react';
import StyledText from '../common/StyledText';
import { textStyleManager } from '../../utils/styleManager';

export const TopBottomHeader = ({ appInfo }) => (
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

export const DiagonalHeader = ({ appInfo, features, contentSections, alignment }) => {
  const iconAlignment = {
    'left': 'justify-start',
    'center': 'justify-center', 
    'right': 'justify-end'
  }[alignment];

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="space-y-4">
        <div className={`flex items-end gap-3 ${iconAlignment}`}>
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/20 flex items-center justify-center text-lg font-bold flex-shrink-0">
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
        >
          {appInfo.title}
        </StyledText>

        <StyledText 
          variant="subtitle" 
          element="p" 
          template="diagonal"
        >
          {appInfo.subtitle}
        </StyledText>

        {contentSections.features && features.length > 0 && (
          <div className="space-y-2 text-lg opacity-90 mt-6">
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <StyledText variant="text">•</StyledText>
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

export const FeatureGridHeader = ({ appInfo, alignment }) => {
  const logoAlignment = {
    'left': 'justify-start',
    'center': 'justify-center', 
    'right': 'justify-end'
  }[alignment];

  return (
    <>
      <div className={`flex items-center justify-center gap-4 mb-8 ${logoAlignment}`}>
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
        <StyledText 
          variant="app-name" 
          template="featureGrid"
        >
          {appInfo.name}
        </StyledText>
      </div>

      <StyledText 
        variant="title" 
        element="h1" 
        template="featureGrid"
      >
        {appInfo.title}
      </StyledText>

      <StyledText 
        variant="subtitle" 
        element="p" 
        template="featureGrid"
      >
        {appInfo.subtitle}
      </StyledText>
    </>
  );
};