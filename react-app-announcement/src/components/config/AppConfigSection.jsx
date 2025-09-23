import React from 'react';
import { Image, MonitorSpeaker, Plus, Trash2, GripVertical } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useUpload } from '../../hooks/useUpload';
import { getContentTypesForTheme } from '../../data/templateConfig';
import ConfigPanel from '../common/ConfigPanel';
import FormField from '../common/FormField';

function AppConfigSection({ isActive }) {
  const { state, updateAppInfo, updateDownloads, updateFeatures, updateEventInfo } = useApp();
  const { handleIconUpload, handleScreenUpload } = useUpload();
  
  // 获取当前主题需要的内容类型
  const contentTypes = getContentTypesForTheme(state.currentTheme || 'launch');

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

  return (
    <ConfigPanel type="app" isActive={isActive}>
      {/* 基本信息 */}
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-600 mb-4">基本信息</div>
        <FormField
          type="text"
          placeholder="输入APP名称"
          maxLength={20}
          value={state.appInfo.name}
          onChange={(value) => handleInputChange('name', value)}
          className="mb-2"
        />
        <FormField
          type="text"
          placeholder="输入主标题"
          maxLength={50}
          value={state.appInfo.title}
          onChange={(value) => handleInputChange('title', value)}
          className="mb-2"
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
      
      {/* 媒体资源 */}
      <div className="mb-6">
        <div className="text-sm font-medium text-gray-600 mb-4">媒体资源</div>
        <input 
          type="file" 
          id="iconUpload" 
          accept="image/*" 
          className="hidden"
          onChange={handleIconUpload}
        />
        <FormField
          type="upload"
          label="选择APP图标"
          onChange={() => document.getElementById('iconUpload').click()}
          className="mb-2"
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
      
      {/* 功能列表 - 只在功能介绍主题显示 */}
      {contentTypes.includes('features') && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm font-medium text-gray-600">功能列表</div>
            <button
              onClick={handleAddFeature}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors"
            >
              <Plus size={16} />
              添加功能
            </button>
          </div>

          <div className="space-y-4">
            {state.features.map((feature, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-start gap-3 mb-3">
                  <button
                    className="mt-1 text-gray-400 hover:text-gray-600 cursor-move"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    <GripVertical size={20} />
                  </button>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-3">
                      <FormField
                        type="text"
                        label="图标"
                        value={feature.icon}
                        onChange={(value) => handleFeatureChange(index, 'icon', value)}
                        className="w-24"
                        placeholder="✨"
                      />
                      <FormField
                        type="text"
                        label="功能名称"
                        value={feature.title}
                        onChange={(value) => handleFeatureChange(index, 'title', value)}
                        className="flex-1"
                      />
                    </div>
                    
                    <FormField
                      type="textarea"
                      label="功能描述"
                      value={feature.description}
                      onChange={(value) => handleFeatureChange(index, 'description', value)}
                      className="w-full"
                      rows={2}
                    />
                  </div>

                  <button
                    onClick={() => handleRemoveFeature(index)}
                    disabled={state.features.length <= 1}
                    className="p-1 text-red-400 hover:text-red-600 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {state.features.length >= 5 && (
            <div className="mt-4 text-sm text-gray-500 text-center">
              建议最多添加5个功能点，以保持页面简洁
            </div>
          )}
        </div>
      )}
      
      {/* 活动信息 - 只在运营活动主题显示 */}
      {contentTypes.includes('event') && (
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-600 mb-4">活动信息</div>
          
          <div className="space-y-4">
            <FormField
              type="text"
              label="活动标题"
              value={state.eventInfo.eventTitle}
              onChange={(value) => handleEventInfoChange('eventTitle', value)}
              placeholder="例如：限时优惠、周年庆典"
            />

            <FormField
              type="textarea"
              label="活动描述"
              value={state.eventInfo.eventDescription}
              onChange={(value) => handleEventInfoChange('eventDescription', value)}
              placeholder="详细描述活动内容和亮点"
              rows={3}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                type="text"
                label="折扣力度"
                value={state.eventInfo.discount}
                onChange={(value) => handleEventInfoChange('discount', value)}
                placeholder="例如：50%"
              />

              <FormField
                type="date"
                label="截止日期"
                value={state.eventInfo.endDate}
                onChange={(value) => handleEventInfoChange('endDate', value)}
              />
            </div>

            <FormField
              type="text"
              label="优惠码"
              value={state.eventInfo.promoCode}
              onChange={(value) => handleEventInfoChange('promoCode', value)}
              placeholder="例如：SPECIAL2024"
              className="font-mono"
            />
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm font-medium text-blue-900 mb-2">💡 设计建议</div>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 节日主题：适合春节、圣诞等节日营销</li>
              <li>• 优惠活动：突出折扣力度，吸引用户</li>
              <li>• 周年庆典：展示成就，感恩回馈</li>
            </ul>
          </div>
        </div>
      )}
      
      {/* 下载链接 - 所有主题都显示 */}
      {contentTypes.includes('downloads') && (
        <div className="mb-6">
          <div className="text-sm font-medium text-gray-600 mb-4">下载链接</div>
          <FormField
            type="checkbox"
            label="显示 App Store"
            value={state.downloads.showAppStore}
            onChange={(value) => handleDownloadChange('showAppStore', value)}
            className="mb-2"
          />
          <FormField
            type="url"
            placeholder="App Store链接"
            value={state.downloads.appStoreUrl}
            onChange={(value) => handleDownloadChange('appStoreUrl', value)}
            className="mb-3"
          />
          
          <FormField
            type="checkbox"
            label="显示 Google Play"
            value={state.downloads.showGooglePlay}
            onChange={(value) => handleDownloadChange('showGooglePlay', value)}
            className="mb-2"
          />
          <FormField
            type="url"
            placeholder="Google Play链接"
            value={state.downloads.googlePlayUrl}
            onChange={(value) => handleDownloadChange('googlePlayUrl', value)}
          />
        </div>
      )}
    </ConfigPanel>
  );
}

export default AppConfigSection;