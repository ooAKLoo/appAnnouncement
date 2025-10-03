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
 * Klavis AI - Strata 代码展示模板
 */
export const klavisStrataTemplate = (appInfo, productHuntInfo) => {
  const centerX = getCenterX();

  return [
    {
      id: generateId(),
      type: 'text',
      content: 'K Klavis AI',
      dataPath: 'productHuntInfo.logo',
      position: { x: 100, y: 80 },
      styles: {
        fontSize: '24px',
        fontWeight: 'bold'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: 'Strata',
      dataPath: 'productHuntInfo.badge',
      position: { x: centerX + 200, y: 85 },
      styles: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#ef4444'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: 'Built for Developers',
      dataPath: 'productHuntInfo.title',
      position: { x: centerX - 220, y: 150 },
      styles: {
        fontSize: '36px',
        fontWeight: 'bold',
        textAlign: 'center',
        width: '440px'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: 'Curl | Python | TypeScript',
      position: { x: centerX - 120, y: 240 },
      styles: {
        fontSize: '14px',
        fontWeight: '500',
        padding: '8px 16px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: '8px'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: 'import klavis\nclient = klavis.Client()\nresponse = client.generate()',
      position: { x: centerX - 180, y: 300 },
      styles: {
        fontSize: '14px',
        fontFamily: 'monospace',
        padding: '16px',
        backgroundColor: 'rgba(0,0,0,0.3)',
        borderRadius: '12px',
        border: '1px solid rgba(255,255,255,0.2)',
        whiteSpace: 'pre',
        width: '360px'
      }
    }
  ];
};

/**
 * Influencer Marketing 网格卡片模板
 */
export const influencerMarketingTemplate = (appInfo, productHuntInfo) => {
  const centerX = getCenterX();

  return [
    {
      id: generateId(),
      type: 'text',
      content: '转化率\n85%',
      position: { x: 120, y: 150 },
      styles: {
        width: '140px',
        padding: '16px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '16px',
        fontSize: '12px',
        fontWeight: '600',
        whiteSpace: 'pre-line',
        textAlign: 'left'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: '触达人数\n120M+',
      position: { x: 120, y: 280 },
      styles: {
        width: '140px',
        padding: '16px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '16px',
        fontSize: '12px',
        fontWeight: '600',
        whiteSpace: 'pre-line'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: 'AI Agent\nInfluencer Marketing',
      position: { x: centerX - 120, y: 100 },
      styles: {
        width: '240px',
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3))',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '24px',
        fontSize: '24px',
        fontWeight: 'bold',
        whiteSpace: 'pre-line'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: 'Outreach\nSend in bulk',
      position: { x: centerX - 120, y: 270 },
      styles: {
        width: '240px',
        padding: '16px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '16px',
        fontSize: '18px',
        fontWeight: '600',
        whiteSpace: 'pre-line'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: 'Agent\n🤖 AI',
      position: { x: centerX + 140, y: 150 },
      styles: {
        width: '140px',
        padding: '16px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '16px',
        fontSize: '12px',
        fontWeight: '600',
        whiteSpace: 'pre-line'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: '搜索',
      position: { x: centerX + 140, y: 280 },
      styles: {
        width: '140px',
        padding: '12px',
        backgroundColor: 'rgba(255,255,255,0.1)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '16px',
        fontSize: '12px',
        fontWeight: '600'
      }
    }
  ];
};

/**
 * Scrumball 倾斜卡片模板
 */
export const scrumballTemplate = (appInfo, productHuntInfo) => {
  const centerX = getCenterX();

  return [
    {
      id: generateId(),
      type: 'text',
      content: 'Scrumball',
      dataPath: 'productHuntInfo.title',
      position: { x: centerX - 100, y: 120 },
      styles: {
        fontSize: '48px',
        fontWeight: 'bold'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: 'Your 24/7 AI Team',
      dataPath: 'productHuntInfo.subtitle',
      position: { x: centerX - 150, y: 200 },
      styles: {
        fontSize: '20px',
        opacity: '0.7',
        textAlign: 'center',
        width: '300px'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: 'Brand\nStrategist',
      position: { x: 100, y: 300 },
      styles: {
        width: '180px',
        padding: '16px',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(37, 99, 235, 0.3))',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '16px',
        fontSize: '14px',
        fontWeight: '600',
        transform: 'rotate(-6deg)',
        whiteSpace: 'pre-line'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: 'Creator\nScout',
      position: { x: centerX - 90, y: 290 },
      styles: {
        width: '180px',
        padding: '16px',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(147, 51, 234, 0.3))',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '16px',
        fontSize: '14px',
        fontWeight: '600',
        transform: 'rotate(3deg)',
        whiteSpace: 'pre-line'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: 'Outreach\nExpert',
      position: { x: centerX + 120, y: 300 },
      styles: {
        width: '180px',
        padding: '16px',
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(219, 39, 119, 0.3))',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '16px',
        fontSize: '14px',
        fontWeight: '600',
        transform: 'rotate(-3deg)',
        whiteSpace: 'pre-line'
      }
    }
  ];
};

/**
 * Voice AI 音频播放器模板
 */
export const voiceAITemplate = (appInfo, productHuntInfo) => {
  const centerX = getCenterX();

  return [
    {
      id: generateId(),
      type: 'text',
      content: 'Your Voice, Supercharged by AI',
      dataPath: 'productHuntInfo.title',
      position: { x: centerX - 250, y: 120 },
      styles: {
        fontSize: '36px',
        fontWeight: 'bold',
        textAlign: 'center',
        width: '500px'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: 'Instant audio transformation powered by AI',
      dataPath: 'productHuntInfo.subtitle',
      position: { x: centerX - 200, y: 200 },
      styles: {
        fontSize: '18px',
        opacity: '0.7',
        textAlign: 'center',
        width: '400px'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: '▶  🔊  ～～～～～～～～～～\nTell me what you want...',
      position: { x: centerX - 220, y: 280 },
      styles: {
        width: '440px',
        padding: '24px',
        backgroundColor: 'rgba(0,0,0,0.4)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '16px',
        fontSize: '14px',
        whiteSpace: 'pre-line',
        lineHeight: '2'
      }
    }
  ];
};

/**
 * Speak. Create. Launch 双设备展示模板
 */
export const speakCreateLaunchTemplate = (appInfo, productHuntInfo) => {
  const centerX = getCenterX();

  return [
    {
      id: generateId(),
      type: 'text',
      content: 'Speak. Create. Launch',
      dataPath: 'productHuntInfo.title',
      position: { x: centerX - 200, y: 100 },
      styles: {
        fontSize: '48px',
        fontWeight: 'bold',
        textAlign: 'center',
        width: '400px'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: 'AI-powered content creation',
      dataPath: 'productHuntInfo.subtitle',
      position: { x: centerX - 180, y: 180 },
      styles: {
        fontSize: '18px',
        opacity: '0.7',
        textAlign: 'center',
        width: '360px'
      }
    },
    {
      id: generateId(),
      type: 'button',
      content: 'Start Free Trial',
      dataPath: 'productHuntInfo.ctaButton',
      position: { x: centerX - 80, y: 240 },
      styles: {
        padding: '12px 32px',
        background: 'linear-gradient(to right, #ec4899, #a855f7)',
        borderRadius: '9999px',
        fontWeight: '600',
        border: 'none'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: 'Audio Player\n～～～～～～',
      position: { x: 150, y: 320 },
      styles: {
        width: '200px',
        padding: '16px',
        backgroundColor: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '16px',
        fontSize: '12px',
        whiteSpace: 'pre-line'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: 'Settings\n▼ Voice\n▼ Speed',
      position: { x: centerX + 80, y: 320 },
      styles: {
        width: '200px',
        padding: '16px',
        backgroundColor: 'rgba(0,0,0,0.3)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '16px',
        fontSize: '12px',
        whiteSpace: 'pre-line'
      }
    }
  ];
};

/**
 * Palify 设备对比模板
 */
export const palifyTemplate = (appInfo, productHuntInfo) => {
  const centerX = getCenterX();

  return [
    {
      id: generateId(),
      type: 'text',
      content: 'Welcome to Palify',
      dataPath: 'productHuntInfo.welcome',
      position: { x: 100, y: 80 },
      styles: {
        fontSize: '14px',
        opacity: '0.6'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: 'Your All-in-One Platform',
      dataPath: 'productHuntInfo.title',
      position: { x: centerX - 200, y: 120 },
      styles: {
        fontSize: '30px',
        fontWeight: 'bold',
        width: '400px'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: '☰ ⚙\n\n━━━\n━━\n\n▭▭▭',
      position: { x: 120, y: 220 },
      styles: {
        width: '220px',
        height: '280px',
        padding: '16px',
        backgroundColor: 'rgba(255,255,255,0.9)',
        color: '#374151',
        border: '1px solid rgba(156,163,175,0.3)',
        borderRadius: '24px',
        fontSize: '16px',
        whiteSpace: 'pre-line',
        lineHeight: '2',
        boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: '☰ ⚙\n\n▭▭▭\n\n━━━\n━━',
      position: { x: centerX + 60, y: 220 },
      styles: {
        width: '220px',
        height: '280px',
        padding: '16px',
        backgroundColor: 'rgba(17, 24, 39, 0.9)',
        color: '#e5e7eb',
        border: '1px solid rgba(75, 85, 99, 0.3)',
        borderRadius: '24px',
        fontSize: '16px',
        whiteSpace: 'pre-line',
        lineHeight: '2',
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
      }
    }
  ];
};

/**
 * Clips 多手机展示模板
 */
export const clipsTemplate = (appInfo, productHuntInfo) => {
  const centerX = getCenterX();

  return [
    {
      id: generateId(),
      type: 'text',
      content: 'Clips',
      dataPath: 'productHuntInfo.badge',
      position: { x: centerX - 120, y: 80 },
      styles: {
        fontSize: '14px',
        fontWeight: '600',
        opacity: '0.6'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: 'Capture Every Moment',
      dataPath: 'productHuntInfo.title',
      position: { x: centerX - 180, y: 110 },
      styles: {
        fontSize: '36px',
        fontWeight: 'bold',
        textAlign: 'center',
        width: '360px'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: 'Show your creativity with stunning clips',
      dataPath: 'productHuntInfo.subtitle',
      position: { x: centerX - 160, y: 180 },
      styles: {
        fontSize: '16px',
        opacity: '0.7',
        textAlign: 'center',
        width: '320px'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: 'Create clips\n▭ ▭\n▭ ▭',
      position: { x: 100, y: 250 },
      styles: {
        width: '160px',
        height: '280px',
        padding: '16px',
        background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.2), rgba(59, 130, 246, 0.2))',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '24px',
        fontSize: '12px',
        fontWeight: '600',
        whiteSpace: 'pre-line'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: '\n\n⊙\n76%\nProcessing...',
      position: { x: centerX - 80, y: 250 },
      styles: {
        width: '160px',
        height: '280px',
        padding: '16px',
        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.2), rgba(168, 85, 247, 0.2))',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '24px',
        fontSize: '14px',
        fontWeight: '600',
        whiteSpace: 'pre-line',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }
    },
    {
      id: generateId(),
      type: 'text',
      content: 'Pose vintage\n\n▭▭▭▭\n\n◉ ◉ ◉\n━━━',
      position: { x: centerX + 100, y: 250 },
      styles: {
        width: '160px',
        height: '280px',
        padding: '16px',
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(34, 197, 94, 0.2))',
        border: '1px solid rgba(255,255,255,0.3)',
        borderRadius: '24px',
        fontSize: '12px',
        fontWeight: '600',
        whiteSpace: 'pre-line'
      }
    }
  ];
};
