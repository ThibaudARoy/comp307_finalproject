import React, { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Register from "./pages/Register";
import Sidebar from "./components/Sidebar";
import SelectBoard from "./components/SelectBoard"

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

  // Log the server message
if (serverMessage) {
  console.log("Server says: " + serverMessage);
}

  return (
    <div>
      <Sidebar/>
    <BrowserRouter>
        <Routes>
            <Route path="/" Component={LandingPage}/>
            <Route path="/login" Component={Login}/>
            <Route path="/register" Component={Register}/>
            <Route path="/select" Component={SelectBoard}/>
        </Routes>
    </BrowserRouter>
    </div>
  );
}

export default App;
