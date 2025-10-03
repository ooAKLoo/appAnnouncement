/**
 * 模板数据统一导出文件
 * 所有模板数据按设备类型分类到不同文件中
 */

// 导入手机/桌面模板
import {
  classicTemplate,
  centerTemplate,
  topBottomTemplate,
  diagonalTemplate
} from './mobile/mobileTemplateData';

// 导入 Product Hunt 模板
import {
  productHuntCenterTemplate,
  productHuntTopTemplate,
  klavisStrataTemplate,
  influencerMarketingTemplate,
  scrumballTemplate,
  voiceAITemplate,
  speakCreateLaunchTemplate,
  palifyTemplate,
  clipsTemplate
} from './productHunt/productHuntTemplateData';

/**
 * 模板映射表
 */
export const TEMPLATE_DATA = {
  // 手机/桌面模板
  classic: classicTemplate,
  center: centerTemplate,
  topBottom: topBottomTemplate,
  diagonal: diagonalTemplate,

  // Product Hunt 模板
  productHuntCenter: productHuntCenterTemplate,
  productHuntTop: productHuntTopTemplate,
  klavisStrata: klavisStrataTemplate,
  influencerMarketing: influencerMarketingTemplate,
  scrumball: scrumballTemplate,
  voiceAI: voiceAITemplate,
  speakCreateLaunch: speakCreateLaunchTemplate,
  palify: palifyTemplate,
  clips: clipsTemplate
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

  // Product Hunt 模式的模板列表
  const productHuntTemplates = [
    'productHuntCenter',
    'productHuntTop',
    'klavisStrata',
    'influencerMarketing',
    'scrumball',
    'voiceAI',
    'speakCreateLaunch',
    'palify',
    'clips'
  ];

  // Product Hunt 模板需要 productHuntInfo
  if (productHuntTemplates.includes(templateId)) {
    return templateFn(state.appInfo, state.productHuntInfo, state.downloads);
  } else {
    return templateFn(state.appInfo, state.downloads);
  }
}
