import "./Register.css"
import logo from "../assets/SOCSLogo.png";
import ParticlesBackground from "./ParticlesBackground";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";

function Register() {
    return (
        <div className="background">
        <header>
            <a href={"localhost:3000"}> 
                <img src={logo} style={{ width: '300px', height: 'auto' }} className="SOCSlogo" alt="logo" />
            </a>
        </header>
            <ParticlesBackground/>
            <div className="RegisterPage">
                <h1>Create an account</h1>
                <p>We suggest using your McGill email.</p>
                <div className="inputs-register">
                    <h5>First Name <span className="required">*</span></h5>
                    <input type = "text"></input>
                    <p></p>
                    <h5>Last Name <span className="required">*</span></h5>
                    <input type = "text"></input>
                    <p></p>
                    <h5>Email <span className="required">*</span></h5>
                    <input type = "text"></input>
                    <p></p>
                    <h5>Password <span className="required">*</span></h5>
                    <input type = "password"></input>
                </div>
                
                <Button variant="danger" className="register-button" size="lg">Register</Button>{' '}
                <p></p>
                <p>Already have an account? <Link className="LoginLink" to="/login">Sign in</Link></p>
            </div>
        </div>
    )

}

export default Register