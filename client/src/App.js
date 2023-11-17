import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";


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
        {/* Display the message from the server */}
        {serverMessage && <p>Server says: {serverMessage}</p>}
        
      </header>
    </div>
  );
}

export default App;
