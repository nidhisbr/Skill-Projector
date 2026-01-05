// src/api/protectedApi.js
import axios from "axios";

export const getHello = async () => {
  const token = localStorage.getItem("token"); // token saved after /authenticate
  return axios.get("http://localhost:8080/api/protected/hello", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
