import React from 'react';
import { Navigate } from 'react-router-dom';

const LoginRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const isAuthenticated = token != null;

    // If the user is authenticated, redirect to the SelectBoards page
    return isAuthenticated ? <Navigate to="/select" /> : children;
};

export default LoginRoute;
