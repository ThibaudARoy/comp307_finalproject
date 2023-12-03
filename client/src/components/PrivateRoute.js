import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    const isAuthenticated = token != null;

    return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;