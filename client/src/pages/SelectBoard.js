import "./SelectBoard.css";
import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    const [userBoards, setUserBoards] = useState([]);

    const handleLogout = () => {
      setShowLogoutModal(true);
    };
  
    const confirmLogout = () => {
      // Logout the User (Needs to be added). Redirect to Landing Page.
      setShowLogoutModal(false);
    };
  
    const closeLogoutModal = () => {
      setShowLogoutModal(false);
    };
    //Get the user's boards (Currently can't make it work, not sure why. (New user = Not initialized?))
    useEffect(() => {
        axios.get('/api/boards')
          .then((response) => {
            setUserBoards(response.data);
          })
          .catch((error) => {
            console.error('Error fetching user boards:', error);
          });
      }, []);

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
                        {/* Need current user's name and email to display on the "profile tab of the dropdown" */}
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
                    {/* Iterate over user's boards. Create a UserBoard Component for each.  */}
                {userBoards.map((board) => (
                <li key={board._id}>
                    <UserBoard board={board} />
                </li>
                ))}
                <li><AddBoard></AddBoard></li>
                </ul>
            </div>
        </div>
    </div>
    )
}

export default SelectBoard