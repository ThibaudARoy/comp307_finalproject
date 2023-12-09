import "./Board.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Message from "../components/Message";
import React, { useEffect, useState } from "react";
import ChannelTop from "../components/ChannelTop";
import Input from "../components/Input";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";

function Board() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [socket, setSocket] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);

  useEffect(() => {
    axios
      .get(`/api/boards/${boardId}`, {
        headers: { Authorization: `${localStorage.getItem("token")}` },
      })
      .then((response) => {
        setBoard(response.data);
      })
      .catch((error) => console.error(error));
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
      console.log("authenticated");
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

      return () => {
        board.channels.forEach((channel) => {
          socket.emit("leaveChannel", channel);
        });
      };
    }
  }, [board, boardId, socketConnected, socket]);

  const [selectedChannel, setSelectedChannel] = useState(null);

  const handleChannelClick = (channel) => {
    setSelectedChannel(channel);
  };

  return (
    <div className="board">
      <Topbar boardName={board ? board.name : ""} />
      <div className="content">
        <div className="sidebar">
          <Sidebar
            boardName={board ? board.name : ""}
            channels={board ? board.channels : []}
            onChannelClick={handleChannelClick}
            selectedChannel={selectedChannel}
            boardId={boardId}
            members={board ? board.members : []}
            socket={socket}
          />
        </div>
        <div className="channel-content">
          <ChannelTop
            className="top"
            channel={selectedChannel ? selectedChannel.name : ""}
          />
          <Message
            className="message"
            boardId={boardId}
            boardAdmin={board ? board.admin : null}
            channelId={selectedChannel ? selectedChannel._id : null}
            socket={socket}
          />
          <Input
            className="inputBottom"
            boardId={boardId}
            selectedChannel={selectedChannel}
            socket={socket}
          />
        </div>
      </div>
    </div>
  );
}
export default Board;
