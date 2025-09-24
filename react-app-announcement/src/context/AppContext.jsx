import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  appInfo: {
    name: 'Postory',
    icon: 'P',
    title: 'Download Postory today',
    subtitle: '创造你的故事，分享你的精彩',
    iconImage: '/postory-icon.png'
  },
  design: {
    template: 'classic',
    colorScheme: 'blue',
    bgColor: '#667eea',
    gradientColor: '#764ba2',
    colorMode: 'gradient' // 'gradient' or 'solid'
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
  currentTheme: 'launch', // 当前选中的主题
  currentStyle: 'minimal', // 当前选中的风格
  screenImage: null,
  showImagePreview: false,
  projects: [],
  currentTab: null, // 初始状态下没有选中任何tab
  configPanelOpen: false,
  downloadMenuOpen: false,
  projectMenuOpen: false,
  saveDialogOpen: false,
  confirmDialogOpen: false,
  projectToDelete: null,
  createProjectModalOpen: false
};

function appReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_APP_INFO':
      return {
        ...state,
        appInfo: { ...state.appInfo, ...action.payload }
      };
    case 'UPDATE_DESIGN':
      return {
        ...state,
        design: { ...state.design, ...action.payload }
      };
    case 'UPDATE_THEME':
      return {
        ...state,
        currentTheme: action.payload
      };
    case 'UPDATE_STYLE':
      return {
        ...state,
        currentStyle: action.payload
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
      projects: state.projects
    }));
  }, [state.appInfo, state.design, state.downloads, state.projects]);

  const value = {
    state,
    dispatch,
    // Helper functions
    updateAppInfo: (info) => dispatch({ type: 'UPDATE_APP_INFO', payload: info }),
    updateDesign: (design) => dispatch({ type: 'UPDATE_DESIGN', payload: design }),
    updateTheme: (theme) => dispatch({ type: 'UPDATE_THEME', payload: theme }),
    updateStyle: (style) => dispatch({ type: 'UPDATE_STYLE', payload: style }),
    updateFeatures: (features) => dispatch({ type: 'UPDATE_FEATURES', payload: features }),
    updateEventInfo: (eventInfo) => dispatch({ type: 'UPDATE_EVENT_INFO', payload: eventInfo }),
    updateDownloads: (downloads) => dispatch({ type: 'UPDATE_DOWNLOADS', payload: downloads }),
    setScreenImage: (image) => dispatch({ type: 'SET_SCREEN_IMAGE', payload: image }),
    hideImagePreview: () => dispatch({ type: 'HIDE_IMAGE_PREVIEW' }),
    setCurrentTab: (tab) => dispatch({ type: 'SET_CURRENT_TAB', payload: tab }),
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
    closeCreateProjectModal: () => dispatch({ type: 'CLOSE_CREATE_PROJECT_MODAL' })
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