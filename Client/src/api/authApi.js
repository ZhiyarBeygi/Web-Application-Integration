import axiosClient from "./axiosClient";

export function login(username, password) {
  return axiosClient.post("/Auth/login", { username, password });
}
