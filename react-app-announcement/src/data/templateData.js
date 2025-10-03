/**
 * 模板数据统一导出文件
 * 所有模板数据按设备类型分类到不同文件中
 */

// 导入手机/桌面模板
import {
  classicTemplate,
  centerTemplate
} from './mobile/mobileTemplateData';

// 导入 Product Hunt 模板
import {
  productHuntCenterTemplate,
  productHuntTopTemplate,
  voiceAITemplate,
  palifyTemplate
} from './productHunt/productHuntTemplateData';

/**
 * 模板映射表
 */
export const TEMPLATE_DATA = {
  // 手机/桌面模板
  classic: classicTemplate,
  center: centerTemplate,

  // Product Hunt 模板
  productHuntCenter: productHuntCenterTemplate,
  productHuntTop: productHuntTopTemplate,
  voiceAI: voiceAITemplate,
  palify: palifyTemplate
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
    'voiceAI',
    'palify'
  ];

  // Product Hunt 模板需要 productHuntInfo
  if (productHuntTemplates.includes(templateId)) {
    return templateFn(state.appInfo, state.productHuntInfo, state.downloads, state);
  } else {
    return templateFn(state.appInfo, state.downloads, state);
  }
}
