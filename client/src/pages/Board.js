import "./Board.css"
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Message from "../components/Message";
import {Route, Routes} from 'react-router-dom';
import React, {useEffect, useState } from 'react';
import ChannelTop from "../components/ChannelTop";
import Input from "../components/Input";
import { useParams } from 'react-router-dom';
import axios from "axios";

function Board(){
    const { boardId } = useParams();
    const [board, setBoard] = useState(null);

    useEffect(() => {
        axios.get(`/api/boards/${boardId}`, {
            headers: { Authorization: `${localStorage.getItem("token")}` }
          })
          .then(response => {
            setBoard(response.data);
          })
          .catch(error => console.error(error));
      }, [boardId]);

    const [selectedChannel, setSelectedChannel] = useState(null);

    const handleChannelClick = (channel) => {
        setSelectedChannel(channel);
    };

    return(
        <div className="board">
            <Topbar boardName={board ? board.name : ''}/>
            <div className="content">
                <div className="sidebar">
                <Sidebar boardName={board ? board.name : ''} channels={board ? board.channels : []} onChannelClick={handleChannelClick}  selectedChannel={selectedChannel} boardId={boardId} members={board ? board.members : []}/>
                </div>
                <div className="channel-content">
                    <ChannelTop className="top" channel={selectedChannel ? selectedChannel.name : ''}/>
                    <Message className="message" boardId={boardId} channelId={selectedChannel ? selectedChannel._id : null}/>
                    <Input className="inputBottom" boardId={boardId} selectedChannel={selectedChannel}/>
                </div>
                
            </div>
        </div>  
    )
}
export default Board