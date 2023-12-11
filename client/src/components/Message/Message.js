import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./Message.css";
import dots from "../../assets/dots.png";
import pin from "../../assets/pin.svg"
import { Modal, Button, DropdownButton, Dropdown } from "react-bootstrap";
import { getUserInfo } from "../../backendConnection/AuthService";


function stringToColor(str) {
  if (!str || str.length === 0) {
    return "#000000"; // Return a default color
  }
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += ("00" + value.toString(16)).substr(-2);
  }
  return color;
}

function Message({ boardId, boardAdmin, channelId, socket, isSidebarVisible }) {
  const [messages, setMessages] = useState([]);
  const messagesEndRef = React.createRef();
  const [show, setShow] = useState(false);
  const [messageId, setMessageId] = useState(null);
  const [userInfo, setUserInfo] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = (messageId) => {
    setMessageId(messageId);
    setShow(true);
  };

  useEffect(() => {
    const fetchMessages = async () => {
      if (!channelId) {
        console.error("No channel selected");
        return;
      }

      try {
        const response = await axios.get(
          `/api/boards/${boardId}/channels/${channelId}/messages`,
          {
            headers: { Authorization: `${localStorage.getItem("token")}` },
          }
        );
        setMessages(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchMessages();
  }, [boardId, channelId]);

  useEffect(() => {
    if (socket) {
      const newMessageHandler = (newMessage) => {
        if (newMessage.channel === channelId) {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      };
      socket.on("newMessage", newMessageHandler);

      return () => {
        socket.off("newMessage", newMessageHandler);
      };
    }
  }, [socket, channelId]);

  useEffect(() => {
    if (socket) {
      const messageDeletedHandler = (deletedMessageId) => {
        setMessages((messages) =>
          messages.filter((message) => message._id !== deletedMessageId)
        );
      };
      socket.on("messageDeleted", messageDeletedHandler);

      return () => {
        socket.off("messageDeleted", messageDeletedHandler);
      };
    }
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `/api/boards/${boardId}/channels/${channelId}/messages/${messageId}`,
        {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        }
      );

      if (response.status !== 200) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(response.data);

      socket.emit("deleteMessage", { channelId, messageId });

      handleClose();
    } catch (error) {
      console.error("An error occurred while deleting the message:", error);
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const info = await getUserInfo();
        setUserInfo(info);
      } catch (error) {
        console.error("An error occurred while fetching the user info:", error);
      }
    };

    fetchUserInfo();
  }, []);

  const handlePinUnpin = async (messageId, shouldPin) => {
    try {
      const userId = userInfo._id;
      await axios.patch(
        `/api/boards/${boardId}/channels/${channelId}/messages/${messageId}`,
        { pinned: shouldPin, pinnedBy: shouldPin ? userId : null },
        { headers: { Authorization: `${localStorage.getItem("token")}` } }
      );

      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg._id === messageId
            ? {
                ...msg,
                pinned: shouldPin,
                pinnedBy: shouldPin ? userId : null,
              }
            : msg
        )
      );
    } catch (error) {
      console.error("Error updating pin status:", error);
    }
  };

  return (
    <div className={`message ${isSidebarVisible ? "" : "collapsed"}`}>
      {messages.map((message, index) => {
        const currentDate = new Date(message.timestamp).toDateString();
        const previousDate =
          index > 0
            ? new Date(messages[index - 1].timestamp).toDateString()
            : null;

        return (
          <div key={index}>
            {(index === 0 || currentDate !== previousDate) && (
              <div className="date-separator">
                <hr />
                <span>{currentDate}</span>
                <hr />
              </div>
            )}
            <div
              className={`individual-message ${
                message.pinned ? "pinned-message" : ""
              }`}
            >
              {/* {message.pinned && message.pinnedBy && (
                <div className="pinned-info">
                  Pinned by: {message.pinnedBy.firstName}{" "}
                  {message.pinnedBy.lastName}
                </div>
              )} */}
              <div>
                {(index === 0 ||
                  message.creator._id !== messages[index - 1].creator._id ||
                  currentDate !== previousDate) && (
                  <p className="name-time">
                    <span
                      className="sender-name"
                      style={{ color: stringToColor(message.creator._id) }}
                    >
                      {message.creator.firstName} <span className="lastName" >{message.creator.lastName}</span>
                    </span>
                    <span className="time-stamp">
                      {new Date(message.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </p>
                )}
                <p className="message-content">{message.content}</p>
              </div>
              <DropdownButton
                className="dot-button"
                title={<img className="dots" src={dots} />}
                id="dropdown-basic-button"
                variant="secondary"
              >
                <Dropdown.Item
                  onClick={() => handlePinUnpin(message._id, !message.pinned)}
                  className="pin-message"
                >
                  {message.pinned ? "Unpin" : "Pin"}
                </Dropdown.Item>

                {((userInfo && userInfo._id === message.creator._id) ||
                  userInfo._id === boardAdmin) && (
                  <Dropdown.Item
                    onClick={() => handleShow(message._id)}
                    className="delete-message"
                  >
                    Delete
                  </Dropdown.Item>
                )}
              </DropdownButton>
            </div>
          </div>
        );
      })}
      <div ref={messagesEndRef} />

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton className="headerModal">
          <Modal.Title className="titleModal">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bodyModal">Are you sure you want to delete this message?</Modal.Body>
        <Modal.Footer className="footerModal2">
          <Button className="CancelButton" variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button className="DeleteButton" variant="primary" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Message;
