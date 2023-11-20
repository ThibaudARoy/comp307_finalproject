import "./Login.css";
import logo from "../assets/SOCSLogo.png";
import bird from "../assets/SOCSBird.png";
import ParticlesBackground from "./ParticlesBackground";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";

function Login() {
    return ( 
        <div className="back">
        <header>
            <a href={"localhost:3000"}> 
                <img src={logo} style={{ width: '300px', height: 'auto' }} className="SOCSlogo" alt="logo" />
            </a>
        </header>
            <ParticlesBackground/>
            <div className="LoginPage">
            <img src={bird} style={{ width: '75px', height: 'auto' }} className="SOCSlogo" alt="logo" />
                <h1>Sign in to SOCS Boards</h1>
                <div className="inputs">
                    <h5>Email <span className="required">*</span></h5>
                    <input type = "text"></input>
                    <p></p>
                    <h5>Password <span className="required">*</span></h5>
                    <input type = "password"></input>
                </div>
                
                <Button variant="danger" className="login-button" size="lg">Login</Button>{' '}
                <p></p>
                <p>Need an account? <Link className="RegisterLink" to="/register">Register</Link> </p>
            </div>
        </div>  
    )
}

export default Login