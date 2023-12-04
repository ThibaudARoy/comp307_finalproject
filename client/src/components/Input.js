import './Input.css';
import Button from 'react-bootstrap/Button';
import React, { useRef } from 'react';
import axios from 'axios';

function Input({ boardId, selectedChannel }){
    const textareaRef = useRef();

    const sendMessage = async () => {
        const content = textareaRef.current.value;

        if (!selectedChannel) {
            console.error('No channel selected');
            return;
        }

        try {
            const response = await axios.post(`/api/boards/${boardId}/channels/${selectedChannel._id}/messages`, {
                content
            }, {
                headers: { Authorization: `${localStorage.getItem("token")}` }
            });

            console.log('New message:', response.data);
            textareaRef.current.value = ''; // Clear the textarea
        } catch (error) {
            console.error('Error:', error.response.data.message);
        }
    };

    return (
        <div className='input'>
            <textarea ref={textareaRef} placeholder="Type a message..."></textarea>
            <Button onClick={sendMessage} variant='primary' className='button'>Send</Button>
        </div>
    );
}

export default Input;