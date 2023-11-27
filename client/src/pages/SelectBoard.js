import "./SelectBoard.css";
import logo from "../assets/SOCSLogo.png";
import ParticlesBackground from "./ParticlesBackground"
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";

function SelectBoard() {
    return(
    <div className="SelectBoard">
        <header>
            <Link to="/"> 
                <img src={logo} style={{ width: '300px', height: 'auto' }} className="SOCSlogo" alt="logo" />
            </Link>
        </header>
        <ParticlesBackground/>
    </div>
    )
}

export default SelectBoard