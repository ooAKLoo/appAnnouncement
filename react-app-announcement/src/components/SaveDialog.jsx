import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useProjects } from '../hooks/useProjects';

function SaveDialog() {
  const { state, closeSaveDialog } = useApp();
  const { saveProject } = useProjects();
  const [projectName, setProjectName] = useState('');

  const handleSave = () => {
    if (!projectName.trim()) {
      alert('请输入作品名称');
      return;
    }
    
    saveProject(projectName.trim());
    setProjectName('');
    closeSaveDialog();
  };

  const handleClose = () => {
    setProjectName('');
    closeSaveDialog();
  };

  if (!state.saveDialogOpen) return null;

  return (
    <div className="save-dialog-overlay" id="saveDialogOverlay">
      <div className="save-dialog">
        <div className="save-dialog-header">
          <h3>保存作品</h3>
          <button className="save-dialog-close" onClick={handleClose}>
            <X size={16} />
          </button>
        </div>
        <div className="save-dialog-body">
          <div className="save-dialog-field">
            <label htmlFor="projectNameInput">作品名称</label>
            <input 
              type="text" 
              id="projectNameInput" 
              placeholder="输入作品名称" 
              maxLength="50"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSave();
                }
              }}
            />
          </div>
          <div className="save-dialog-preview">
            <div className="save-preview-label">预览</div>
            <div className="save-preview-content" id="savePreviewContent">
              <div className="preview-thumbnail">
                <div className="preview-app-info">
                  <div className="preview-icon">
                    {state.appInfo.iconImage ? (
                      <img src={state.appInfo.iconImage} alt="Icon" />
                    ) : (
                      state.appInfo.icon
                    )}
                  </div>
                  <div className="preview-details">
                    <div className="preview-name">{state.appInfo.name}</div>
                    <div className="preview-title">{state.appInfo.title}</div>
                  </div>
                </div>
                <div 
                  className="preview-bg"
                  style={{
                    background: `linear-gradient(135deg, ${state.design.bgColor} 0%, ${state.design.gradientColor} 100%)`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="save-dialog-footer">
          <button className="save-dialog-btn cancel" onClick={handleClose}>
            取消
          </button>
          <button className="save-dialog-btn save" onClick={handleSave}>
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveDialog;