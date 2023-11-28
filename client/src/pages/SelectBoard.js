import "./SelectBoard.css";
import logo from "../assets/SOCSLogo.png";
import ParticlesBackground from "./ParticlesBackground"
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";
import AddBoard from '../components/AddBoard'
import UserBoard from '../components/UserBoard'

function SelectBoard() {
    return(
    <div className="SelectBoard">
        <header>
            <Link to="/"> 
                <img src={logo} style={{ width: '300px', height: 'auto' }} className="SOCSlogo" alt="logo" />
            </Link>
        </header>
        <div className="Boards">
            <div className="BoardsContent">
                <div className="BoardsHeader">
                    <h1>Your Boards</h1>    
                </div>
                <ul>
                <li><UserBoard></UserBoard></li>
                <li><UserBoard></UserBoard></li>
                <li><UserBoard></UserBoard></li>
                <li><UserBoard></UserBoard></li>
                <li><AddBoard></AddBoard></li>
                </ul>
            </div>
        </div>
    </div>
    )
}

export default SelectBoard