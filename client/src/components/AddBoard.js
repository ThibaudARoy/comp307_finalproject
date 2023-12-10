import "./AddBoard.css";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import AddBoardModal from "./AddBoardModal";
import plus from "../assets/plus.png";
import { createBoard } from "../backendConnection/BoardsService";

function AddBoard({ userInfo, socket }) {
  const [showModal, setShowModal] = useState(false);

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
      // Additional actions on success (e.g., redirect or state update)
    } catch (error) {
      console.error("Failed to create board:", error);
      // Handle error (e.g., showing error message to user)
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
      />
    </div>
  );
}
export default AddBoard;
