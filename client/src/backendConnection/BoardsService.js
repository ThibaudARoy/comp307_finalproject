import axios from "axios";
import { isAuthorized } from "./isAuthorized";
import { Navigate } from 'react-router-dom';

export const getUserBoards = async () => {
  try {
    const response = await axios.get("/api/boards", {
      headers: { Authorization: `${localStorage.getItem("token")}` },
    });
    

    return response.data;
  } catch (error) {
    isAuthorized(error.response.data);
    console.error("Error fetching user boards:", error);
    throw error;
  }
};

export const createBoard = async (boardData) => {
  try {
    const response = await axios.post("/api/boards", boardData, {
      headers: { Authorization: `${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    // You can throw the error or handle it here
    isAuthorized(error.response.data);
    console.error("Error creating board:", error);
    throw error;
  }
};

export const deleteBoard = async (boardId) => {
  try {
    const response = await axios.delete(`/api/boards/${boardId}`, {
      headers: { Authorization: `${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    isAuthorized(error.response.data);
    console.error(
      "Error deleting board:",
      error.response ? error.response.data : error
    );
    throw error;
  }
};
