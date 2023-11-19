import "./LandingPage.css";
import logo from "../assets/SOCSLogo.png";
import ParticlesBackground from "./ParticlesBackground"
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";

function LandingPage() {
    return(
    <div className="LandingPage">
        <header>
            <a href={"#0"}> 
                <img src={logo} style={{ width: '300px', height: 'auto' }} className="SOCSlogo" alt="logo" />
            </a>
        </header>

        <div className="MiddleContent">
            <ParticlesBackground/>
            <h1>
            Welcome!
            </h1>
            <p>McGill School of Computer Science Communication Platform</p>
           
            <Link to="/login">  <Button variant="primary" className="SignInBtn" size="lg">Login</Button>{' '} </Link>
        </div>
    </div>
    )
}

export default LandingPage