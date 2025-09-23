import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AppContext = createContext();

const initialState = {
  appInfo: {
    name: 'Bompay',
    icon: 'B',
    title: 'Download Bompay today',
    subtitle: '体验全新的支付方式，让生活更简单',
    iconImage: null
  },
  design: {
    template: 'classic',
    colorScheme: 'blue',
    bgColor: '#667eea',
    gradientColor: '#764ba2'
  },
  downloads: {
    showAppStore: true,
    showGooglePlay: true,
    appStoreUrl: '',
    googlePlayUrl: ''
  },
  screenImage: null,
  projects: [],
  currentTab: 'app',
  configPanelOpen: false,
  downloadMenuOpen: false,
  projectMenuOpen: false,
  saveDialogOpen: false,
  confirmDialogOpen: false,
  projectToDelete: null
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
    case 'UPDATE_DOWNLOADS':
      return {
        ...state,
        downloads: { ...state.downloads, ...action.payload }
      };
    case 'SET_SCREEN_IMAGE':
      return {
        ...state,
        screenImage: action.payload
      };
    case 'SET_CURRENT_TAB':
      return {
        ...state,
        currentTab: action.payload
      };
    case 'TOGGLE_CONFIG_PANEL':
      return {
        ...state,
        configPanelOpen: !state.configPanelOpen
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
    updateDownloads: (downloads) => dispatch({ type: 'UPDATE_DOWNLOADS', payload: downloads }),
    setScreenImage: (image) => dispatch({ type: 'SET_SCREEN_IMAGE', payload: image }),
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
    deleteProject: (projectId) => dispatch({ type: 'DELETE_PROJECT', payload: projectId })
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