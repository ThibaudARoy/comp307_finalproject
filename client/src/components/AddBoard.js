import './AddBoard.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import AddBoardModal from './AddBoardModal';
import plus from '../assets/plus.png';

function AddBoard(){
    const [showModal, setShowModal] = useState(false);

    const handleAddBoardClick = () => {
      setShowModal(true);
    };
  
    const handleModalClose = () => {
      setShowModal(false);
    };
    const handleBoardCreation = (formData) => {
        // Handle board creation here by making an API request to your backend
        // with the formData (name, admins, members)
        console.log(formData);
    
        // Close the modal after handling board creation
        setShowModal(false);
      };
    return (
        <div className="AddBoardButton">
            <Button className="addBoard" onClick={handleAddBoardClick} alt="Plus">
            <div className="addBoardContent">
                <img src={plus} className="plusSign"></img>
                <p>New Board</p>
            </div>
            </Button>
            <AddBoardModal
                show={showModal}
                onHide={handleModalClose}
                onSubmit={handleBoardCreation}
      />
        </div>
    );
}
export default AddBoard;