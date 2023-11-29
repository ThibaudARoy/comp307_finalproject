import "./SelectBoard.css";
import React, { useState } from 'react';
import logo from "../assets/SOCSLogo.png";
import usericon from "../assets/user.png"
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";
import AddBoard from '../components/AddBoard'
import UserBoard from '../components/UserBoard'
import LogoutConfirmModal from "../components/LogoutConfirmModal";

function SelectBoard() {
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
      setShowLogoutModal(true);
    };
  
    const confirmLogout = () => {
      // Perform the logout action here
      // You can implement your logout logic, e.g., clearing authentication tokens, etc.
      // Then close the modal and redirect to the login page or perform other actions.
      setShowLogoutModal(false);
    };
  
    const closeLogoutModal = () => {
      setShowLogoutModal(false);
    };
    return(
    <div className="SelectBoard">
        <header>
            <div className="child1">
                <Link to="/select"> 
                    <img src={logo} style={{ width: '300px', height: 'auto' }} className="SOCSlogo" alt="logo" />
                </Link>
            </div>
            <div className="child2">
                <Dropdown>
                    <Dropdown.Toggle  id="dropdown-basic" className="userButton">
                        <img src={usericon}></img>
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                        <Dropdown.Item href="#/action-1">Profile</Dropdown.Item>
                        <Dropdown.Item onClick={handleLogout} className="LogoutOption">Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
                <LogoutConfirmModal
                show={showLogoutModal}
                onClose={closeLogoutModal}
                onConfirm={confirmLogout}
                />
            </div>
        </header>
        <div className="Boards">
            <div className="BoardsContent">
                <div className="BoardsHeader">
                    <h1>Your Boards</h1>    
                </div>
                <ul>
                <li><UserBoard></UserBoard></li>
                <li><UserBoard></UserBoard></li>
                <li><UserBoard></UserBoard></li>
                <li><UserBoard></UserBoard></li>
                <li><AddBoard></AddBoard></li>
                </ul>
            </div>
        </div>
    </div>
    )
}

export default SelectBoard