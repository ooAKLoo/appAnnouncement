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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" id="saveDialogOverlay">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">保存作品</h3>
          <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors duration-200" onClick={handleClose}>
            <X size={16} className="text-gray-600" />
          </button>
        </div>
        <div className="p-6">
          <div className="mb-6">
            <label htmlFor="projectNameInput" className="block text-sm font-medium text-gray-700 mb-2">作品名称</label>
            <input 
              type="text" 
              id="projectNameInput" 
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
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
          <div className="">
            <div className="text-sm font-medium text-gray-700 mb-3">预览</div>
            <div className="border border-gray-200 rounded-lg p-4 bg-gray-50" id="savePreviewContent">
              <div className="relative bg-white rounded-lg p-4 shadow-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-lg font-medium text-gray-600">
                    {state.appInfo.iconImage ? (
                      <img src={state.appInfo.iconImage} alt="Icon" className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      state.appInfo.icon
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-800 truncate">{state.appInfo.name}</div>
                    <div className="text-sm text-gray-600 truncate">{state.appInfo.title}</div>
                  </div>
                </div>
                <div 
                  className="absolute inset-0 rounded-lg opacity-10 -z-10"
                  style={{
                    background: `linear-gradient(135deg, ${state.design.bgColor} 0%, ${state.design.gradientColor} 100%)`
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200" onClick={handleClose}>
            取消
          </button>
          <button className="px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/90 transition-colors duration-200" onClick={handleSave}>
            保存
          </button>
        </div>
      </div>
    </div>
  );
}

export default SaveDialog;