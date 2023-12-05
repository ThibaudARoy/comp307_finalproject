import "./Board.css";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Message from "../components/Message";
import { Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";
import ChannelTop from "../components/ChannelTop";
import Input from "../components/Input";
import { useParams } from "react-router-dom";
import axios from "axios";
import io from "socket.io-client";

const channels = ["General", "Random", "React", "JavaScript"];

const ENDPOINT = "http://localhost:5000"; // If you are deploying the app, replace the value with "https://YOUR_DEPLOYED_APPLICATION_URL"
let socket;
function Board() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);
  const [socketConnected, setSocketConnected] = useState(false);
  const [socket, setSocket] = useState(null);

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
        <Sidebar
          boardName={board ? board.name : ""}
          channels={board ? board.channels : []}
          onChannelClick={handleChannelClick}
          selectedChannel={selectedChannel}
          boardId={boardId}
        />
        <div className="channel-content">
          <ChannelTop channel={selectedChannel} />
          <Message
            chatData={[
              { content: "ooo yea", timestamp: Date.now(), creator: "Bob" },
              { content: "Hi", timestamp: Date.now(), creator: "Eve" },
            ]}
          />
          <Input />
        </div>
      </div>
    </div>
  );
}
export default Board;
