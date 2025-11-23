
import React from 'react';
import '../style/ConfirmDialog.css';

interface ConfirmDialogProps {
  visible: boolean;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  message,
  onConfirm,
  onCancel
}) => {
  if (!visible) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-modal">
        <p className="confirm-message">{message}</p>
        <div className="confirm-actions">
          <button className="btn btn-confirm" onClick={onConfirm}>
            Yes
          </button>
          <button className="btn btn-cancel" onClick={onCancel}>
            No
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;