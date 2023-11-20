import "./Login.css";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";
import logo from "../assets/bird.png";

function Login() {
    return (
        <div className="back">
            <div className="LoginPage">
                <img src={logo} style={{ width: '70px', height: '70px' }} alt="logo" />
                <p></p>
                <h1>Sign in to SOCS Boards</h1>
                <p>We suggest using your McGill email.</p>
                <div className="inputs">
                    <h5>Email <span className="required">*</span></h5>
                    <input type = "text"></input>
                    <p></p>
                    <h5>Password <span className="required">*</span></h5>
                    <input type = "password"></input>
                </div>
                
                <Button variant="danger" className="login-button" size="lg">Login</Button>{' '}
                <p></p>
                <p>Need an account? <Link to="/register">Register</Link> </p>
            </div>
        </div>  
    )
}

export default Login