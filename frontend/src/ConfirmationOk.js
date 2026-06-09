import React from 'react';
import './css/ConfirmationOk.css';

function ConfirmationOk({ message, onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <button className="ok-btn" onClick={onClose}>OK</button>
      </div>
    </div>
  );
}

export default ConfirmationOk;
