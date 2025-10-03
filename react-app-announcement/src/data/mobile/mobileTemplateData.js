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
      position: { x: 380, y: 240 },
      styles: {
        width: '80px',
        height: '80px',
        borderRadius: '20px',
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '32px',
        fontWeight: 'bold'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: appInfo.name,
      dataPath: 'appInfo.name',
      position: { x: 480, y: 265 },
      styles: {
        fontSize: '24px',
        fontWeight: '600'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: appInfo.title,
      dataPath: 'appInfo.title',
      position: { x: 380, y: 350 },
      styles: {
        fontSize: '42px',
        fontWeight: 'bold',
        lineHeight: '1.3',
        maxWidth: '500px'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: appInfo.subtitle,
      dataPath: 'appInfo.subtitle',
      position: { x: 380, y: 460 },
      styles: {
        fontSize: '20px',
        lineHeight: '1.8',
        maxWidth: '480px',
        opacity: '0.9'
      }
    },
    ...(downloads.showAppStore ? [{
      id: generateId(),
      type: 'button',
      content: 'App Store',
      icon: 'appstore',
      dataPath: 'downloads.showAppStore',
      position: { x: 380, y: 570 },
      styles: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 28px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '14px',
        fontSize: '17px',
        fontWeight: '500'
      }
    }] : []),
    ...(downloads.showGooglePlay ? [{
      id: generateId(),
      type: 'button',
      content: 'Google Play',
      icon: 'googleplay',
      dataPath: 'downloads.showGooglePlay',
      position: { x: 580, y: 570 },
      styles: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 28px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '14px',
        fontSize: '17px',
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
      position: { x: centerX - 93, y: 91 },
      styles: {
        width: '54px',
        height: '54px',
        borderRadius: '13px',
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '22px',
        fontWeight: 'bold'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: appInfo.name,
      dataPath: 'appInfo.name',
      position: { x: centerX - 20, y: 114 },
      styles: {
        fontSize: '16px',
        fontWeight: '600'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: appInfo.title,
      dataPath: 'appInfo.title',
      position: { x: centerX - 212, y: 163 },
      styles: {
        fontSize: '28px',
        fontWeight: 'bold',
        lineHeight: '1.3',
        width: '400px',
        textAlign: 'center'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: appInfo.subtitle,
      dataPath: 'appInfo.subtitle',
      position: { x: centerX - 184, y: 227 },
      styles: {
        fontSize: '15px',
        lineHeight: '1.5',
        width: '380px',
        opacity: '0.85',
        textAlign: 'center'
      }
    },
    ...(downloads.showAppStore ? [{
      id: generateId(),
      type: 'button',
      content: 'App Store',
      icon: 'appstore',
      dataPath: 'downloads.showAppStore',
      position: { x: centerX - 148, y: 276 },
      styles: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '500'
      }
    }] : []),
    ...(downloads.showGooglePlay ? [{
      id: generateId(),
      type: 'button',
      content: 'Google Play',
      icon: 'googleplay',
      dataPath: 'downloads.showGooglePlay',
      position: { x: centerX + 17, y: 276 },
      styles: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '8px 16px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '500'
      }
    }] : [])
  ];
};

