import React, { createContext, useContext, useReducer, useEffect, useState, useRef, useCallback } from 'react';
import { generateGradientColor, getGradientDirection, getStyleConfig } from '../data/styleConfig';
import { projectStorage } from '../utils/storage';
import { getTemplateElements } from '../data/templateData';
import { TEMPLATES } from '../data/templateConfig';

const AppContext = createContext();

const initialState = {
  appInfo: {
    name: 'Postory',
    icon: 'P',
    title: 'Download Postory today',
    subtitle: '创造你的故事,分享你的精彩',
    iconImage: '/postory-icon.png',
    previewImage: null
  },
  productHuntInfo: {
    badge: 'NOW AVAILABLE',
    name: 'Postory',
    tagline: 'Create your story, share your moments',
    description: 'Transform your ideas into beautiful stories',
    iconImage: '/postory-icon.png',
    welcome: 'Welcome to Palify'
  },
  design: {
    template: 'classic',
    colorScheme: 'blue',
    bgColor: '#667eea',
    gradientColor: '#764ba2',
    colorMode: 'gradient',
    gradientAngle: '135deg',
    spacing: 8,
    exportWidth: null,
    exportHeight: null,
    exportX: null,      // 导出框 X 位置（null 表示居中）
    exportY: null,      // 导出框 Y 位置（null 表示居中）
    exportScale: 1      // 导出框缩放比例
  },
  typography: {
    fontFamily: 'Inter, SF Pro Display, -apple-system, BlinkMacSystemFont, sans-serif',
    titleWeight: 600,
    subtitleWeight: 400,
    bodyWeight: 400,
    textColor: '#333333'
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
    features: false,
    event: false,
    media: true
  },
  featureStyle: 'card',
  currentStyle: 'minimal',
  screenImage: null,
  showImagePreview: false,
  
  deviceType: 'mobile',
  modelType: '3d',
  modelState: {
    rotation: { x: 0, y: 0, z: 0 },
    position: { x: 0, y: 0, z: 0 },
    scale: 1,
    cameraPosition: { x: 0, y: 0, z: 5 }
  },
  
  projects: [],
  currentTab: null,
  currentPanel: 'content',
  configPanelOpen: false,
  downloadMenuOpen: false,
  projectMenuOpen: false,
  saveDialogOpen: false,
  confirmDialogOpen: false,
  projectToDelete: null,
  createProjectModalOpen: false,
  toolbarsVisible: true,
  
  appMode: 'home',
  
  selectedElement: null,
  selectedElements: [], // 多选支持
  elementStyles: {},
  draggedElement: null,

  dynamicComponents: [],
  contextMenu: { visible: false, x: 0, y: 0 }, // ✅ 修复：使用对象而不是 null
  templateVersion: 0, // 用于强制重新渲染模板
  templateEditMode: false, // 模板编辑模式
  templateConfigCode: '' // 生成的模板配置代码
};

function appReducer(state, action) {
  switch (action.type) {
    case 'UPDATE_APP_INFO':
      return {
        ...state,
        appInfo: { ...state.appInfo, ...action.payload }
      };
    case 'UPDATE_PRODUCT_HUNT_INFO':
      return {
        ...state,
        productHuntInfo: { ...state.productHuntInfo, ...action.payload }
      };
    case 'UPDATE_DESIGN':
      const designUpdate = action.payload;
      let newDesign = { ...state.design, ...designUpdate };
      let newState = { ...state };
      
      if (designUpdate.colorMode === 'gradient' && state.design.colorMode !== 'gradient') {
        const { gradientColor } = generateGradientColor(newDesign.bgColor, state.currentStyle);
        newDesign.gradientColor = gradientColor;
      }
      
      if (designUpdate.deviceType !== undefined) {
        newState.deviceType = designUpdate.deviceType;
        if (designUpdate.deviceType === 'product-hunt') {
          newState.modelType = '2d';
        }
      }
      
      return {
        ...newState,
        design: newDesign
      };
    case 'UPDATE_THEME':
      return {
        ...state,
        currentTheme: action.payload
      };
    case 'UPDATE_STYLE':
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
      // 切换模型类型时，同时应用对应的模型状态
      const currentTemplateConfig = TEMPLATES[state.design.template];
      const newModelStateConfig = currentTemplateConfig?.modelState?.[action.payload];

      return {
        ...state,
        modelType: action.payload,
        // 应用模板中该模型类型的状态配置
        modelState: newModelStateConfig ? { ...state.modelState, ...newModelStateConfig } : state.modelState
      };
    case 'SET_TEMPLATE':
      // 直接从模板数据生成 dynamicComponents
      const templateElements = getTemplateElements(action.payload.templateId, state);

      // 获取模板的模型状态配置
      const templateConfig = TEMPLATES[action.payload.templateId];
      const modelStateConfig = templateConfig?.modelState?.[state.modelType];

      return {
        ...state,
        design: {
          ...state.design,
          template: action.payload.templateId
        },
        dynamicComponents: templateElements, // 使用模板数据直接生成
        elementStyles: {}, // 清空元素样式
        selectedElement: null, // 取消选中
        selectedElements: [], // 清空多选
        templateVersion: state.templateVersion + 1, // 增加版本号，强制重新渲染
        // 应用模板的模型状态（如果有配置）
        modelState: modelStateConfig ? { ...state.modelState, ...modelStateConfig } : state.modelState
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
        ...action.payload,
        // ✅ 确保 contextMenu 始终有正确的结构
        contextMenu: action.payload.contextMenu || { visible: false, x: 0, y: 0 }
      };
    case 'SET_CURRENT_PROJECT_ID':
      return {
        ...state,
        currentProjectId: action.payload
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        )
      };
    case 'SET_CONTENT_SECTIONS':
      return {
        ...state,
        contentSections: action.payload
      };
    case 'RESET_TO_INITIAL':
      return {
        ...initialState,
        projects: state.projects
      };
    case 'UPDATE_MODEL_STATE':
      return {
        ...state,
        modelState: { ...state.modelState, ...action.payload }
      };
    case 'SET_APP_MODE':
      return {
        ...state,
        appMode: action.payload
      };
    case 'SELECT_ELEMENT':
      // 如果是多选模式（payload.isMultiSelect），添加到选中列表
      if (action.payload.isMultiSelect) {
        const elementId = action.payload.id;
        const isAlreadySelected = state.selectedElements.some(el => el.id === elementId);

        console.log('🔄 [SELECT_ELEMENT] 多选模式:', {
          elementId,
          isAlreadySelected,
          currentSelectedCount: state.selectedElements.length,
          action: isAlreadySelected ? '取消选中' : '添加选中'
        });

        return {
          ...state,
          selectedElements: isAlreadySelected
            ? state.selectedElements.filter(el => el.id !== elementId) // 取消选中
            : [...state.selectedElements, action.payload], // 添加到选中
          selectedElement: action.payload,
          currentPanel: 'style'
        };
      } else {
        // 单选模式，清空其他选中
        console.log('🔄 [SELECT_ELEMENT] 单选模式:', {
          elementId: action.payload.id,
          elementPath: action.payload.element,
          previousSelectedCount: state.selectedElements.length
        });

        return {
          ...state,
          selectedElement: action.payload,
          selectedElements: [action.payload],
          currentPanel: 'style'
        };
      }
    case 'DESELECT_ELEMENT':
      return {
        ...state,
        selectedElement: null,
        selectedElements: []
      };
    case 'CLEAR_SELECTION':
      return {
        ...state,
        selectedElement: null,
        selectedElements: []
      };
    case 'UPDATE_ELEMENT_STYLE':
      return {
        ...state,
        elementStyles: {
          ...state.elementStyles,
          [action.payload.elementId]: {
            ...state.elementStyles[action.payload.elementId],
            ...action.payload.styles
          }
        }
      };
    case 'SET_DRAGGED_ELEMENT':
      return {
        ...state,
        draggedElement: action.payload
      };
    case 'REORDER_FEATURES':
      const { fromIndex, toIndex } = action.payload;
      const newFeatures = [...state.features];
      const [movedItem] = newFeatures.splice(fromIndex, 1);
      newFeatures.splice(toIndex, 0, movedItem);
      return {
        ...state,
        features: newFeatures
      };
    case 'SHOW_CONTEXT_MENU':
      console.log('🔄 Reducer: SHOW_CONTEXT_MENU', action.payload); // ✅ 添加调试日志
      return {
        ...state,
        contextMenu: {
          visible: true,
          x: action.payload.x,
          y: action.payload.y
        }
      };
    case 'HIDE_CONTEXT_MENU':
      console.log('🔄 Reducer: HIDE_CONTEXT_MENU'); // ✅ 添加调试日志
      return {
        ...state,
        contextMenu: {
          visible: false,
          x: 0,
          y: 0
        }
      };
    case 'ADD_DYNAMIC_COMPONENT':
      return {
        ...state,
        dynamicComponents: [...state.dynamicComponents, action.payload],
        contextMenu: { visible: false, x: 0, y: 0 }
      };
    case 'UPDATE_DYNAMIC_COMPONENT':
      return {
        ...state,
        dynamicComponents: state.dynamicComponents.map(comp =>
          comp.id === action.payload.id ? { ...comp, ...action.payload.updates } : comp
        )
      };
    case 'DELETE_DYNAMIC_COMPONENT':
      return {
        ...state,
        dynamicComponents: state.dynamicComponents.filter(comp => comp.id !== action.payload)
      };
    case 'TOGGLE_TEMPLATE_EDIT_MODE':
      console.log('🔄 [Reducer] TOGGLE_TEMPLATE_EDIT_MODE:', !state.templateEditMode);
      return {
        ...state,
        templateEditMode: !state.templateEditMode
      };
    case 'UPDATE_TEMPLATE_CONFIG_CODE':
      console.log('🔄 [Reducer] UPDATE_TEMPLATE_CONFIG_CODE:', action.payload.substring(0, 100) + '...');
      return {
        ...state,
        templateConfigCode: action.payload
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const autoSaveTimerRef = useRef(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const projects = await projectStorage.loadProjects();
        dispatch({ type: 'SET_PROJECTS', payload: projects });
        
        const currentProject = await projectStorage.loadCurrentProject();
        if (currentProject) {
          setCurrentProjectId(currentProject.id);
          dispatch({ type: 'LOAD_STATE', payload: currentProject });
        }
      } catch (error) {
        console.error('加载数据失败:', error);
      }
    };
    
    loadData();
  }, []);

  useEffect(() => {
    if (!currentProjectId) return;

    clearTimeout(autoSaveTimerRef.current);
    autoSaveTimerRef.current = setTimeout(async () => {
      try {
        const projectData = await projectStorage.saveCurrentProject(
          currentProjectId, 
          state
        );
        
        await projectStorage.updateProject(currentProjectId, projectData);
        
        console.log('自动保存成功');
      } catch (error) {
        console.error('自动保存失败:', error);
      }
    }, 2000);

    return () => clearTimeout(autoSaveTimerRef.current);
  }, [
    currentProjectId,
    state.appInfo,
    state.productHuntInfo,
    state.design,
    state.typography,
    state.downloads,
    state.features,
    state.eventInfo,
    state.contentSections,
    state.featureStyle,
    state.currentStyle,
    state.deviceType,
    state.modelType,
    state.modelState,
    state.screenImage,
    state.elementStyles
  ]);

  // 生成模板配置代码的统一函数
  const generateTemplateCode = useCallback(() => {
    if (!state.templateEditMode) return;

    // 生成所有 dynamicComponents 的配置代码
    const componentsCode = state.dynamicComponents.map((comp, index) => {
      // 🔥 合并原始样式和实时修改的样式
      const elementId = `dynamicComponents-${comp.id}-content`;
      const runtimeStyles = state.elementStyles[elementId] || {};
      const mergedStyles = { ...comp.styles, ...runtimeStyles };

      const styleLines = Object.entries(mergedStyles)
        .filter(([key, value]) => value) // 过滤掉空值
        .map(([key, value]) => `      ${key}: '${value}'`);

      // 构建每个组件的配置
      const parts = [
        `    id: generateId(),`,
        `    type: '${comp.type}',`,
        `    content: ${Array.isArray(comp.content) ? JSON.stringify(comp.content, null, 2).split('\n').map((line, i) => i === 0 ? line : '      ' + line).join('\n') : `'${comp.content}'`},`
      ];

      if (comp.dataPath) parts.push(`    dataPath: '${comp.dataPath}',`);
      if (comp.icon) parts.push(`    icon: '${comp.icon}',`);

      parts.push(`    position: { x: ${Math.round(comp.position.x)}, y: ${Math.round(comp.position.y)} },`);

      if (styleLines.length > 0) {
        parts.push(`    styles: {\n${styleLines.join(',\n')}\n    }`);
      } else {
        parts.push(`    styles: {}`);
      }

      return `  {\n${parts.join('\n')}\n  }`;
    }).join(',\n\n');

    // 生成模型配置代码
    const modelConfig = `// 模型配置
const modelState = {
  deviceType: '${state.deviceType}',  // 'mobile' | 'desktop' | 'product-hunt'
  modelType: '${state.modelType}',    // '3d' | '2d'
  ${state.modelType === '3d' ? `
  // 3D 模型状态
  rotation: { x: ${Math.round(state.modelState.rotation?.x || 0)}, y: ${Math.round(state.modelState.rotation?.y || 0)}, z: ${Math.round(state.modelState.rotation?.z || 0)} },
  position: { x: ${(state.modelState.position?.x || 0).toFixed(2)}, y: ${(state.modelState.position?.y || 0).toFixed(2)}, z: ${(state.modelState.position?.z || 0).toFixed(2)} },
  cameraDistance: ${state.modelState.cameraDistance || 3}` : `
  // 2D 模型状态
  transform: {
    scale: ${state.modelState.scale || 1},
    rotation: ${state.modelState.rotation?.z || 0},
    x: ${state.modelState.position?.x || 0},
    y: ${state.modelState.position?.y || 0}
  }`}
};`;

    // 生成导出框配置代码（如果存在）
    const exportFrameConfig = state.design.exportWidth && state.design.exportHeight ? `
// 导出框/裁剪框配置
// 用于定义导出时的裁剪区域，超出此框的内容将被裁剪
const exportFrame = {
  enabled: true,
  width: ${state.design.exportWidth},      // 导出框宽度（像素）
  height: ${state.design.exportHeight},     // 导出框高度（像素）
  x: ${state.design.exportX !== null ? state.design.exportX : 'null'},           // X 位置（null 表示居中）
  y: ${state.design.exportY !== null ? state.design.exportY : 'null'},           // Y 位置（null 表示居中）
  scale: ${state.design.exportScale || 1}          // 用户自定义缩放比例（基于自动计算的缩放之上）
};

// 💡 使用说明：
// 1. 将 exportFrame.width 和 height 设置到 design.exportWidth/exportHeight
// 2. 将 exportFrame.x 和 y 设置到 design.exportX/exportY（null 表示自动居中）
// 3. 将 exportFrame.scale 设置到 design.exportScale
// 4. 系统会自动应用 clipPath 裁剪，超出框的内容不可见` : `
// 导出框/裁剪框配置
const exportFrame = {
  enabled: false  // 未启用导出框
};`;

    const code = `// 模板配置代码
// 提示：复制此配置到模板文件中使用

${modelConfig}
${exportFrameConfig}

// 动态组件配置 (共 ${state.dynamicComponents.length} 个元素)
const dynamicComponents = [
${componentsCode}
];`;

    console.log('📐 生成完整模板配置代码');
    dispatch({
      type: 'UPDATE_TEMPLATE_CONFIG_CODE',
      payload: code
    });
  }, [state.templateEditMode, state.dynamicComponents, state.modelState, state.deviceType, state.modelType, state.elementStyles, state.design, dispatch]);

  // 当模板编辑模式开启时，立即生成一次代码
  useEffect(() => {
    if (state.templateEditMode) {
      generateTemplateCode();
    }
  }, [state.templateEditMode, generateTemplateCode]);

  const value = {
    state,
    dispatch,
    currentProjectId,
    setCurrentProjectId,
    generateTemplateCode,
    updateAppInfo: (info) => dispatch({ type: 'UPDATE_APP_INFO', payload: info }),
    updateProductHuntInfo: (info) => dispatch({ type: 'UPDATE_PRODUCT_HUNT_INFO', payload: info }),
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
    setTemplate: (templateId) => dispatch({ type: 'SET_TEMPLATE', payload: { templateId } }),
    updateContentStyle: (type, style) => dispatch({ type: 'UPDATE_CONTENT_STYLE', payload: { type, style } }),
    toggleContentSection: (section) => dispatch({ type: 'TOGGLE_CONTENT_SECTION', payload: section }),
    setFeatureStyle: (style) => dispatch({ type: 'SET_FEATURE_STYLE', payload: style }),
    updateModelState: (modelState) => dispatch({ type: 'UPDATE_MODEL_STATE', payload: modelState }),
    setAppMode: (mode) => dispatch({ type: 'SET_APP_MODE', payload: mode }),
    
    selectElement: (type, id, element, isMultiSelect = false) => dispatch({
      type: 'SELECT_ELEMENT',
      payload: { type, id, element, isMultiSelect }
    }),
    deselectElement: () => dispatch({ type: 'DESELECT_ELEMENT' }),
    clearSelection: () => dispatch({ type: 'CLEAR_SELECTION' }),
    updateElementStyle: (elementId, styles) => dispatch({ 
      type: 'UPDATE_ELEMENT_STYLE', 
      payload: { elementId, styles } 
    }),
    setDraggedElement: (element) => dispatch({ type: 'SET_DRAGGED_ELEMENT', payload: element }),
    reorderFeatures: (fromIndex, toIndex) => dispatch({ 
      type: 'REORDER_FEATURES', 
      payload: { fromIndex, toIndex } 
    }),
    // 使用 useCallback 保持函数引用稳定，避免监听器反复卸载/注册
    showContextMenu: useCallback((x, y) => {
      console.log('📞 showContextMenu 被调用:', x, y);
      dispatch({
        type: 'SHOW_CONTEXT_MENU',
        payload: { x, y }
      });
    }, [dispatch]),
    hideContextMenu: useCallback(() => {
      console.log('📞 hideContextMenu 被调用');
      dispatch({ type: 'HIDE_CONTEXT_MENU' });
    }, [dispatch]),
    addDynamicComponent: (component) => dispatch({ 
      type: 'ADD_DYNAMIC_COMPONENT', 
      payload: component 
    }),
    updateDynamicComponent: (id, updates) => dispatch({ 
      type: 'UPDATE_DYNAMIC_COMPONENT', 
      payload: { id, updates } 
    }),
    deleteDynamicComponent: (id) => dispatch({
      type: 'DELETE_DYNAMIC_COMPONENT',
      payload: id
    }),
    toggleTemplateEditMode: () => dispatch({ type: 'TOGGLE_TEMPLATE_EDIT_MODE' }),
    updateTemplateConfigCode: (code) => dispatch({
      type: 'UPDATE_TEMPLATE_CONFIG_CODE',
      payload: code
    })
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
