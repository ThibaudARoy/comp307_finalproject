import React from 'react';
import Button from 'react-bootstrap/Button';
import "./DeleteBoardButton.css"

const DeleteBoardButton = ({ onClick }) => {
  return (
    <Button 
      variant="danger" 
      size="sm" 
      className="deleteBoardButton" 
      onClick={onClick}
    >
         &#x2716;
    </Button>
  );
}

export default DeleteBoardButton;