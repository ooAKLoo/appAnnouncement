import React from 'react';
import StyledText from '../common/StyledText';

export const DefaultTemplate = ({ appInfo, alignment }) => {
  const logoAlignment = {
    'left': 'justify-start',
    'center': 'justify-center', 
    'right': 'justify-end'
  }[alignment];

  return (
    <>
      {/* Logo + App Name */}
      <div className={`flex items-center gap-3 mb-8 ${logoAlignment}`}>
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
        <StyledText variant="app-name" template="default">
          {appInfo.name}
        </StyledText>
      </div>

      {/* Title */}
      <StyledText 
        variant="title" 
        element="h1" 
        template="default" 
        className="mb-6"
      >
        {appInfo.title}
      </StyledText>

      {/* Subtitle */}
      <StyledText 
        variant="subtitle" 
        element="p" 
        template="default"
      >
        {appInfo.subtitle}
      </StyledText>
    </>
  );
};

export const MinimalTemplate = ({ appInfo, alignment }) => {
  const logoAlignment = {
    'left': 'justify-start',
    'center': 'justify-center', 
    'right': 'justify-end'
  }[alignment];

  return (
    <>
      {/* Minimal layout with smaller logo */}
      <div className={`flex items-center gap-3 mb-6 ${logoAlignment}`}>
        <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/20 flex items-center justify-center text-lg font-bold">
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
        className="mb-4"
      >
        {appInfo.title}
      </StyledText>

      <StyledText 
        variant="subtitle" 
        element="p" 
        template="minimal"
      >
        {appInfo.subtitle}
      </StyledText>
    </>
  );
};