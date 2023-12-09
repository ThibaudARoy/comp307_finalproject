import "./Input.css";
import Button from "react-bootstrap/Button";
import sendIcon from "../assets/send-message-2.png";
import React, { useRef } from "react";
import axios from "axios";

function Input({ boardId, selectedChannel, socket }) {
  const textareaRef = useRef();

  const sendMessage = async () => {
    const content = textareaRef.current.value;

    if (!selectedChannel || !socket) {
      console.error("No channel selected or socket not connected");
      return;
    }

    try {
      const response = await axios.post(
        `/api/boards/${boardId}/channels/${selectedChannel._id}/messages`,
        {
          content,
        },
        {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        }
      );

      console.log("New message:", response.data);
      textareaRef.current.value = ""; // Clear the textarea
    } catch (error) {
      console.error("Error:", error.response.data.message);
    }
  };

  return (
    <div className="input">
      <textarea
        ref={textareaRef}
        placeholder="Type a message..."
        onKeyDown={handleKeyDown}
      ></textarea>
      <Button onClick={sendMessage} variant="primary" className="button">
        <img src={sendIcon} className="sendImg"></img>
      </Button>
    </div>
  );
}

export default Input;
