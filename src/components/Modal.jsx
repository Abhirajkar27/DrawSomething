import React from "react";
import './Modal.css';
import conf_giveUp from '../assets/img/Give_Up_conf.png';
import no_btn from '../assets/img/No_btn.png';
const Modal = ({ showModal, closeModal }) => {
  if (!showModal) return null;

  const handleClose = (e) => {
    if (e.target.classList.contains("modal-background_G6")) {
      closeModal();
    }
  };

  

  return (
    <div className="modal-background_G6" onClick={handleClose}>
      <div className="modal-container_G6">
        <span>Are you sure you want to give up?</span>
        <p>Giving up will reset the streak</p>
        <div className="modal-buttons_G6">
          <img src={no_btn} onClick={closeModal} className="modal_btn_g6"/>
          <img src={conf_giveUp} className="modal_btn_g6"/>
        </div>
      </div>
    </div>
  );
};

export default Modal;
