import React from 'react';
import { useApp } from '../context/AppContext';
import { useProjects } from '../hooks/useProjects';

function ConfirmDialog() {
  const { state, closeConfirmDialog } = useApp();
  const { deleteProjectById } = useProjects();

  const handleConfirm = () => {
    if (state.projectToDelete) {
      deleteProjectById(state.projectToDelete);
    }
    closeConfirmDialog();
  };

  if (!state.confirmDialogOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" id="confirmDialogOverlay">
      <div className="bg-white rounded-xl shadow-xl max-w-sm w-full mx-4">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">确认删除</h3>
        </div>
        <div className="p-6">
          <p className="text-gray-600">确定要删除这个作品吗？此操作无法撤销。</p>
        </div>
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button 
            className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors duration-200" 
            onClick={closeConfirmDialog}
          >
            取消
          </button>
          <button 
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200" 
            onClick={handleConfirm}
          >
            删除
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;