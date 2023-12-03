import React from 'react';
import './Message.css';

function Message({chatData}) {
    return (
        <div className="message">
            {chatData.map((message, index) => (
                <div key={index}>
                    <p className='name-time'><span className="sender-name">{message.creator}</span> <span className="time-stamp">{new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}</span></p>
                    <p className='message-content'>{message.content}</p>
                </div>
            ))}
        </div>
    );
}

export default Message;