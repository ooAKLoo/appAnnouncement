/**
 * 纯数据驱动的模板配置
 * 每个模板是一个函数，接收状态参数，返回 DynamicComponent 数据数组
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
 * Product Hunt 居中模板
 */
export const productHuntCenterTemplate = (productHuntInfo, downloads) => {
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
      content: productHuntInfo.iconImage || productHuntInfo.name.charAt(0),
      dataPath: 'productHuntInfo.iconImage',
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
      content: productHuntInfo.name,
      dataPath: 'productHuntInfo.name',
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
export const productHuntTopTemplate = (productHuntInfo) => {
  const centerX = getCenterX();

  return [
    {
      id: generateId(),
      type: 'icon',
      content: productHuntInfo.iconImage || productHuntInfo.name.charAt(0),
      dataPath: 'productHuntInfo.iconImage',
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
      content: productHuntInfo.name,
      dataPath: 'productHuntInfo.name',
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
 * 模板映射表
 */
export const TEMPLATE_DATA = {
  classic: classicTemplate,
  center: centerTemplate,
  topBottom: topBottomTemplate,
  diagonal: diagonalTemplate,
  productHuntCenter: productHuntCenterTemplate,
  productHuntTop: productHuntTopTemplate
};

/**
 * 根据模板ID生成元素数据
 */
export function getTemplateElements(templateId, state) {
  const templateFn = TEMPLATE_DATA[templateId];
  if (!templateFn) {
    console.warn(`Unknown template: ${templateId}`);
    return [];
  }

  // 根据模板类型传递不同的参数
  if (templateId.startsWith('productHunt')) {
    return templateFn(state.productHuntInfo, state.downloads);
  } else {
    return templateFn(state.appInfo, state.downloads);
  }
}
