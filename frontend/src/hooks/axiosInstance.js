import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});


export const axiosInstanceWithToken = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const token = localStorage.getItem("my_token");
axiosInstanceWithToken.defaults.headers.common[
  "Authorization"
] = `Bearer ${token}`;