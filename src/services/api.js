import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8080",
});

const auth = JSON.parse(localStorage.getItem("auth"));
if (auth) {
  const token = btoa(auth.email + ":" + auth.password);
  API.defaults.headers.common["Authorization"] = "Basic " + token;
}

export const setAuthHeader = (email, password) => {
  const token = btoa(email + ":" + password);
  API.defaults.headers.common["Authorization"] = "Basic " + token;
};

export default API;