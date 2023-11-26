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

        <div className="MiddleContent">
        <ParticlesBackground/>
            <h1>
            Welcome!
            </h1>
            <p>McGill School of Computer Science Communication Platform</p>
           
            <Link to="/login">  <Button variant="primary" className="SignInBtn" size="lg">Login</Button>{' '} </Link>
        </div>
        <div className="BottomRegister">
            <p>Don't have an account?  <Link to="/register" className="SignUpLink">Register</Link></p>
        </div>
    </div>
    )
}

export default SelectBoard