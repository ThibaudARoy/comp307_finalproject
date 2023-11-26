import React, { useState } from 'react';
import "./Login.css";
import logo from "../assets/SOCSLogo.png";
import bird from "../assets/SOCSBird.png";
import ParticlesBackground from "./ParticlesBackground";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);

    const handleSubmit = (event) => {
        event.preventDefault();

        setEmailValid(email.trim() !== '');
        setPasswordValid(!!password);

        if (! emailValid || ! passwordValid){
            return;
        }

    }
    const getH5ClassName = (isValid) => {
        return isValid ? "" : "invalid";
    };

    return ( 
        <div className="back">
        <header>
            <Link to="/"> 
                <img src={logo} style={{ width: '300px', height: 'auto' }} className="SOCSlogo" alt="logo" />
            </Link>
        </header>
            <ParticlesBackground/>
            <div className="LoginPage">
            <img src={bird} style={{ width: '75px', height: 'auto' }} className="SOCSlogo" alt="logo" />
                <h1>Sign in to SOCS Boards</h1>
                <form onSubmit={handleSubmit}>
                    <div className="inputs">
                        <h5 className={getH5ClassName(emailValid)}>Email <span className="required">{emailValid ? "*" : " - Required"}</span></h5>
                        <input type = "text" value={email} onChange={(e) => { setEmail(e.target.value); setEmailValid(true); }}></input>
                        <p></p>
                        <h5 className={getH5ClassName(passwordValid)}>Password <span className="required">{passwordValid ? "*" : " - Required"}</span></h5>
                        <input type = "password" onChange={(e) => { setPassword(e.target.value); setPasswordValid(true); }}></input>
                    </div>
                    
                    <Button variant="danger" type="submit"  className="login-button" size="lg">Login</Button>{' '}
                </form>
                <p></p>
                <p>Need an account? <Link className="RegisterLink" to="/register">Register</Link> </p>
            </div>
        </div>  
    )
}

export default Login