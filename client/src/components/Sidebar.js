import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import {Link} from "react-router-dom";
import './Sidebar.css';

function Sidebar() {
    const [channels, setChannels] = useState(['General', 'Random', 'React', 'JavaScript']);
    const [notifications, setNotifications] = useState({General: 3, Random: 0, React: 1, JavaScript: 0});
    const [newChannel, setNewChannel] = useState('');
    const [show, setShow] = useState(false);
    const [channelToDelete, setChannelToDelete] = useState(null);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleAddChannel = () => {
        if (newChannel.trim() !== '') {
            setChannels([...channels, newChannel]);
            setNewChannel('');
            handleClose();
        }
    };

    const handleDeleteChannel = () => {
        setChannels(channels.filter(channel => channel !== channelToDelete));
        setChannelToDelete(null);
    };

    const handleConfirmDelete = (channel) => {
        setChannelToDelete(channel);
    };

    return (
        <div className="sidebar">
            <h2>COMP307 Project</h2>
            <ul>
                {channels.map(channel => (
                    <li className="channel" key={channel}>
                        <div className="channel-row">
                            {/*Fix link so right channel dynamically appears*/}
                            <Link to={`/${channel}`} className={notifications[channel] > 0 ? 'unread' : 'read'}># {channel}</Link>
                            <button className='delete-button' onClick={() => handleConfirmDelete(channel)}>-</button>
                        </div>
                    </li>
                ))}
            </ul>
            <Button variant="outline-primary" size="sm" onClick={handleShow}>
                Add Channel
            </Button>

            <Modal show={show} onHide={handleClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add a new channel</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Control type="text" placeholder="New channel" value={newChannel} onChange={e => setNewChannel(e.target.value)} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddChannel}>
                        Add Channel
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={channelToDelete !== null} onHide={() => setChannelToDelete(null)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete <strong>#{channelToDelete}</strong>?
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