import "./Input.css";
import Button from "react-bootstrap/Button";
import sendIcon from "../../assets/send-message-2.png";
import React, { useRef } from "react";
import axios from "axios";
import { isAuthorized } from "../../backendConnection/isAuthorized";

function Input({ boardId, selectedChannel, socket, isSidebarVisible }) {
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
        { content },
        { headers: { Authorization: `${localStorage.getItem("token")}` } }
      );

      const populatedMessage = response.data;

      socket.emit("newMessage", populatedMessage);
      textareaRef.current.value = ""; // Clear the textarea
    } catch (error) {
      isAuthorized(error.response.data);
      console.error("Error:", error.response.data.message);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className={`input ${isSidebarVisible ? "" : "collapsed"}`}>
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
