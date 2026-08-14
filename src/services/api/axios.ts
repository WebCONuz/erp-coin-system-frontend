import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { ENDPOINTS } from "../endpoints";
import { handleAutoLogout } from "../helpers";
import { TENANT_KEY } from "@/features/tenants/constants";

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3031";

// Parallel kelgan so'rovlarni boshqarish uchun o'zgaruvchilar
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value: unknown) => void;
  reject: (error: unknown) => void;
}> = [];

// Kutib turgan so'rovlarni qayta ishga tushirish yoki rad etish funksiyasi
const processQueue = (error: Error | null, token: boolean = true) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export const request = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 1. REQUEST INTERCEPTOR (So'rov ketishidan oldin)
 */
request.interceptors.request.use(
  (config) => {
    const currentLang = localStorage.getItem("i18nextLng") || "uz";
    if (config.headers) {
      config.headers["Accept-Language"] = currentLang;
    }

    const tenantId = localStorage.getItem(TENANT_KEY);
    if (tenantId) {
      config.params = { ...(config.params || {}), tenantId };
    }

    return config;
  },
  (error) => Promise.reject(error),
);

/**
 * Har doim bir xil shaklda (AxiosResponse yoki, javob bo'lmasa, xato) reject qilish uchun.
 * Shu orqali chaqiruvchi tomonda `error?.data?.message` doim izchil ishlaydi.
 */
const rejectWithResponse = (error: AxiosError) =>
  Promise.reject(error.response ?? error);

/**
 * 2. RESPONSE INTERCEPTOR (Javob kelganda xatolarni tutish va Refresh)
 */
request.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (error.response?.status !== 401 || !originalRequest) {
      return rejectWithResponse(error);
    }

    if (originalRequest._retry) {
      handleAutoLogout();
      return rejectWithResponse(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then(() => request(originalRequest));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const isLogin: string | null = localStorage.getItem("is_authenticated");
      if (isLogin) {
        await axios.post(
          `${API_URL}${ENDPOINTS.REFRESH}`,
          {},
          { withCredentials: true },
        );
        processQueue(null, true);
        isRefreshing = false;

        return request(originalRequest);
      } else {
        return rejectWithResponse(error);
      }
    } catch (refreshError) {
      processQueue(refreshError as Error, false);
      isRefreshing = false;

      handleAutoLogout();
      return rejectWithResponse(refreshError as AxiosError);
    }
  },
);
