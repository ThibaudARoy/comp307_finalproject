import React from "react";
import "./App.css";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/PrivateRoute";
import LoginRoute from "./components/LoginRoute";
import Register from "./pages/Register";
import SelectBoard from "./pages/SelectBoard";
import Board from "./pages/Board";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/login"
            element={
              <LoginRoute>
                <Login />
              </LoginRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/select"
            element={
              <PrivateRoute>
                <SelectBoard />
              </PrivateRoute>
            }
          />
          <Route
            path="/board/:boardId"
            element={
              <PrivateRoute>
                <Board />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
