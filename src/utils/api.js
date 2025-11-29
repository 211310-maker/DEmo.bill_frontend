import config from "../config/env";
import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants";

const BASE_URL = config.API_BASE_URL;

// ------------------ ALL API URLs --------------------
export const Urls = {
  login: BASE_URL + "/auth/login",
  webIndex: BASE_URL + "/auth/webindex",

  // Admin user management
  getUsers: BASE_URL + "/auth/admin/get-users",
  changeStatus: BASE_URL + "/auth/admin/block-unblock-user",
  deleteUser: BASE_URL + "/auth/admin/delete-user",
  addMoreAccessState: BASE_URL + "/auth/admin/add-state-access",

  // Access link + OTP
  getPageAccessLink: BASE_URL + "/auth/admin/page-access-link",
  provideAccess: BASE_URL + "/auth/admin/verify-otp",

  // User registration access (token link)
  getAccess: BASE_URL + "/auth/get-access",

  // Billing
  getDetails: BASE_URL + "/bill/get-details",
  createBill: BASE_URL + "/bill",
  allBills: BASE_URL + "/bill",
};

// Safe error wrapper
const safeError = (error) =>
  error.response?.data || { message: error.message };

// ------------------ HELPERS --------------------
const authHeaders = () => {
  const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  return {
    "Content-type": "application/json",
    "x-auth-token": user?.token,
  };
};

// ------------------ AUTH --------------------
export const loginApi = async (payload) => {
  try {
    const res = await axios.post(Urls.login, payload, {
      headers: { "Content-type": "application/json" },
    });
    return { data: res.data, error: null };
  } catch (error) {
    return { data: null, error: safeError(error) };
  }
};

export const webIndexApi = async (payload) => {
  try {
    const { data } = await axios.post(Urls.webIndex, payload, {
      headers: {
        "Content-type": "application/json",
      },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: safeError(error) };
  }
};

// ------------------ ACCESS LINK / REGISTER PAGE --------------------

// ⚠️ This is the one GetAccess.jsx expects
export const getAcessApi = async (token) => {
  try {
    const { data } = await axios.get(`${Urls.getAccess}/${token}`);
    return { data, error: null };
  } catch (error) {
    return { data: null, error: safeError(error) };
  }
};

export const createTempUserApi = async () => {
  try {
    const { data } = await axios.get(Urls.getPageAccessLink, {
      headers: authHeaders(),
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: safeError(error) };
  }
};

export const provideAccessApi = async (payload) => {
  try {
    const { data } = await axios.post(Urls.provideAccess, payload, {
      headers: authHeaders(),
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: safeError(error) };
  }
};

// ------------------ USER mgmt --------------------
export const getAllUsersApi = async () => {
  try {
    const { data } = await axios.get(Urls.getUsers, {
      headers: authHeaders(),
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: safeError(error) };
  }
};

export const deleteUserApi = async (id) => {
  try {
    const { data } = await axios.delete(`${Urls.deleteUser}/${id}`, {
      headers: authHeaders(),
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: safeError(error) };
  }
};

export const changeStatusApi = async (id) => {
  try {
    const { data } = await axios.post(
      Urls.changeStatus,
      { id },
      { headers: authHeaders() }
    );
    return { data, error: null };
  } catch (error) {
    return { data: null, error: safeError(error) };
  }
};

export const addMoreAccessStateApi = async (payload) => {
  try {
    const { data } = await axios.post(Urls.addMoreAccessState, payload, {
      headers: authHeaders(),
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: safeError(error) };
  }
};

// ------------------ BILLING --------------------
export const getDetailsApi = async (payload) => {
  try {
    const { vehicleNo, state } = payload;
    const { data } = await axios.get(
      `${Urls.getDetails}?vehicleNo=${vehicleNo}${
        state ? `&state=${state}` : ""
      }`,
      {
        headers: authHeaders(),
      }
    );
    return { data, error: null };
  } catch (error) {
    return { data: null, error: safeError(error) };
  }
};

export const getAllBillsApi = async (filter) => {
  try {
    const url = filter ? `${Urls.allBills}?${filter}` : Urls.allBills;
    const { data } = await axios.get(url, {
      headers: authHeaders(),
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: safeError(error) };
  }
};

export const createBillApi = async (payload) => {
  try {
    const { data } = await axios.post(Urls.createBill, payload, {
      headers: authHeaders(),
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: safeError(error) };
  }
};
