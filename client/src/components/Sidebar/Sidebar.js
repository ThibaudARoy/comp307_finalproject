import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import icon from "../../assets/x_icon.png";
import axios from "axios";
import users from "../../assets/manageusers.svg"
import { getUserInfo } from "../../backendConnection/AuthService"
import ManageMembers from "../ManageMembers/ManageMembers"
import { thisBoardMembers } from '../../backendConnection/MemberService';
import { isAuthorized } from "../../backendConnection/isAuthorized";

function Sidebar(props) {
  const [channels, setChannels] = useState(props.channels);
  const [newChannel, setNewChannel] = useState("");
  const [show, setShow] = useState(false);
  const [channelToDelete, setChannelToDelete] = useState(null);
  const socket = props.socket;
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showManageMembersModal, setShowManageMembersModal] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [boardMembers, setBoardMembers] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState(null);

  const [addError, setAddError] = useState('');
  
  useEffect(() => {
    getUserInfo()
      .then((info) => {
        setUserInfo(info);
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
      });
    }, []);
  const isAdmin = userInfo && userInfo._id === props.boardAdmin;
  useEffect(() => {
    thisBoardMembers(props.boardId)
      .then((members) => {
        setBoardMembers(members);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, []);

  const handleClose = () => {
      setShow(false);
      setAddError(''); 
      setNewChannel(''); 
    };
  const handleShow = () => setShow(true);

  const handleManageMembersClick = () => {
    setShowManageMembersModal(true);
  };

  const handleAddChannel = () => {
    const newChannelName = newChannel.trim();
    
    // Check if the input field is empty
    if (!newChannelName) {
      setAddError('Channel name cannot be empty.');
      return;
    }
  
    // Check if channel already exists (case insensitive)
    const channelExists = channels.some(
      (channel) => channel.name.toLowerCase() === newChannelName.toLowerCase()
    );
  
    if (channelExists) {
      setAddError(`A channel with the name '${newChannelName}' already exists.`);
      return;
    }
  
    // Clear any existing error message
    setAddError('');
  
    // Add the new channel
    axios.post(`/api/boards/${props.boardId}/channels`, {
      name: newChannelName,
      members: props.members
    }, {
      headers: { Authorization: `${localStorage.getItem("token")}` }
    })
    .then(response => {
      const newChannel = response.data.newChannel;
      socket.emit("newChannel", {channelToAdd: response.data.newChannel, boardId: props.boardId});
      setNewChannel(''); // Optionally, reset the input field after adding the channel
      selectChannel(newChannel); // Select the new channel
    })
    .catch(error => {
      isAuthorized(error.response.data);
      console.error(error);
      setAddError('Error occurred while adding the channel.'); // Handle potential server-side error
    });
  };

  const handleDeleteChannel = () => {
    console.log("channel to delete: " +channelToDelete._id);
    axios
      .delete(`/api/boards/${props.boardId}/channels/${channelToDelete._id}`, {
        headers: { Authorization: `${localStorage.getItem("token")}` },
      })
      .then((response) => {
        console.log("channels before: " + channels);
        setChannels(
          channels.filter((channel) => channel.name !== channelToDelete.name)
        );
        socket.emit("deleteChannel", {channelToDelete: channelToDelete._id, boardId: props.boardId});
        setChannelToDelete(null);
        props.onChannelClick(null);
        console.log("channels after: " + channels)
      })
      .catch((error) => {
        isAuthorized(error.response.data);
        console.error(error)
        });
    };

  const handleConfirmDelete = (channel) => {
    setChannelToDelete(channel);
  };

  useEffect(() => {
    axios
      .get(`/api/boards/${props.boardId}/channels`, {
        headers: { Authorization: `${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setChannels(response.data);
      })
      .catch((error) => {
        isAuthorized(error.response.data);
        console.error(error)
      });
  }, [props.boardId]);

  useEffect(() => {
    if (socket) {
      const newChannelHandler = (newChannel) => {
        console.log("new channel " + newChannel);
        setChannels((prevChannels) => [...prevChannels, newChannel]);
        setNewChannel('');
        handleClose();
        socket.emit("joinChannel", newChannel._id);
        selectChannel(newChannel); // Select the new channel
        return () => {
            socket.emit("leaveChannel", newChannel._id) 
          }
  
      };

      const deleteChannelHandler = (channelDel) => {
        console.log("delete channel " + channelDel);
        console.log("channels: " + channels);
        setChannels(
          channels.filter((channel) => channel._id !== channelDel)
        );
      };

      socket.on("newChannel", newChannelHandler);
      socket.on("deleteChannel", deleteChannelHandler);

      return () => {
        socket.off("newChannel", newChannelHandler);
        socket.off("deleteChannel", deleteChannelHandler);
      };
    }
  }, [props.boardId, socket, channels]);

  const updateBoardMembers = (newBoardMembers) => {
    setBoardMembers(newBoardMembers);
  };

  const selectChannel = (channel) => {
    setSelectedChannel(channel);
    props.onChannelClick(channel);
  };

  return (
    <div className={`sidebar ${props.isSidebarVisible ? "" : "collapsed"}`}>
      <div className="boardName">
        <h2>{props.boardName}</h2>
      </div>
      <div className="channel-list">
      <ul>
        {channels.map((channel) => (
          <li
            className={`channel ${
              selectedChannel &&
              selectedChannel.name === channel.name
                ? "selected-channel"
                : "channel-row"
            }`}
            key={channel.name}
          >
            <div
              className="channel-row"
              onClick={() => selectChannel(channel)}
            >
              <div>
                <span className="hash"># </span>
                {channel.name}
              </div>
              {isAdmin && (
                <button
                  className="delete-button"
                  onClick={() => {
                    //console.log(channel);
                    handleConfirmDelete(channel);
                  }}
                >
                  <img className="x-logo" src={icon}></img>
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
        {isAdmin && (
          <Button
            className="add-button"
            variant="primary"
            size="sm"
            onClick={handleShow}
          >
            <span className="wideScreenBtn">Add Channel</span>
            <span className="mobileBtn">+</span>
          </Button>
        )}
    </div>
    <Button
            className="managemembers-button"
            variant="primary"
            size="sm"
            onClick={handleManageMembersClick} 
          >
            <span className="wideScreenBtn">Members</span>
            <img src={users} className="usersIcon"></img>
            
          </Button>
          <Modal show={show} onHide={handleClose}>
  <Modal.Header className="headerModal" closeButton>
    <Modal.Title className="titleModal">Add a new channel</Modal.Title>
  </Modal.Header>
  <Modal.Body className="channelModal">
    <label>Channel Name</label>
    <Form.Control
      className="modalInput"
      type="text"
      placeholder="New channel"
      value={newChannel}
      onChange={(e) => {
        setNewChannel(e.target.value);
        setAddError(''); 
      }}
    />
    {addError && <div className="error-message">{addError}</div>}
  </Modal.Body>
  <Modal.Footer className="footerModal">
    <Button
      className="submitChannel"
      variant="danger"
      onClick={handleAddChannel}
    >
      Add Channel
    </Button>
  </Modal.Footer>
</Modal>

      <Modal
        show={channelToDelete !== null}
        onHide={() => setChannelToDelete(null)}
      >
        <Modal.Header className="headerModal" closeButton>
          <Modal.Title className="titleModal">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body className="bodyModal">
          Are you sure you want to delete{" "}
          <strong>#{channelToDelete ? channelToDelete.name : ""}</strong>?
          <br></br>
          <span className="dataText">All data associated to it will be lost.</span>
        </Modal.Body>
        <Modal.Footer className="footerModal2">
          <Button className="CancelButton" variant="secondary" onClick={() => setChannelToDelete(null)}>
            Cancel
          </Button>
          <Button className="DeleteButton" variant="primary" onClick={handleDeleteChannel}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <ManageMembers
        show={showManageMembersModal}
        onHide={() => setShowManageMembersModal(false)}
        userInfo = {userInfo}
        boardId = {props.boardId}
        boardMembers = {boardMembers}
        updateBoardMembers={updateBoardMembers}
        isAdmin = {isAdmin}
      />
    </div>
  );
}

export default Sidebar;
