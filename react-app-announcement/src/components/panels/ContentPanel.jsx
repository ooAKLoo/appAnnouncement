import React from 'react';
import { Image, MonitorSpeaker, Plus, Trash2, GripVertical, FileText, X, Sparkles, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useUpload } from '../../hooks/useUpload';
import FormField from '../common/FormField';
import OptionalContentSection from '../common/OptionalContentSection';

function ContentPanel({ isActive }) {
  const { state, updateAppInfo, updateDownloads, updateFeatures, updateEventInfo, updateContentStyle, toggleContentSection, toggleConfigPanel } = useApp();
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
    <div className="fixed left-4 top-20 bottom-4 w-80 bg-white rounded-xl shadow-xl border border-gray-200/50 flex flex-col overflow-hidden">
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
            className="w-8 h-8 bg-white/80 hover:bg-gray-100 rounded-full cursor-pointer flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all duration-300 hover:shadow-md hover:scale-105" 
            onClick={toggleConfigPanel}
          >
            <X size={18} />
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
              <FormField
                type="text"
                placeholder="输入APP名称"
                maxLength={20}
                value={state.appInfo.name}
                onChange={(value) => handleInputChange('name', value)}
              />
              <FormField
                type="text"
                placeholder="输入主标题"
                maxLength={50}
                value={state.appInfo.title}
                onChange={(value) => handleInputChange('title', value)}
              />
              <FormField
                type="textarea"
                placeholder="输入APP描述"
                maxLength={100}
                rows={3}
                value={state.appInfo.subtitle}
                onChange={(value) => handleInputChange('subtitle', value)}
              />
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
          
          {/* 功能列表 - 可选 */}
          <OptionalContentSection
            title="功能列表"
            icon={<Sparkles size={20} className="text-blue-500" />}
            description="展示应用的核心功能特性"
            isVisible={state.contentSections.features}
            onToggle={() => toggleContentSection('features')}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">
                展示应用的核心功能特性
              </div>
              <button
                onClick={handleAddFeature}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm bg-gradient-to-r from-primary-blue to-primary-blue/90 text-white rounded-xl hover:shadow-md hover:scale-105 transition-all duration-300"
              >
                <Plus size={16} />
                添加功能
              </button>
            </div>

            <div className="space-y-4">
              {state.features.map((feature, index) => (
                <div key={index} className="p-5 bg-white/80 backdrop-blur-sm rounded-xl border border-gray-100 hover:shadow-sm transition-all duration-300">
                  <div className="flex items-start gap-3 mb-3">
                    <button
                      className="mt-1 text-gray-400 hover:text-gray-600 cursor-move"
                      onMouseDown={(e) => e.preventDefault()}
                    >
                      <GripVertical size={20} />
                    </button>
                    <div className="flex-1 space-y-3">
                      <FormField
                        type="text"
                        placeholder="功能图标 (emoji)"
                        value={feature.icon}
                        maxLength={2}
                        onChange={(value) => handleFeatureChange(index, 'icon', value)}
                      />
                      <FormField
                        type="text"
                        placeholder="功能标题"
                        value={feature.title}
                        maxLength={30}
                        onChange={(value) => handleFeatureChange(index, 'title', value)}
                      />
                      <FormField
                        type="textarea"
                        placeholder="功能描述"
                        value={feature.description}
                        rows={2}
                        maxLength={80}
                        onChange={(value) => handleFeatureChange(index, 'description', value)}
                      />
                    </div>
                    <button
                      onClick={() => handleRemoveFeature(index)}
                      className="mt-1 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </OptionalContentSection>
          
          {/* 活动信息 - 可选 */}
          <OptionalContentSection
            title="活动信息"
            icon={<Calendar size={20} className="text-green-500" />}
            description="添加促销活动、优惠信息"
            isVisible={state.contentSections.event}
            onToggle={() => toggleContentSection('event')}
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  type="text"
                  placeholder="折扣力度 (如 50%)"
                  value={state.eventInfo.discount}
                  onChange={(value) => handleEventInfoChange('discount', value)}
                />
                <FormField
                  type="date"
                  placeholder="结束日期"
                  value={state.eventInfo.endDate}
                  onChange={(value) => handleEventInfoChange('endDate', value)}
                />
              </div>
              <FormField
                type="text"
                placeholder="优惠码"
                value={state.eventInfo.promoCode}
                onChange={(value) => handleEventInfoChange('promoCode', value)}
              />
              <FormField
                type="text"
                placeholder="活动标题"
                value={state.eventInfo.eventTitle}
                onChange={(value) => handleEventInfoChange('eventTitle', value)}
              />
              <FormField
                type="textarea"
                placeholder="活动描述"
                value={state.eventInfo.eventDescription}
                rows={3}
                onChange={(value) => handleEventInfoChange('eventDescription', value)}
              />
            </div>
          </OptionalContentSection>

          {/* 下载按钮显示控制 */}
          <div>
            <div className="text-base font-medium text-gray-700 mb-4 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary-blue"></div>
              下载按钮
            </div>


            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="showAppStore"
                  checked={state.downloads.showAppStore}
                  onChange={(e) => handleDownloadChange('showAppStore', e.target.checked)}
                  className="w-4 h-4 text-primary-blue border-gray-300 rounded focus:ring-primary-blue"
                />
                <label htmlFor="showAppStore" className="flex-1 text-sm font-medium text-gray-700">
                  显示 App Store 按钮
                </label>
              </div>

              <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                <input
                  type="checkbox"
                  id="showGooglePlay"
                  checked={state.downloads.showGooglePlay}
                  onChange={(e) => handleDownloadChange('showGooglePlay', e.target.checked)}
                  className="w-4 h-4 text-primary-blue border-gray-300 rounded focus:ring-primary-blue"
                />
                <label htmlFor="showGooglePlay" className="flex-1 text-sm font-medium text-gray-700">
                  显示 Google Play 按钮
                </label>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ContentPanel;