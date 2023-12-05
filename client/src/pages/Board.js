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

const channels = ["General", "Random", "React", "JavaScript"];

function Board() {
  const { boardId } = useParams();
  const [board, setBoard] = useState(null);

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
