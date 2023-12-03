import "./SelectBoard.css";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from "../assets/SOCSLogo.png";
import usericon from "../assets/user.png";
import Dropdown from 'react-bootstrap/Dropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";
import AddBoard from '../components/AddBoard'
import UserBoard from '../components/UserBoard'
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import { logoutUser, getUserInfo } from "../backendConnection/AuthService";
import { getUserBoards } from "../backendConnection/BoardsService";

function SelectBoard() {
    const navigate = useNavigate();
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [userBoards, setUserBoards] = useState([]);
    const [userInfo, setUserInfo] = useState([]);

    const handleLogout = () => {
      setShowLogoutModal(true);
    };
  
    const confirmLogout = async () => {
        try {
            await logoutUser();
            navigate('/');
          } catch (error) {
            console.error("Logout failed:", error);
          }
    };
  
    const closeLogoutModal = () => {
      setShowLogoutModal(false);
    };
    //Get the user's boards (Currently can't make it work, not sure why. (New user = Not initialized?))
    useEffect(() => {
        // Fetch user boards
        getUserBoards()
            .then((boards) => {
                setUserBoards(boards);
            })
            .catch((error) => {
                console.error("Error fetching boards:", error);
                // handle error, maybe set an error state to display to the user
            });
    
        // Fetch user info
        getUserInfo()
        .then((info) => {
            setUserInfo(info);
        })
        .catch((error) => {
            console.error("Error fetching user info:", error);
            // handle error, maybe set an error state to display to the user
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
                    <Dropdown.Toggle  id="dropdown-basic" className="userButton" >
                        <span className="btn-text">
                            {userInfo.firstName} {userInfo.lastName}
                        </span>
                        <img src={usericon}></img>
                    </Dropdown.Toggle>

                    <Dropdown.Menu align="end">
                        {/* Need current user's name and email to display on the "profile tab of the dropdown" */}
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
                    <UserBoard userInfo ={userInfo} board={board} />
                </li>
                ))}
                <li>{userInfo && <AddBoard  userInfo={userInfo} ></AddBoard>}</li>
                </ul>
            </div>
        </div>
    </div>
    )
}

export default SelectBoard