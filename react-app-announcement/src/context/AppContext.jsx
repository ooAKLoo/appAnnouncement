import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { generateGradientColor, getGradientDirection, getStyleConfig } from '../data/styleConfig';

const AppContext = createContext();

const initialState = {
  appInfo: {
    name: 'Postory',
    icon: 'P',
    title: 'Download Postory today',
    subtitle: '创造你的故事，分享你的精彩',
    iconImage: '/postory-icon.png', // Using the existing Postory icon
    previewImage: null
  },
  design: {
    template: 'classic',
    colorScheme: 'blue',
    bgColor: '#667eea',
    gradientColor: '#764ba2',
    colorMode: 'gradient', // 'gradient' or 'solid'
    gradientAngle: '135deg', // 渐变角度，独立于风格
    spacing: 8 // 控制文字和图片间距，1-20的范围
  },
  typography: {
    fontFamily: 'Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif', // 独立字体配置
    titleWeight: 600,
    subtitleWeight: 400,
    bodyWeight: 400,
    textColor: '#333333' // 统一字体颜色
  },
  downloads: {
    showAppStore: true,
    showGooglePlay: true,
    appStoreUrl: '',
    googlePlayUrl: ''
  },
  features: [
    { icon: '📸', title: '智能创作', description: 'AI辅助创作，轻松制作精彩内容' },
    { icon: '🎆', title: '效果丰富', description: '多样化特效，让作品更出彩' },
    { icon: '👥', title: '社区分享', description: '与好友分享创作，构建创作社区' }
  ],
  eventInfo: {
    discount: '50%',
    endDate: '2024-12-31',
    promoCode: 'SPECIAL2024',
    eventTitle: '限时优惠',
    eventDescription: '年度最大优惠活动'
  },
  contentSections: {
    features: false, // 功能列表是否显示
    event: false, // 活动信息是否显示
    media: true // 媒体资源默认显示
  },
  featureStyle: 'card', // 功能列表展示样式: 'card' | 'markdown'
  currentStyle: 'minimal', // 当前选中的风格
  screenImage: null,
  showImagePreview: false,
  projects: [],
  currentTab: null, // 初始状态下没有选中任何tab
  currentPanel: 'content', // 新的面板系统：content, design, assets, layout
  configPanelOpen: false,
  downloadMenuOpen: false,
  projectMenuOpen: false,
  saveDialogOpen: false,
  confirmDialogOpen: false,
  projectToDelete: null,
  createProjectModalOpen: false,
  toolbarsVisible: true,
  modelType: '3d' // '3d' or '2d'
};

function appReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_APP_INFO':
      return {
        ...state,
        appInfo: { ...state.appInfo, ...action.payload }
      };
    case 'UPDATE_DESIGN':
      const designUpdate = action.payload;
      let newDesign = { ...state.design, ...designUpdate };
      
      // 只在切换到渐变模式时才自动生成渐变色，其他情况不自动更改
      if (designUpdate.colorMode === 'gradient' && state.design.colorMode !== 'gradient') {
        const { gradientColor } = generateGradientColor(newDesign.bgColor, state.currentStyle);
        newDesign.gradientColor = gradientColor;
      }
      
      return {
        ...state,
        design: newDesign
      };
    case 'UPDATE_THEME':
      return {
        ...state,
        currentTheme: action.payload
      };
    case 'UPDATE_STYLE':
      // 更新风格时，同时应用对应的渐变角度和字体配置作为默认值
      const styleConfig = getStyleConfig(action.payload);
      return {
        ...state,
        currentStyle: action.payload,
        design: {
          ...state.design,
          gradientAngle: styleConfig.gradientDirection || state.design.gradientAngle
        },
        typography: {
          ...state.typography,
          fontFamily: styleConfig.fontFamily || state.typography.fontFamily,
          titleWeight: styleConfig.titleWeight || state.typography.titleWeight,
          subtitleWeight: styleConfig.subtitleWeight || state.typography.subtitleWeight,
          bodyWeight: styleConfig.bodyWeight || state.typography.bodyWeight
        }
      };
    case 'UPDATE_TYPOGRAPHY':
      return {
        ...state,
        typography: { ...state.typography, ...action.payload }
      };
    case 'UPDATE_FEATURES':
      return {
        ...state,
        features: action.payload
      };
    case 'UPDATE_EVENT_INFO':
      return {
        ...state,
        eventInfo: { ...state.eventInfo, ...action.payload }
      };
    case 'UPDATE_DOWNLOADS':
      return {
        ...state,
        downloads: { ...state.downloads, ...action.payload }
      };
    case 'SET_SCREEN_IMAGE':
      return {
        ...state,
        screenImage: action.payload,
        showImagePreview: action.payload !== null
      };
    case 'HIDE_IMAGE_PREVIEW':
      return {
        ...state,
        showImagePreview: false
      };
    case 'SET_CURRENT_TAB':
      return {
        ...state,
        currentTab: action.payload
      };
    case 'SET_CURRENT_PANEL':
      return {
        ...state,
        currentPanel: action.payload
      };
    case 'TOGGLE_CONFIG_PANEL':
      return {
        ...state,
        configPanelOpen: !state.configPanelOpen,
        // 关闭面板时清除当前选中的tab
        currentTab: !state.configPanelOpen ? state.currentTab : null
      };
    case 'TOGGLE_DOWNLOAD_MENU':
      return {
        ...state,
        downloadMenuOpen: !state.downloadMenuOpen
      };
    case 'TOGGLE_PROJECT_MENU':
      return {
        ...state,
        projectMenuOpen: !state.projectMenuOpen
      };
    case 'OPEN_SAVE_DIALOG':
      return {
        ...state,
        saveDialogOpen: true
      };
    case 'CLOSE_SAVE_DIALOG':
      return {
        ...state,
        saveDialogOpen: false
      };
    case 'OPEN_CONFIRM_DIALOG':
      return {
        ...state,
        confirmDialogOpen: true,
        projectToDelete: action.payload
      };
    case 'CLOSE_CONFIRM_DIALOG':
      return {
        ...state,
        confirmDialogOpen: false,
        projectToDelete: null
      };
    case 'SET_PROJECTS':
      return {
        ...state,
        projects: action.payload
      };
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload]
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload)
      };
    case 'OPEN_CREATE_PROJECT_MODAL':
      return {
        ...state,
        createProjectModalOpen: true
      };
    case 'CLOSE_CREATE_PROJECT_MODAL':
      return {
        ...state,
        createProjectModalOpen: false
      };
    case 'TOGGLE_TOOLBARS':
      return {
        ...state,
        toolbarsVisible: !state.toolbarsVisible
      };
    case 'SET_MODEL_TYPE':
      return {
        ...state,
        modelType: action.payload
      };
    case 'SET_TEMPLATE':
      return {
        ...state,
        design: {
          ...state.design,
          template: action.payload
        }
      };
    case 'TOGGLE_CONTENT_SECTION':
      return {
        ...state,
        contentSections: {
          ...state.contentSections,
          [action.payload]: !state.contentSections[action.payload]
        }
      };
    case 'SET_FEATURE_STYLE':
      return {
        ...state,
        featureStyle: action.payload
      };
    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('appAnnouncementState');
    if (savedState) {
      try {
        const parsedState = JSON.parse(savedState);
        dispatch({ type: 'LOAD_STATE', payload: parsedState });
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('appAnnouncementState', JSON.stringify({
      appInfo: state.appInfo,
      design: state.design,
      downloads: state.downloads,
      contentStyles: state.contentStyles,
      contentSections: state.contentSections,
      projects: state.projects
    }));
  }, [state.appInfo, state.design, state.downloads, state.contentStyles, state.contentSections, state.projects]);

  const value = {
    state,
    dispatch,
    // Helper functions
    updateAppInfo: (info) => dispatch({ type: 'UPDATE_APP_INFO', payload: info }),
    updateDesign: (design) => dispatch({ type: 'UPDATE_DESIGN', payload: design }),
    updateTypography: (typography) => dispatch({ type: 'UPDATE_TYPOGRAPHY', payload: typography }),
    updateTheme: (theme) => dispatch({ type: 'UPDATE_THEME', payload: theme }),
    updateStyle: (style) => dispatch({ type: 'UPDATE_STYLE', payload: style }),
    updateFeatures: (features) => dispatch({ type: 'UPDATE_FEATURES', payload: features }),
    updateEventInfo: (eventInfo) => dispatch({ type: 'UPDATE_EVENT_INFO', payload: eventInfo }),
    updateDownloads: (downloads) => dispatch({ type: 'UPDATE_DOWNLOADS', payload: downloads }),
    setScreenImage: (image) => dispatch({ type: 'SET_SCREEN_IMAGE', payload: image }),
    hideImagePreview: () => dispatch({ type: 'HIDE_IMAGE_PREVIEW' }),
    setCurrentTab: (tab) => dispatch({ type: 'SET_CURRENT_TAB', payload: tab }),
    setCurrentPanel: (panel) => dispatch({ type: 'SET_CURRENT_PANEL', payload: panel }),
    toggleConfigPanel: () => dispatch({ type: 'TOGGLE_CONFIG_PANEL' }),
    toggleDownloadMenu: () => dispatch({ type: 'TOGGLE_DOWNLOAD_MENU' }),
    toggleProjectMenu: () => dispatch({ type: 'TOGGLE_PROJECT_MENU' }),
    openSaveDialog: () => dispatch({ type: 'OPEN_SAVE_DIALOG' }),
    closeSaveDialog: () => dispatch({ type: 'CLOSE_SAVE_DIALOG' }),
    openConfirmDialog: (projectId) => dispatch({ type: 'OPEN_CONFIRM_DIALOG', payload: projectId }),
    closeConfirmDialog: () => dispatch({ type: 'CLOSE_CONFIRM_DIALOG' }),
    setProjects: (projects) => dispatch({ type: 'SET_PROJECTS', payload: projects }),
    addProject: (project) => dispatch({ type: 'ADD_PROJECT', payload: project }),
    deleteProject: (projectId) => dispatch({ type: 'DELETE_PROJECT', payload: projectId }),
    openCreateProjectModal: () => dispatch({ type: 'OPEN_CREATE_PROJECT_MODAL' }),
    closeCreateProjectModal: () => dispatch({ type: 'CLOSE_CREATE_PROJECT_MODAL' }),
    toggleToolbars: () => dispatch({ type: 'TOGGLE_TOOLBARS' }),
    setModelType: (type) => dispatch({ type: 'SET_MODEL_TYPE', payload: type }),
    setTemplate: (template) => dispatch({ type: 'SET_TEMPLATE', payload: template }),
    updateContentStyle: (type, style) => dispatch({ type: 'UPDATE_CONTENT_STYLE', payload: { type, style } }),
    toggleContentSection: (section) => dispatch({ type: 'TOGGLE_CONTENT_SECTION', payload: section }),
    setFeatureStyle: (style) => dispatch({ type: 'SET_FEATURE_STYLE', payload: style })
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}