import { AUTH_ENDPOINTS } from "@/constants/auth.constants";
import { authStorage } from "@/features/auth/utils/auth-storage";
import axios, { AxiosInstance, InternalAxiosRequestConfig, create } from "axios";

const API_BASE_URL = "http://10.161.161.170:5000/api/v1";

const axiosInstance: AxiosInstance = create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// ─── Request Interceptor ──────────────────────────────────────────────────────

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // DEBUG: Inspect config before appending the access token
    debugger; 
    const token = await authStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // DEBUG: Triggered if there's an error configuration before sending the request
    debugger; 
    return Promise.reject(error);
  }
);

// ─── Token Refresh Queue Utilities ────────────────────────────────────────────

let isRefreshing = false;
let failedQueue: { resolve: (token: string) => void; reject: (err: unknown) => void }[] = [];

function processQueue(error: unknown, token: string | null) {
  // DEBUG: Inspect the queue length and the incoming error/token resolving it
  debugger; 
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
}

async function handleTokenRefresh(): Promise<string> {
  const storedRefresh = await authStorage.getRefreshToken();
  if (!storedRefresh) {
    // DEBUG: Hit if refresh token is missing in storage during a 401 retry
    debugger; 
    throw new Error("No refresh token available");
  }

  // DEBUG: Paused right before making the refresh API network call
  debugger; 
  const response = await axios.post(`${API_BASE_URL}${AUTH_ENDPOINTS.REFRESH_TOKEN}`, {
    refreshToken: storedRefresh,
  });
  console.log(response);

  const { accessToken, refreshToken: newRefreshToken } = response.data.data;
  await authStorage.saveTokens(accessToken, newRefreshToken);
  return accessToken;
}

// ─── Response Interceptor ─────────────────────────────────────────────────────

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // DEBUG: Inspect any error that hits the interceptor (401, 403, 500, etc.)
    debugger; 

    if (error.response?.status !== 401 || originalRequest?._retry) {
      // DEBUG: Request failed, but it's either NOT a 401 or it's a 401 that already retried
      debugger; 
      return Promise.reject(error);
    }

    if (isRefreshing) {
      // DEBUG: Another request is already refreshing tokens; queueing this request
      debugger; 
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => {
          // DEBUG: Queued request failed after the refresh token attempt failed
          debugger; 
          return Promise.reject(err);
        });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // DEBUG: This request is initiating the token refresh process
      debugger; 
      const newToken = await handleTokenRefresh();
      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      
      // DEBUG: Retrying the original request with the brand new token
      debugger; 
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      // DEBUG: Token refresh failed completely (e.g., refresh token expired)
      debugger; 
      processQueue(refreshError, null);
      await authStorage.clear();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;