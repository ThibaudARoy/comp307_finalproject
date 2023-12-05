import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Message.css';

function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xFF;
        color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
}


function Message({boardId, channelId}) {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const fetchMessages = async () => {
            if (!channelId) {
                console.error('No channel selected');
                return;
            }

            try {
                const response = await axios.get(`/api/boards/${boardId}/channels/${channelId}/messages`, {
                    headers: { Authorization: `${localStorage.getItem("token")}` }
                });
                setMessages(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMessages();
    }, [boardId, channelId]);


    return (
        <div className="message">
            {messages.map((message, index) => {
                const currentDate = new Date(message.timestamp).toDateString();
                const previousDate = index > 0 ? new Date(messages[index - 1].timestamp).toDateString() : null;
    
                return (
                    <div key={index}>
                        {(index === 0 || currentDate !== previousDate) && (
                            <div className="date-separator">
                                <hr />
                                <span>{currentDate}</span>
                                <hr />
                            </div>
                        )}
                        {(index === 0 || message.creator._id !== messages[index - 1].creator._id || currentDate !== previousDate) && (
                            <p className='name-time'>
                                <span className="sender-name" style={{ color: stringToColor(message.creator._id) }}>{message.creator.firstName} {message.creator.lastName}</span> 
                                <span className="time-stamp">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span>
                            </p>
                        )}
                        <p className='message-content'>{message.content}</p>
                    </div>
                );
            })}
        </div>
    );
}

export default Message;