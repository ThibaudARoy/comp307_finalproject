import React from "react";
import "./App.css";
import LandingPage from "./pages/LandingPage/LandingPage";
import Login from "./pages/Login/Login";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/Routes/PrivateRoute";
import LoginRoute from "./components/Routes/LoginRoute";
import Register from "./pages/Register/Register";
import SelectBoard from "./pages/SelectBoard/SelectBoard";
import Board from "./pages/Board/Board";

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
