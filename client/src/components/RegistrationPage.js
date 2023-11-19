import "./RegistrationPage.css";
import ParticlesBackground from "./ParticlesBackground"
import logo from "../assets/SOCSLogo.png";
import Form from 'react-bootstrap/Form';
import 'bootstrap/dist/css/bootstrap.min.css';

function RegistrationPage() {
    return(
    <div className="RegistrationPage">
        <header>
            <a href={"#0"}> 
                <img src={logo} style={{ width: '300px', height: 'auto' }} className="SOCSlogo" alt="logo" />
            </a>
        </header>

        <div className="MiddleContent">
            <ParticlesBackground/>
            <div className="MainForm">
                <span className="NewUser" >Register</span>
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className="text-muted">Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>
                </Form>
            </div>
        </div>
    </div>
    )
}

export default RegistrationPage