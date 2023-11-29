import './UserBoard.css';
import Button from 'react-bootstrap/Button';

//Takes a board as input. Creates a UserBoard component for that board.
function UserBoard({ board }){
    return (
        <div className="UserBoardButton">
            <Button className="userBoard">
                {/*Logo? Board icon?  */}
                {board.name}
                <p>Admin: {board.admin}</p>
            </Button>
        </div>
    );
}
export default UserBoard;