import React from 'react';
import './Message.css';

function Message({channel}) {
    return (
        <div className="message">
            hello
            <p>{channel}</p>
        </div>
    );
}

export default Message;