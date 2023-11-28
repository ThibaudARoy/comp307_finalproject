import "./AddBoardModal.css"
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

function AddBoardModal({ show, onHide, onSubmit }) {
  const [name, setName] = useState('');
  const [admins, setAdmins] = useState('');
  const [members, setMembers] = useState('');

  const handleSubmit = () => {
    onSubmit({ name, admins, members });
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton className="headerModal">
                <Modal.Title className="titleModal">Create a New Board</Modal.Title>
            </Modal.Header>
      <Modal.Body>
        <form>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Admin</label>
            <div className="adminName"><p>thomas.savage.dug@outlook.com</p></div>
          </div>
          <div className="form-group">
            <label>Members</label>
            <input
              type="text"
              className="form-control"
              value={members}
              onChange={(e) => setMembers(e.target.value)}
            />
          </div>
        </form>
      </Modal.Body>
      <Modal.Footer className="footerModal">
        <Button variant="danger" onClick={handleSubmit} className="submitBoard">
          Create Board
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default AddBoardModal;