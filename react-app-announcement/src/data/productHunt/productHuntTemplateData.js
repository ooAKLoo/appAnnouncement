/**
 * Product Hunt 模板数据配置
 */

// 生成唯一ID
const generateId = () => Date.now() + Math.random();

// 获取窗口中心点
const getCenterX = () => {
  return typeof window !== 'undefined' ? window.innerWidth / 2 : 600;
};

/**
 * Product Hunt 居中模板
 */
export const productHuntCenterTemplate = (appInfo, productHuntInfo, downloads) => {
  const centerX = getCenterX();

  return [
    {
      id: generateId(),
      type: 'text',
      content: productHuntInfo.badge,
      dataPath: 'productHuntInfo.badge',
      position: { x: centerX - 55, y: 200 },
      styles: {
        fontSize: '12px',
        fontWeight: '600',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        opacity: '0.6'
      }
    },
    {
      id: generateId(),
      type: 'icon',
      content: appInfo.iconImage || appInfo.icon,
      dataPath: 'appInfo.iconImage',
      position: { x: centerX - 80, y: 250 },
      styles: {
        width: '160px',
        height: '160px',
        borderRadius: '24px',
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '60px',
        fontWeight: 'bold'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: appInfo.name,
      dataPath: 'appInfo.name',
      position: { x: centerX - 60, y: 420 },
      styles: {
        fontSize: '30px',
        fontWeight: 'bold'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: productHuntInfo.tagline,
      dataPath: 'productHuntInfo.tagline',
      position: { x: centerX - 180, y: 480 },
      styles: {
        fontSize: '18px',
        opacity: '0.7',
        textAlign: 'center',
        width: '360px'
      }
    },
    ...(downloads.showAppStore ? [{
      id: generateId(),
      type: 'button',
      content: 'App Store',
      icon: 'appstore',
      dataPath: 'downloads.showAppStore',
      position: { x: centerX - 85, y: 560 },
      styles: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '12px 24px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '12px',
        fontSize: '16px',
        fontWeight: '500'
      }
    }] : [])
  ];
};

/**
 * Product Hunt 简约模板
 */
export const productHuntTopTemplate = (appInfo, productHuntInfo) => {
  const centerX = getCenterX();

  return [
    {
      id: generateId(),
      type: 'icon',
      content: appInfo.iconImage || appInfo.icon,
      dataPath: 'appInfo.iconImage',
      position: { x: centerX - 75, y: 150 },
      styles: {
        width: '144px',
        height: '144px',
        borderRadius: '24px',
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '60px',
        fontWeight: 'bold'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: appInfo.name,
      dataPath: 'appInfo.name',
      position: { x: centerX - 65, y: 330 },
      styles: {
        fontSize: '36px',
        fontWeight: 'bold'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: productHuntInfo.tagline,
      dataPath: 'productHuntInfo.tagline',
      position: { x: centerX - 210, y: 400 },
      styles: {
        fontSize: '20px',
        opacity: '0.7',
        textAlign: 'center',
        width: '420px'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: productHuntInfo.description,
      dataPath: 'productHuntInfo.description',
      position: { x: centerX - 200, y: 460 },
      styles: {
        fontSize: '16px',
        opacity: '0.5',
        textAlign: 'center',
        width: '400px'
      }
    }
  ];
};

/**
 * Voice AI 音频播放器模板
 */
export const voiceAITemplate = (appInfo, productHuntInfo, downloads, state) => {
  const centerX = getCenterX();

  return [
    {
      id: generateId(),
      type: 'text',
      content: 'Your Voice,',
      dataPath: 'productHuntInfo.title',
      position: { x: 569, y: 291 },
      styles: {
        fontSize: '36px',
        fontWeight: '700',
        textAlign: 'center',
        width: '500px'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: 'Supercharged by AI',
      position: { x: 651, y: 326 },
      styles: {
        fontSize: '38px',
        fontWeight: '700',
        color: '#000000',
        backgroundColor: 'transparent',
        padding: '8px',
        borderRadius: '4px'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: 'Instant audio transformation powered by AI',
      dataPath: 'productHuntInfo.subtitle',
      position: { x: 626, y: 405 },
      styles: {
        fontSize: '15px',
        opacity: '0.7',
        textAlign: 'center',
        width: '400px'
      }
    },
    {
      id: generateId(),
      type: 'image',
      content: state?.screenImage || '/postory-voice-ai-default.png',
      dataPath: 'screenImage',
      position: { x: 578, y: 453 },
      styles: {
        width: '513px',
        overflow: 'hidden'
      }
    }
  ];
};

/**
 * Palify 设备对比模板 - 参考设计稿样式
 */
export const palifyTemplate = (appInfo, productHuntInfo) => {
  const centerX = getCenterX();

  return [
    // 装饰性背景图片 1 (右上角旋转)
    {
      id: generateId(),
      type: 'image',
      content: productHuntInfo.iconImage || appInfo.iconImage || '/postory-icon.png',
      position: { x: 998, y: 299 },
      styles: {
        width: '400px',
        transform: 'rotate(42.35deg)',
        objectFit: 'contain',
        pointerEvents: 'none',
        overflow: 'hidden'
      }
    },
    // 装饰性背景图片 2 (左下角旋转)
    {
      id: generateId(),
      type: 'image',
      content: productHuntInfo.iconImage || appInfo.iconImage || '/postory-icon.png',
      position: { x: 595, y: 487 },
      styles: {
        width: '350px',
        transform: 'rotate(42.35deg)',
        objectFit: 'contain',
        pointerEvents: 'none',
        overflow: 'hidden'
      }
    },
    // 标题 - Welcome to Palify
    {
      id: generateId(),
      type: 'text',
      content: 'Welcome to Palify',
      dataPath: 'productHuntInfo.welcome',
      position: { x: 486, y: 158 },
      styles: {
        fontFamily: 'Inter, sans-serif',
        fontStyle: 'normal',
        fontWeight: '300',
        fontSize: '31px',
        lineHeight: '1.2',
        color: '#000000'
      }
    },
    // 副标题 - Your All-in-One Professional Networking & Growth Platform
    {
      id: generateId(),
      type: 'text',
      content: 'Your All-in-One Professional Networking & Growth Platform',
      dataPath: 'productHuntInfo.tagline',
      position: { x: 478, y: 235 },
      styles: {
        fontFamily: 'Inter, sans-serif',
        fontStyle: 'normal',
        fontWeight: '700',
        fontSize: '33px',
        lineHeight: '1.2',
        color: '#000000',
        width: '600px'
      }
    }
  ];
};
