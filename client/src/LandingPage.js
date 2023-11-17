import React, { useEffect, useState } from "react";
import logo from "./SOCSLogo.png";
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css'

function LandingPage() {
    return(
    <div className="App">
        <img src={logo} className="App-logo" alt="logo" />
        <Button>Test Button</Button>
    </div>
    )
}

export default LandingPage