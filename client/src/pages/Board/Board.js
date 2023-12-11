import "./Board.css";
import Sidebar from "../../components/Sidebar/Sidebar";
import Topbar from "../../components/Topbar/Topbar";
import Message from "../../components/Message/Message";
import React, { useEffect, useState } from "react";
import ChannelTop from "../../components/ChannelTop/ChannelTop";
import Input from "../../components/Input/Input";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";
import { isAuthorized } from "../../backendConnection/isAuthorized";

const ENDPOINT = "http://localhost:5000";

function Board() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [isSidebarVisible, setIsSidebarVisible] = useState(true);
  const [selectedChannel, setSelectedChannel] = useState(null);


  const toggleSidebar = () => {
      setIsSidebarVisible(!isSidebarVisible);
  }

  useEffect(() => {
    axios
      .get(`/api/boards/${boardId}`, {
        headers: { Authorization: `${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setBoard(response.data);
      })
      .catch((error) => {
        isAuthorized(error.response.data);
        console.error(error)
      });
  }, [boardId]);

  useEffect(() => {
    const socket = io.connect(ENDPOINT, {
      withCredentials: true,
      extraHeaders: {
        Authorization: `${localStorage.getItem("token")}`,
      },
      // transports: ["websocket"],
    });
    socket.emit("setup", "hello");
    socket.on("connected", () => {
      setSocketConnected(true);
    });

    setSocket(socket);
    // eslint-disable-next-line
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (board && board.channels && socketConnected) {
      board.channels.forEach((channel) => {
        socket.emit("joinChannel", channel);
      });
      socket.emit("joinBoard", boardId);

      return () => {
        board.channels.forEach((channel) => {
          socket.emit("leaveChannel", channel);  
        });
        socket.emit("leaveBoard", boardId);
      };
    }
  }, [board, boardId, socketConnected, socket]);

  const handleChannelClick = (channel) => {
    setSelectedChannel(channel);
  };
  
  return (
    <div className="board">
      <Topbar 
      boardName={board ? board.name : ""} 
      boardId ={boardId} />
      <div className="content">
        <div className={`sidebar ${isSidebarVisible ? "" : "collapsed"}`}>
          <Sidebar
            boardName={board ? board.name : ""}
            boardAdmin={board ? board.admin : null}
            channels={board ? board.channels : []}
            onChannelClick={handleChannelClick}
            selectedChannel={selectedChannel}
            boardId={boardId}
            isSidebarVisible={isSidebarVisible}
            members={board ? board.members : []}
            socket={socket}
          />
        </div>
        <div className="channel-content">
          <ChannelTop
            className="top"
            channel={selectedChannel ? selectedChannel.name : ""}
            onToggleSidebar={toggleSidebar}
            isSidebarVisible={isSidebarVisible}
          />
          <Message
            className="message"
            boardId={boardId}
            boardAdmin={board ? board.admin : null}
            channelId={selectedChannel ? selectedChannel._id : null}
            socket={socket}
            isSidebarVisible={isSidebarVisible}
          />
          <Input
            className="inputBottom"
            boardId={boardId}
            selectedChannel={selectedChannel}
            socket={socket}
            isSidebarVisible={isSidebarVisible}
          />
        </div>
      </div>
    </div>
  );
}
export default Board;
