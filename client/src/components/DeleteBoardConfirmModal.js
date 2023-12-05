import React from 'react';
import "./DeleteBoardConfirmModal.css"
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function DeleteBoardConfirmModal({ show, onClose, onConfirm }) {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton className="headerModal">
        <Modal.Title className="titleModal">Delete Confirmation</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="bodyModal">
            Are you sure you want to delete this Board?
            <br></br> 
            All data associated to it will be lost.
        </div>
      </Modal.Body>
      <Modal.Footer className="footerModal2">
        <Button className="CancelButton" variant="secondary" onClick={onClose}>
          Cancel
        </Button>
        <Button className="DeleteButton" variant="primary" onClick={onConfirm}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteBoardConfirmModal;