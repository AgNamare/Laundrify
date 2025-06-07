import axios from "axios";

const BASEURL = "laundrify-backend-auc4dhamg6auhpcu.canadacentral-01.azurewebsites.net";

export default axios.create({
  baseURL: BASEURL,
  withCredentials: true,
});

export const axiosPrivate = axios.create({
  baseURL: BASEURL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
