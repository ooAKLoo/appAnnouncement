/**
 * 手机/桌面模板数据配置
 */

// 生成唯一ID
const generateId = () => Date.now() + Math.random();

// 获取窗口中心点
const getCenterX = () => {
  return typeof window !== 'undefined' ? window.innerWidth / 2 : 600;
};

/**
 * 左文右图模板
 */
export const classicTemplate = (appInfo, downloads) => {
  return [
    {
      id: generateId(),
      type: 'icon',
      content: appInfo.iconImage || appInfo.icon,
      dataPath: 'appInfo.iconImage',
      position: { x: 100, y: 100 },
      styles: {
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 'bold'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: appInfo.name,
      dataPath: 'appInfo.name',
      position: { x: 180, y: 115 },
      styles: {
        fontSize: '20px',
        fontWeight: '600'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: appInfo.title,
      dataPath: 'appInfo.title',
      position: { x: 100, y: 200 },
      styles: {
        fontSize: '36px',
        fontWeight: 'bold',
        lineHeight: 'normal'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: appInfo.subtitle,
      dataPath: 'appInfo.subtitle',
      position: { x: 100, y: 320 },
      styles: {
        fontSize: '18px',
        lineHeight: '1.8'
      }
    },
    ...(downloads.showAppStore ? [{
      id: generateId(),
      type: 'button',
      content: 'App Store',
      icon: 'appstore',
      dataPath: 'downloads.showAppStore',
      position: { x: 100, y: 450 },
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
    }] : []),
    ...(downloads.showGooglePlay ? [{
      id: generateId(),
      type: 'button',
      content: 'Google Play',
      icon: 'googleplay',
      dataPath: 'downloads.showGooglePlay',
      position: { x: 280, y: 450 },
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
 * 居中布局模板
 */
export const centerTemplate = (appInfo, downloads) => {
  const centerX = getCenterX();

  return [
    {
      id: generateId(),
      type: 'icon',
      content: appInfo.iconImage || appInfo.icon,
      dataPath: 'appInfo.iconImage',
      position: { x: centerX - 50, y: 100 },
      styles: {
        width: '64px',
        height: '64px',
        borderRadius: '16px',
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '24px',
        fontWeight: 'bold'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: appInfo.name,
      dataPath: 'appInfo.name',
      position: { x: centerX + 30, y: 115 },
      styles: {
        fontSize: '20px',
        fontWeight: '600'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: appInfo.title,
      dataPath: 'appInfo.title',
      position: { x: centerX - 200, y: 200 },
      styles: {
        fontSize: '36px',
        fontWeight: 'bold',
        lineHeight: 'normal',
        maxWidth: '400px'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: appInfo.subtitle,
      dataPath: 'appInfo.subtitle',
      position: { x: centerX - 200, y: 320 },
      styles: {
        fontSize: '18px',
        lineHeight: '1.8',
        maxWidth: '400px'
      }
    },
    ...(downloads.showAppStore ? [{
      id: generateId(),
      type: 'button',
      content: 'App Store',
      icon: 'appstore',
      dataPath: 'downloads.showAppStore',
      position: { x: centerX - 180, y: 450 },
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
    }] : []),
    ...(downloads.showGooglePlay ? [{
      id: generateId(),
      type: 'button',
      content: 'Google Play',
      icon: 'googleplay',
      dataPath: 'downloads.showGooglePlay',
      position: { x: centerX, y: 450 },
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
 * 上图下文模板
 */
export const topBottomTemplate = (appInfo, downloads) => {
  const centerX = getCenterX();

  return [
    {
      id: generateId(),
      type: 'icon',
      content: appInfo.iconImage || appInfo.icon,
      dataPath: 'appInfo.iconImage',
      position: { x: centerX - 300, y: 300 },
      styles: {
        width: '80px',
        height: '80px',
        borderRadius: '24px',
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '30px',
        fontWeight: 'bold'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: appInfo.title,
      dataPath: 'appInfo.title',
      position: { x: centerX - 200, y: 310 },
      styles: {
        fontSize: '36px',
        fontWeight: 'bold',
        lineHeight: 'normal',
        maxWidth: '400px'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: appInfo.subtitle,
      dataPath: 'appInfo.subtitle',
      position: { x: centerX - 200, y: 370 },
      styles: {
        fontSize: '18px',
        lineHeight: '1.8',
        maxWidth: '400px'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: appInfo.name,
      dataPath: 'appInfo.name',
      position: { x: centerX + 200, y: 330 },
      styles: {
        fontSize: '20px',
        fontWeight: '600'
      }
    },
    ...(downloads.showAppStore ? [{
      id: generateId(),
      type: 'button',
      content: 'App Store',
      icon: 'appstore',
      dataPath: 'downloads.showAppStore',
      position: { x: centerX - 180, y: 480 },
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
    }] : []),
    ...(downloads.showGooglePlay ? [{
      id: generateId(),
      type: 'button',
      content: 'Google Play',
      icon: 'googleplay',
      dataPath: 'downloads.showGooglePlay',
      position: { x: centerX, y: 480 },
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
 * 斜角展示模板
 */
export const diagonalTemplate = (appInfo, downloads) => {
  return [
    {
      id: generateId(),
      type: 'icon',
      content: appInfo.iconImage || appInfo.icon,
      dataPath: 'appInfo.iconImage',
      position: { x: 100, y: 100 },
      styles: {
        width: '64px',
        height: '64px',
        borderRadius: '12px',
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '18px',
        fontWeight: 'bold'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: appInfo.name,
      dataPath: 'appInfo.name',
      position: { x: 180, y: 115 },
      styles: {
        fontSize: '20px',
        fontWeight: '600'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: appInfo.title,
      dataPath: 'appInfo.title',
      position: { x: 100, y: 200 },
      styles: {
        fontSize: '36px',
        fontWeight: 'bold',
        lineHeight: 'normal'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: appInfo.subtitle,
      dataPath: 'appInfo.subtitle',
      position: { x: 100, y: 320 },
      styles: {
        fontSize: '18px',
        lineHeight: '1.8'
      }
    },
    ...(downloads.showAppStore ? [{
      id: generateId(),
      type: 'button',
      content: 'App Store',
      icon: 'appstore',
      dataPath: 'downloads.showAppStore',
      position: { x: 100, y: 450 },
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
    }] : []),
    ...(downloads.showGooglePlay ? [{
      id: generateId(),
      type: 'button',
      content: 'Google Play',
      icon: 'googleplay',
      dataPath: 'downloads.showGooglePlay',
      position: { x: 280, y: 450 },
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
