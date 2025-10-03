import React from 'react';
import { Image, MonitorSpeaker, Plus, FileText, X, Sparkles, Calendar, Square, List } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useUpload } from '../../hooks/useUpload';
import FormField from '../common/FormField';
import OptionalContentSection from '../common/OptionalContentSection';

function ContentPanel({ isActive }) {
  const { state, updateAppInfo, updateDownloads, updateFeatures, updateEventInfo, updateContentStyle, toggleContentSection, toggleConfigPanel, setFeatureStyle, setCurrentPanel } = useApp();
  const { handleIconUpload, handleScreenUpload } = useUpload();

  const handleInputChange = (field, value) => {
    updateAppInfo({ [field]: value });
  };

  const handleDownloadChange = (field, value) => {
    updateDownloads({ [field]: value });
  };
  
  // 功能列表管理
  const handleFeatureChange = (index, field, value) => {
    const newFeatures = [...state.features];
    newFeatures[index] = { ...newFeatures[index], [field]: value };
    updateFeatures(newFeatures);
  };

  const handleAddFeature = () => {
    const newFeature = {
      icon: '✨',
      title: '新功能',
      description: '功能描述'
    };
    updateFeatures([...state.features, newFeature]);
  };

  const handleRemoveFeature = (index) => {
    const newFeatures = state.features.filter((_, i) => i !== index);
    updateFeatures(newFeatures);
  };
  
  // 活动信息管理
  const handleEventInfoChange = (field, value) => {
    updateEventInfo({ [field]: value });
  };

  if (!isActive) return null;

  return (
    <div className="fixed left-4 top-20 bottom-4 w-80 bg-white rounded-xl shadow-xl border border-gray-200/50 flex flex-col overflow-hidden z-50">
      {/* Panel Header */}
      <div className="sticky top-0 bg-white px-6 pt-6 pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between text-xl font-medium text-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-blue/10 to-primary-blue/20 flex items-center justify-center">
              <FileText size={20} className="text-primary-blue" />
            </div>
            <span className="tracking-tight">内容编辑</span>
          </div>
          <button
            onClick={() => setCurrentPanel(null)}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="space-y-6 mt-6">
          {/* 基本信息 */}
          <div>
            <div className="text-base font-medium text-gray-700 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-blue"></div>
              基本信息
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">App名称</label>
                <FormField
                  type="text"
                  placeholder="如：微信、支付宝、抖音"
                  maxLength={20}
                  value={state.appInfo.name}
                  onChange={(value) => handleInputChange('name', value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">主标题</label>
                <FormField
                  type="text"
                  placeholder="如：全新升级，体验更流畅"
                  maxLength={50}
                  value={state.appInfo.title}
                  onChange={(value) => handleInputChange('title', value)}
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">副标题</label>
                <FormField
                  type="textarea"
                  placeholder="如：一款让生活更便捷的社交应用"
                  maxLength={100}
                  rows={3}
                  value={state.appInfo.subtitle}
                  onChange={(value) => handleInputChange('subtitle', value)}
                />
              </div>
            </div>
          </div>
          
          {/* 媒体资源 */}
          <div>
            <div className="text-base font-medium text-gray-700 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-blue"></div>
              媒体资源
            </div>
            <input 
              type="file" 
              id="iconUpload" 
              accept="image/*" 
              className="hidden"
              onChange={handleIconUpload}
            />
            <div className="space-y-4">
              <FormField
                type="upload"
                label="选择APP图标"
                onChange={() => document.getElementById('iconUpload').click()}
              >
                <Image size={16} />
              </FormField>
              
              <input 
                type="file" 
                id="screenUpload" 
                accept="image/*" 
                className="hidden"
                onChange={handleScreenUpload}
              />
              <FormField
                type="upload"
                label="选择APP截图"
                onChange={() => document.getElementById('screenUpload').click()}
              >
                <MonitorSpeaker size={16} />
              </FormField>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default ContentPanel;