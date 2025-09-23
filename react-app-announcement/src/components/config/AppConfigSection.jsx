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
      <div className="config-group">
        <div className="config-group-label">基本信息</div>
        <FormField
          type="text"
          placeholder="输入APP名称"
          maxLength={20}
          value={state.appInfo.name}
          onChange={(value) => handleInputChange('name', value)}
          style={{marginBottom: '8px'}}
        />
        <FormField
          type="text"
          placeholder="输入主标题"
          maxLength={50}
          value={state.appInfo.title}
          onChange={(value) => handleInputChange('title', value)}
          style={{marginBottom: '8px'}}
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
      <div className="config-group">
        <div className="config-group-label">媒体资源</div>
        <input 
          type="file" 
          id="iconUpload" 
          accept="image/*" 
          style={{display: 'none'}}
          onChange={handleIconUpload}
        />
        <FormField
          type="upload"
          label="选择APP图标"
          onChange={() => document.getElementById('iconUpload').click()}
          style={{marginBottom: '8px'}}
        >
          <Image size={16} />
        </FormField>
        
        <input 
          type="file" 
          id="screenUpload" 
          accept="image/*" 
          style={{display: 'none'}}
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
      <div className="config-group">
        <div className="config-group-label">下载链接</div>
        <FormField
          type="checkbox"
          label="显示 App Store"
          value={state.downloads.showAppStore}
          onChange={(value) => handleDownloadChange('showAppStore', value)}
          style={{marginBottom: '8px'}}
        />
        <FormField
          type="url"
          placeholder="App Store链接"
          value={state.downloads.appStoreUrl}
          onChange={(value) => handleDownloadChange('appStoreUrl', value)}
          style={{marginBottom: '12px'}}
        />
        
        <FormField
          type="checkbox"
          label="显示 Google Play"
          value={state.downloads.showGooglePlay}
          onChange={(value) => handleDownloadChange('showGooglePlay', value)}
          style={{marginBottom: '8px'}}
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