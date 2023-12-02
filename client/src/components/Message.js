import React from 'react';
import './Message.css';

function Message({chatData}) {
    return (
        <div className="message">
            {chatData.map((message, index) => (
                <div key={index}>
                    <p>{message.creator}</p>
                    <p>{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</p>
                    <p>{message.content}</p>
                </div>
            ))}
        </div>
    );
}

export default Message;