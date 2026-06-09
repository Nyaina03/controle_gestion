import React from 'react';
import './css/ConfirmationModal.css';

function ConfirmationModal({ message, showButtons = true, onConfirm, onCancel, onOk }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="button-group">
          {showButtons ? (
            <>
              <button onClick={onConfirm} className="confirm-btn">Confirmer</button>
              <button onClick={onCancel} className="cancel-btn">Annuler</button>
            </>
          ) : (
            <button onClick={onOk} className="ok-btn">OK</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;
