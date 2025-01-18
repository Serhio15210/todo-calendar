import axios from "axios";
export const api = axios.create({
  baseURL: "https://date.nager.at",
  headers: {
    "Content-Type": "application/json",
  },
});
