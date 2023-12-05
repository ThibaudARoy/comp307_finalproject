import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./Sidebar.css";
import icon from "../assets/x_icon.png";
import axios from "axios";

function Sidebar(props) {
  const [channels, setChannels] = useState(props.channels);
  const [notifications, setNotifications] = useState({
    General: 3,
    Random: 0,
    React: 1,
    JavaScript: 0,
  });
  const [newChannel, setNewChannel] = useState("");
  const [show, setShow] = useState(false);
  const [channelToDelete, setChannelToDelete] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

    const handleAddChannel = () => {
        if (newChannel.trim() !== '') {
            axios.post(`/api/boards/${props.boardId}/channels`, {
                name: newChannel,
                members: props.members
              }, {
                headers: { Authorization: `${localStorage.getItem("token")}` }
              })
              .then(response => {
                setChannels([...channels, response.data.newChannel]);
                setNewChannel('');
                handleClose();
              })
              .catch(error => console.error(error));
        }
      };

    const handleDeleteChannel = () => {
        axios.delete(`/api/boards/${props.boardId}/channels/${channelToDelete._id}`, {
          headers: { Authorization: `${localStorage.getItem("token")}` }
        })
        .then(response => {
          setChannels(channels.filter(channel => channel.name !== channelToDelete.name));
          setChannelToDelete(null);
        })
        .catch((error) => console.error(error));
    }
  };

  const handleDeleteChannel = () => {
    axios
      .delete(`/api/boards/${props.boardId}/channels/${channelToDelete._id}`, {
        headers: { Authorization: `${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setChannels(
          channels.filter((channel) => channel.name !== channelToDelete.name)
        );
        setChannelToDelete(null);
      })
      .catch((error) => console.error(error));
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
      .catch((error) => console.error(error));
  }, [props.boardId]);

    return (
        <div className="sidebar">
            <div className="boardName">
                <h2>{props.boardName}</h2>
            </div>
            <ul>
                {channels.map(channel => (
                    <li className={`channel ${props.selectedChannel && props.selectedChannel.name === channel.name ? 'selected-channel' : 'channel-row'}`}  key={channel.name}>                        
                        <div className="channel-row" onClick={() => props.onChannelClick(channel)}>
                            <div className={notifications[channel.name] > 0 ? 'unread' : 'read'}><span className="hash"># </span>{channel.name}</div>
                            <button className='delete-button' onClick={() => {console.log(channel); handleConfirmDelete(channel)}}><img className='x-logo' src={icon}></img></button>
                        </div>
                    </li>
                ))}
            </ul>
            <Button className='add-button' variant="primary" size="sm" onClick={handleShow}>
                <span className="wideScreenBtn">Add Channel</span>
                <span className="mobileBtn">+</span>
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header className="headerModal" closeButton>
                    <Modal.Title className="titleModal">Add a new channel</Modal.Title>
                </Modal.Header>
                <Modal.Body className="channelModal">
                    <label>Channel Name</label>
                    <Form.Control className="modalInput" type="text" placeholder="New channel" value={newChannel} onChange={e => setNewChannel(e.target.value)} />
                </Modal.Body>
                <Modal.Footer className="footerModal">
                    <Button className="submitChannel" variant="danger" onClick={handleAddChannel}>
                        Add Channel
                    </Button>
                </Modal.Footer>
            </Modal>

      <Modal
        show={channelToDelete !== null}
        onHide={() => setChannelToDelete(null)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete{" "}
          <strong>#{channelToDelete ? channelToDelete.name : ""}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setChannelToDelete(null)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleDeleteChannel}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default Sidebar;