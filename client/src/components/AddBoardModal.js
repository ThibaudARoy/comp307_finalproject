import "./AddBoardModal.css"
import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Link } from "react-router-dom";

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
            {/* Need current user's name/email to specify they are the admin */}
            <div className="adminName"><p>CURRENT USER EMAIL/NAME</p></div>
          </div>
          <div className="form-group">
            <label>Members</label>
            {/* User inputs Members' Names/Emails. Then added to board's list in backend*/}
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
        <Link to="/board">
        <Button variant="danger" onClick={handleSubmit} className="submitBoard">
          Create Board
        </Button>
        </Link>
      </Modal.Footer>
    </Modal>
  );
}

export default AddBoardModal;