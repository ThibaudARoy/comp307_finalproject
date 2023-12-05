import './Input.css';
import Button from 'react-bootstrap/Button';

function Input(){
    return (
        <div className='input'>
            <textarea placeholder="Type a message..."></textarea>
            <Button variant='primary' className='button'>Send</Button>
        </div>
    );
}

export default Input;