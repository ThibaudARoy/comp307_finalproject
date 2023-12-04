import './UserBoard.css';
import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import DeleteBoardButton from './DeleteBoardButton';
import DeleteBoardConfirmModal from './DeleteBoardConfirmModal';
import { deleteBoard } from '../backendConnection/BoardsService';
import bird from "../assets/SOCSBird.png";
import crown from "../assets/crown.png";
import { useNavigate } from 'react-router-dom';


//Takes a board as input. Creates a UserBoard component for that board.
function UserBoard({ userInfo, board}){
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const isAdmin = userInfo._id === board.admin;
    const boardId = board._id;

    const navigate = useNavigate();

    const handleBoardClick = (boardId) => {
      navigate(`/board/${boardId}`);
    };
  
    const handleDeleteClick = () => {
      setShowDeleteModal(true);
    };

    const handleConfirmDelete = async (boardId) => {
        try {
            await deleteBoard(boardId);
            console.log('Board deleted');
            window.location.reload();
            setShowDeleteModal(false);
          } catch (error) {
            console.log("Error Deleting Board")
          }
      };
    
      const handleCloseModal = () => {
        setShowDeleteModal(false);
      };

    return (
        <div className="UserBoardButton">
            <Button className="userBoard" onClick={() => handleBoardClick(board._id)}>
            {isAdmin && (
                        <img src={crown} className="crownIcon" alt="Admin" />
                )}
                <img src={bird} className="birdBoard"></img>
                {board.name}
            </Button>
            {isAdmin && (
                <div className="DeleteBoardButton"><DeleteBoardButton onClick={handleDeleteClick}/></div>
                )}
            <DeleteBoardConfirmModal 
                show={showDeleteModal}
                onConfirm={handleConfirmDelete}
                onClose={handleCloseModal}
            />
        </div>
    );
}
export default UserBoard;