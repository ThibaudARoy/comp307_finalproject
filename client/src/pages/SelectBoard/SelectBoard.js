import "./SelectBoard.css";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/SOCSLogo.png";
import usericon from "../../assets/user.png";
import Dropdown from "react-bootstrap/Dropdown";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import AddBoard from "../../components/AddBoard/AddBoard";
import UserBoard from "../../components/UserBoard/UserBoard";
import LogoutConfirmModal from "../../components/LogoutConfirmModal/LogoutConfirmModal";
import { logoutUser, getUserInfo } from "../../backendConnection/AuthService";
import { getUserBoards } from "../../backendConnection/BoardsService";
import { io } from "socket.io-client";
import SearchBar from "../../components/SearchBar/SearchBar";
const ENDPOINT = "http://localhost:5000";

function SelectBoard() {
  const navigate = useNavigate();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userBoards, setUserBoards] = useState([]);
  const [userInfo, setUserInfo] = useState([]);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = async () => {
    try {
      await logoutUser();
      navigate("/");
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

    var userId;
    // Fetch user info
    getUserInfo()
      .then((info) => {
        setUserInfo(info);
        console.log(userInfo);
        userId = info._id;
      })
      .catch((error) => {
        console.error("Error fetching user info:", error);
        // handle error, maybe set an error state to display to the user
      });

      const socket = io.connect(ENDPOINT, {
        withCredentials: true,
        extraHeaders: {
          Authorization: `${localStorage.getItem("token")}`,
        },
        // transports: ["websocket"],
      });
      socket.emit("setup", "hello");
      socket.on("connected", () => {
        console.log("authenticated");
        setSocketConnected(true);
      });
  
      setSocket(socket);
  
      socket.on("newBoard", (newBoard) => {
        console.log("new board " + newBoard);
        if (
          newBoard.admin === userId ||
          newBoard.members.includes(userId)
        ) {
          setUserBoards((userBoards) => [...userBoards, newBoard]);
        }
      });

      socket.on("newMember", ({memberId, board}) => {
        if (memberId === userId) {
          setUserBoards((userBoards) => [...userBoards, board]);
        }
      });
  
      socket.on("deleteBoard", (boardId) => {
        setUserBoards((userBoards) =>
          userBoards.filter((board) => board._id !== boardId)
        );
      });

      socket.on("deleteMember", ({ memberId, boardId }) => {
        if (memberId === userId) {
          setUserBoards((userBoards) =>
            userBoards.filter((board) => board._id !== boardId)
          );
        }
      });
      // eslint-disable-next-line
      return () => {
        socket.disconnect();
      };
  }, []);

  return (
    <div className="SelectBoard">
      <header>
        <div className="child1">
          <Link to="/select">
            <img
              src={logo}
              style={{ width: "300px", height: "auto" }}
              className="SOCSlogo"
              alt="logo"
            />
          </Link>
        </div>
        <div className="child2">
          <Dropdown>
            <Dropdown.Toggle id="dropdown-basic" className="userButton">
              <span className="btn-text">
                {userInfo.firstName} {userInfo.lastName}
              </span>
              <img src={usericon}></img>
            </Dropdown.Toggle>

            <Dropdown.Menu align="end">
              {/* Need current user's name and email to display on the "profile tab of the dropdown" */}
              <Dropdown.Item onClick={handleLogout} className="LogoutOption">
                Logout
              </Dropdown.Item>
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
                <UserBoard userInfo={userInfo} board={board} socket={socket} />
              </li>
            ))}
            <li>
              {userInfo && (
                <AddBoard userInfo={userInfo} socket={socket}></AddBoard>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SelectBoard;
