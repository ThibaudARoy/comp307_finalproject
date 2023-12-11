import axios from "axios";
import { isAuthorized } from "./isAuthorized";

export const findMembers = async () => {
  try {
    const response = await axios.get("/api/auth/users", {
      headers: { Authorization: `${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    isAuthorized(error.response.data);
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const thisBoardMembers = async (boardId) => {
  try {
    const response = await axios.get(`/api/boards/${boardId}/members`, {
      headers: { Authorization: `${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    isAuthorized(error.response.data);
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const deleteMember = async (boardId, userId) => {
  try {
    const response = await axios.delete(`/api/boards/${boardId}/members/${userId}`, {
      headers: { Authorization: `${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    isAuthorized(error.response.data);
    console.error("Error fetching users:", error);
    throw error;
  }
};

export const addNewMember = async (boardId, userId) => {
  try {
    const response = await axios.post(`/api/boards/${boardId}/members`, {
      userId: userId,
    }, {
      headers: { Authorization: `${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    isAuthorized(error.response.data);
    console.error("Error adding new member:", error);
    throw error;
  }
};
