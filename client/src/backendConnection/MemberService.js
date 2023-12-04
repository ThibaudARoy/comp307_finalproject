import axios from "axios";

export const findMembers = async () => {
  try {
    const response = await axios.get("/api/auth/users", {
      headers: { Authorization: `${localStorage.getItem("token")}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
