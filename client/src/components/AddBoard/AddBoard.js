import "./AddBoard.css";
import plus from "../../assets/plus.png";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import AddBoardModal from "../AddBoardModal/AddBoardModal";
import { createBoard } from "../../backendConnection/BoardsService";

function AddBoard({ userInfo, socket }) {
  const [showModal, setShowModal] = useState(false);
  const [boardCreationError, setBoardCreationError] = useState('');

  const handleAddBoardClick = () => {
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };
  const handleBoardCreation = async (formData) => {
    try {
      console.log(formData);
      const newBoard = await createBoard(formData);
      socket.emit("newBoard", newBoard);
      console.log("Board created:", newBoard);
      setShowModal(false);
      setBoardCreationError(''); // Clear any previous errors
    } catch (error) {
      console.error("Failed to create board:", error);
      setBoardCreationError('Failed to create board. Please try again.'); // Set error message if the request fails
    }
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
        userInfo={userInfo}
        boardCreationError={boardCreationError}
      />
    </div>
  );
}
export default AddBoard;
