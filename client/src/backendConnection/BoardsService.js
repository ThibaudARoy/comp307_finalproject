import axios from "axios";

export const getUserBoards = async () => {
  try {
    const response = await axios.get("/api/boards", {
      headers: { Authorization: `${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
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
    console.error("Error creating board:", error);
    throw error;
  }
};

export const deleteBoard = async (boardId) => {
  try {
    const response = await axios.delete(`/api/boards/${boardId}`, {
      headers: { Authorization: `${localStorage.getItem("token")}` },
    });
    return response.data; // or just return if you don't need the response data
  } catch (error) {
    console.error(
      "Error deleting board:",
      error.response ? error.response.data : error
    );
    throw error;
  }
};
