import React from "react";
import "./Topbar.css";
import Button from "react-bootstrap/Button";
import SearchBar from "../SearchBar/SearchBar";
import { useNavigate } from "react-router-dom";
import bird from "../../assets/SOCSBird_white.png";
import back from "../../assets/arrow_back.png";

function Topbar({ boardName, boardId }) {
  const navigate = useNavigate();
  const handleSwitchClick = () => {
    navigate("/select");
  };
  return (
    <div className="topbar">
      <div className="btnContainer">
        <Button
          variant="danger"
          className="switch-button"
          onClick={handleSwitchClick}
        >
          <img className="bird" src={bird}></img>
          <img className="back" src={back}></img>
          <div className="switchbtntext">← Your Boards</div>
        </Button>
      </div>
      <div className="search-bar">
        <SearchBar
        boardName={boardName}
        boardId={boardId}></SearchBar>
      </div>
    </div>
  );
}

export default Topbar;
