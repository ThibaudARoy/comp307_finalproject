import axios from 'axios';

export const registerUser = async (userData) => {
    try {
        const response = await axios.post('/api/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const loginUser = async (email, password) => {
    try {
        const response = await axios.post('/api/auth/login', {
            email: email,
            password: password,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const logoutUser = async () => {
    try {
        const token = localStorage.getItem("token");
        await axios.post('/api/auth/logout', {}, {headers: {Authorization: `${localStorage.getItem("token")}`}});
        localStorage.removeItem("token");
    } catch (error) {
        throw error;
    }
};

export const getUserInfo = async () => {
    try {
        const response = await axios.get('/api/auth/user/', {
            headers: { Authorization: `${localStorage.getItem("token")}` }
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const queryUsersByEmail = async (email) => {
    try {
        const baseURL = "http://localhost:3000/"; 
        const response = await axios.get(`${baseURL}api/users/${email}/user`, {
          headers: { Authorization: `${localStorage.getItem("token")}` },
        });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      return [];
    }
  };