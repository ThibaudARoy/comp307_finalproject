import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'  //
import LandingPage from './components/LandingPage.jsx'  //


function App() {
  const [serverMessage, setServerMessage] = useState("");

  useEffect(() => {
    // Make a request to the server
    axios
      .get("/test")
      .then((response) => {
        // Set the response message to state
        setServerMessage(response.data.message);
      })
      .catch((error) => {
        console.error("Error connecting to the server:", error);
      });
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <LandingPage />
        {/* Display the message from the server */}
        {serverMessage && <p>Server says: {serverMessage}</p>}
        
      </header>
    </div>
  );
}

export default App;
