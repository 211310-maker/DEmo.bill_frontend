import config from "../config/env";
import axios from "axios";
import { LOCAL_STORAGE_KEY } from "../constants";

const BASE_URL = config["API_BASE_URL"];

const normalizeBill = (bill) => {
  if (!bill) return bill;

  return {
    ...bill,
    qrCode: bill.qrCode || bill.qr_image || bill.qr,
    qrUrl: bill.qrUrl || bill.qr_link || bill.qrLink,
  };
};

const normalizeBillPayload = (payload) => {
  if (!payload) return payload;

  const normalizedPayload = { ...payload };

  if (Array.isArray(payload.bills)) {
    normalizedPayload.bills = payload.bills.map(normalizeBill);
  }

  if (payload.bill) {
    normalizedPayload.bill = normalizeBill(payload.bill);
  }

  return normalizedPayload;
};

export const Urls = {
  login: BASE_URL + "/auth/login",
  webIndex: BASE_URL + "/auth/webindex",
  getAcess: BASE_URL + "/auth/get-access",
  getPageAccessLink: BASE_URL + "/auth/admin/page-access-link",
  provideAccess: BASE_URL + "/auth/admin/verify-otp",
  getUsers: BASE_URL + "/auth/admin/get-users",
  changeStatus: BASE_URL + "/auth/admin/block-unblock-user",
  addMoreAccessState: BASE_URL + "/auth/admin/add-state-access",
  deleteUser: BASE_URL + "/auth/admin/delete-user",
  getDetails: BASE_URL + "/bill/get-details",
  createBill: BASE_URL + "/bill",
  allBills: BASE_URL + "/bill",
};

const safeError = (error) => error.response?.data || { message: error.message };

const getAuthHeaders = () => {
  const user = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  return {
    "Content-type": "application/json",
    "x-auth-token": user?.token,
  };
};

export const loginApi = async (payLoad) => {
  try {
    const res = await axios.post(Urls.login, payLoad, {
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
      headers: { "Content-type": "application/json" },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: safeError(error) };
  }
};

export const createTempUserApi = async () => {
  try {
    const { data } = await axios.get(Urls.getPageAccessLink, {
      headers: getAuthHeaders(),
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: safeError(error) };
  }
};

export const getAcessApi = async (token) => {
  try {
    const { data } = await axios.get(`${Urls.getAcess}/${token}`);
    return { data, error: null };
  } catch (error) {
    return { data: null, error: safeError(error) };
  }
};

export const provideAccessApi = async (payLoad) => {
  try {
    const { data } = await axios.post(Urls.provideAccess, payLoad, {
      headers: { "Content-type": "application/json" },
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: safeError(error) };
  }
};

export const getAllUsersApi = async () => {
  try {
    const { data } = await axios.get(Urls.getUsers, {
      headers: getAuthHeaders(),
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: safeError(error) };
  }
};

export const deleteUserApi = async (id) => {
  try {
    const { data } = await axios.delete(`${Urls.deleteUser}/${id}`, {
      headers: getAuthHeaders(),
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
      {
        headers: getAuthHeaders(),
      }
    );
    return { data, error: null };
  } catch (error) {
    return { data: null, error: safeError(error) };
  }
};

export const addMoreAccessStateApi = async (payload) => {
  try {
    const { data } = await axios.post(Urls.addMoreAccessState, payload, {
      headers: getAuthHeaders(),
    });
    return { data, error: null };
  } catch (error) {
    return { data: null, error: safeError(error) };
  }
};

export const getDetailsApi = async ({ vehicleNo, state }) => {
  try {
    const params = new URLSearchParams();
    if (vehicleNo) params.set("vehicleNo", vehicleNo);
    if (state) params.set("state", state);
    const { data } = await axios.get(`${Urls.getDetails}?${params.toString()}`, {
      headers: getAuthHeaders(),
    });
    return { data: normalizeBillPayload(data), error: null };
  } catch (error) {
    return { data: null, error: safeError(error) };
  }
};

export const createBillApi = async (payLoad) => {
  try {
    const { data } = await axios.post(Urls.createBill, payLoad, {
      headers: getAuthHeaders(),
    });
    return { data: normalizeBillPayload(data), error: null };
  } catch (error) {
    return { data: null, error: safeError(error) };
  }
};

export const getAllBillsApi = async (filter) => {
  try {
    const finalUrl = filter ? `${Urls.allBills}?${filter}` : Urls.allBills;
    const { data } = await axios.get(finalUrl, {
      headers: getAuthHeaders(),
    });
    return { data: normalizeBillPayload(data), error: null };
  } catch (error) {
    return { data: null, error: safeError(error) };
  }
};
