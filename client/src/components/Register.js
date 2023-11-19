import "./Register.css"
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Link} from "react-router-dom";

function Register() {
    return (
        <div className="background">
            <div className="RegisterPage">
                <h2>Create an account</h2>
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
                <Link to="/login">Already have an account?</Link>
            </div>
        </div>
    )

}

export default Register