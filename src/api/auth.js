import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080/api/auth",
  withCredentials: true,
});

export const signup = (payload) => {
  return API.post("/signup", payload);
};

export const login = (payload) => {
  return API.post("/login", payload);
};