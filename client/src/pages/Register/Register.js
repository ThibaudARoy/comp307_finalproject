import "./Register.css"
import logo from "../../assets/SOCSLogo.png";
import ParticlesBackground from "../ParticlesBackground/ParticlesBackground";
import Button from 'react-bootstrap/Button';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from 'react';
import { validateEmail, validatePassword, isNonEmpty } from "../../inputValidation/AuthValidation";
import { registerUser } from '../../backendConnection/AuthService';

function Register() {
    const navigate = useNavigate();
    const [notification, setNotification] = useState('');
    const [registrationError, setRegistrationError] = useState('');
    
    // ** States for User Creation
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    // ** States for User Creation

    // ** States for Input Validation
    const [firstNameValid, setFirstNameValid] = useState(true);
    const [lastNameValid, setLastNameValid] = useState(true);
    const [emailValid, setEmailValid] = useState(true);
    const [passwordValid, setPasswordValid] = useState(true);

    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    // ** States for Input Validation

    const handleSubmit = async (event) => {
        event.preventDefault();
        //Input Validation
        setFirstNameValid(isNonEmpty(firstName));
        setLastNameValid(isNonEmpty(lastName));

        const isEmailValid = validateEmail(email);
        const isPasswordValid = validatePassword(password);

        setEmailValid(isEmailValid);
        setPasswordValid(isPasswordValid);

        if (!isEmailValid) {
            setEmailError('Invalid email format');
        } else {
            setEmailError('');
        }

        if (!isPasswordValid) {
            setPasswordError('Password must be at least 8 characters long');
        } else {
            setPasswordError('');
        }

        if (!firstNameValid || !lastNameValid || !isEmailValid || !isPasswordValid) {
            return;
        }
        //Input Validation
        const userData = { firstName, lastName, email, password };
        //API Request with userData
        try {
            const response = await registerUser(userData);
    
            if (response.success) {
                setNotification('Successful registration!');
                setTimeout(() => {
                    setNotification('');
                    navigate('/');
                }, 3000); 
            }
        } catch (error) {
            if (error.response?.status === 409){
                setRegistrationError("An account with the specified email address already exists. Are you sure you don't already have an account?");
            } else {
                setRegistrationError("Error while registering new user. Please try again later.");
            }
        }
    };

    const getH5ClassName = (isValid) => {
        return isValid ? "" : "invalid";
    };

    return (
        <div className="background">
            <header>
                <Link to="/">
                    <img src={logo} style={{ width: '300px', height: 'auto' }} className="SOCSlogo" alt="logo" />
                </Link>
            </header>
            {notification && (
                <div className="notification">
                    {notification}
                    <br></br>
                    <div className="redirectMessage">You will be redirected to the Landing Page</div>
                </div>
            )}
            <ParticlesBackground />
            <div className="RegisterPage">
                <h1>Create an account</h1>
                <p>We suggest using your McGill email.</p>
                {registrationError && <p className="regError">{registrationError}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="inputs-register">
                        {/* First Name */}
                        <h5 className={getH5ClassName(firstNameValid)}>First Name <span className="required">{firstNameValid ? "*" : " - Required"}</span></h5>
                        <input type="text" value={firstName} onChange={(e) => { setFirstName(e.target.value); setFirstNameValid(true); }}></input>
                        <p></p>
                        {/* Last Name */}
                        <h5 className={getH5ClassName(lastNameValid)}>Last Name <span className="required">{lastNameValid ? "*" : " - Required"}</span></h5>
                        <input type="text" value={lastName} onChange={(e) => { setLastName(e.target.value); setLastNameValid(true); }}></input>
                        <p></p>
                        {/* Email */}
                        <h5 className={getH5ClassName(emailValid)}>Email <span className="required">{emailValid ? "*" : " - Required"}</span></h5>
                        {email && !emailValid && <p className="error-message2">{emailError}</p>}
                        <input type="text" value={email} onChange={(e) => { setEmail(e.target.value); setEmailValid(true); }}></input>
                        <p></p>
                        {/* Password */}
                        <h5 className={getH5ClassName(passwordValid)}>Password <span className="required">{passwordValid ? "*" : " - Required"}</span></h5>
                        {password && !passwordValid && <p className="error-message2">{passwordError}</p>}
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => { setPassword(e.target.value); setPasswordValid(true); }}
                        ></input>
                        
                    </div>
                    <Button variant="danger" type="submit" className="register-button" size="lg">Register</Button>{' '}
                </form>
                <p></p>
                <p>Already have an account? <Link className="LoginLink" to="/login">Sign in</Link></p>
            </div>
        </div>
    )
}

export default Register