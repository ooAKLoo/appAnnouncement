export const TopBottomHeader = ({ appInfo, getTextColorStyle }) => (
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
      <h1 className="text-3xl font-bold leading-tight mb-2 main-content-title" style={getTextColorStyle()}>
        {appInfo.title}
      </h1>
      <p className="text-lg leading-relaxed main-content-subtitle" style={getTextColorStyle()}>
        {appInfo.subtitle}
      </p>
    </div>
    
    <div className="flex items-end h-20">
      <div className="text-2xl font-semibold main-content-subtitle" style={getTextColorStyle()}>
        {appInfo.name}
      </div>
    </div>
  </div>
);

export const DiagonalHeader = ({ appInfo, features, contentSections, getTextColorStyle, alignment }) => {
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
          <div className="text-xl font-semibold" style={getTextColorStyle()}>
            {appInfo.name}
          </div>
        </div>

        <h1 className="text-5xl md:text-6xl font-black leading-tight main-content-title" style={getTextColorStyle()}>
          {appInfo.title}
        </h1>

        <p className="text-xl leading-relaxed opacity-90 main-content-subtitle" style={getTextColorStyle()}>
          {appInfo.subtitle}
        </p>

        {contentSections.features && features.length > 0 && (
          <div className="space-y-2 text-lg opacity-90 mt-6" style={getTextColorStyle()}>
            {features.map((feature, index) => (
              <div key={index} className="flex items-start gap-2">
                <span>•</span>
                <span>{feature.title}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      <div></div>
    </div>
  );
};

export const FeatureGridHeader = ({ appInfo, getTextColorStyle, alignment }) => {
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
        <div className="text-xl font-semibold main-content-subtitle" style={getTextColorStyle()}>
          {appInfo.name}
        </div>
      </div>

      <h1 className="text-4xl font-bold leading-tight mb-8 main-content-title" style={getTextColorStyle()}>
        {appInfo.title}
      </h1>

      <p className="text-lg leading-relaxed mb-12 main-content-subtitle" style={getTextColorStyle()}>
        {appInfo.subtitle}
      </p>
    </>
  );
};