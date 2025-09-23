import React from 'react';
import { Image, MonitorSpeaker } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useUpload } from '../../hooks/useUpload';
import ConfigPanel from '../common/ConfigPanel';
import FormField from '../common/FormField';

function AppConfigSection({ isActive }) {
  const { state, updateAppInfo, updateDownloads } = useApp();
  const { handleIconUpload, handleScreenUpload } = useUpload();

  const handleInputChange = (field, value) => {
    updateAppInfo({ [field]: value });
  };

  const handleDownloadChange = (field, value) => {
    updateDownloads({ [field]: value });
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
      
      {/* 下载链接 */}
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
    </ConfigPanel>
  );
}

export default AppConfigSection;