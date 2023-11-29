import React from 'react';
import "./LogoutConfirmModal.css"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function LogoutConfirmModal({ show, onClose, onConfirm }) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton className="headerModal">
        <Modal.Title className="titleModal">Logout Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="bodyModal">
            Are you sure you want to logout?
        </div>
      </Modal.Body>
      <Modal.Footer className="footerModal2">
        <Button className="CancelButton" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button className="LogoutButton" variant="primary" onClick={onConfirm}>
          Logout
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default LogoutConfirmModal;