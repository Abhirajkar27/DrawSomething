import React from "react";
import './Modal.css';
const Modal = ({ showModal, closeModal }) => {
  if (!showModal) return null;

  const handleClose = (e) => {
    if (e.target.classList.contains("modal-background")) {
      closeModal();
    }
  };

  return (
    <div className="modal-background_G6" onClick={handleClose}>
      <div className="modal-container_G6">
        <span>Are you sure you want to give up?</span>
        <p>Giving up will reset the streak</p>
        <div className="modal-buttons_G6">
          <button className="no-button_G6" onClick={closeModal}>
            No
          </button>
          <button className="giveup-button_G6">Give up</button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
