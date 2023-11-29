import "./Board.css"
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import Message from "../components/Message";
import {Route, Routes} from 'react-router-dom';

const channels = ['General', 'Random', 'React', 'JavaScript']

function Board(){
    return(
        <div className="board">
            <Topbar boardName="COMP307 Project"/>
            <div className="content">
                <Sidebar/>
                <Message channel="Random"/>
            </div>
        </div>  
    )
}
export default Board