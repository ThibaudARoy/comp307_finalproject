import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import 'bootstrap/dist/css/bootstrap.min.css'
import LandingPage from './LandingPage.js'


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
        <LandingPage></LandingPage>
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        {/* Display the message from the server */}
        {serverMessage && <p>Server says: {serverMessage}</p>}
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
