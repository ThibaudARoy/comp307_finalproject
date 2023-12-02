import "./Board.css"
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Message from "../components/Message";
import {Route, Routes} from 'react-router-dom';
import React, { useState } from 'react';
import ChannelTop from "../components/ChannelTop";
import Input from "../components/Input";

const channels = ['General', 'Random', 'React', 'JavaScript']

function Board(){
    const [selectedChannel, setSelectedChannel] = useState(channels[0]);

    const handleChannelClick = (channel) => {
        setSelectedChannel(channel);
    };

    return(
        <div className="board">
            <Topbar boardName="COMP307 Project"/>
            <div className="content">
                <Sidebar onChannelClick={handleChannelClick}  selectedChannel={selectedChannel}/>
                <div className="channel">
                    <ChannelTop channel={selectedChannel}/>
                    <Message chatData={[{ content: "Hello", timestamp: Date.now(), creator: "User1" }, { content: "Hi", timestamp: Date.now(), creator: "User2" }]}/>
                    <Input/>
                </div>
                
            </div>
        </div>  
    )
}
export default Board