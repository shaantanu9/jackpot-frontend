import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const axiosCall = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
