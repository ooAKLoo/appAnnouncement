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
    <div className="confirm-dialog-overlay" id="confirmDialogOverlay">
      <div className="confirm-dialog">
        <div className="confirm-dialog-header">
          <h3>确认删除</h3>
        </div>
        <div className="confirm-dialog-body">
          <p>确定要删除这个作品吗？此操作无法撤销。</p>
        </div>
        <div className="confirm-dialog-footer">
          <button 
            className="confirm-dialog-btn cancel" 
            onClick={closeConfirmDialog}
          >
            取消
          </button>
          <button 
            className="confirm-dialog-btn delete" 
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