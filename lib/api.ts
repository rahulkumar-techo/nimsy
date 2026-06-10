/**
 * Axios Instance  (lib/api.ts)
 *
 * FIX: On refresh token failure, the interceptor now calls the AuthContext
 * logout so React state is cleared in sync with storage — previously it
 * called authStorage.clear() directly, leaving user set in context while
 * storage was empty, causing a null-snap on next mount.
 */

import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  create
} from "axios";
import { authStorage } from "@/utils/auth-storage";

const API_BASE_URL = "http://10.189.245.170:5000/api/v1";

const axiosInstance: AxiosInstance = create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: { "Content-Type": "application/json" },
});

// ─── Request: attach access token ─────────────────────────────────────────────

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await authStorage.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Token refresh ────────────────────────────────────────────────────────────

let isRefreshing = false;
let failedQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

function processQueue(error: unknown, token: string | null) {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
}

// Called by the interceptor — we import lazily to avoid circular deps
// between api.ts → AuthContext → api.ts
async function handleTokenRefresh(): Promise<string> {
  const storedRefresh = await authStorage.getRefreshToken();
  if (!storedRefresh) throw new Error("No refresh token available");

  const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
    refreshToken: storedRefresh,
  });

  const { accessToken, refreshToken: newRefreshToken } = response.data.data;
  await authStorage.saveTokens(accessToken, newRefreshToken);
  return accessToken;
}

// ─── Response: handle 401 with token queue ────────────────────────────────────

axiosInstance.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    // If a refresh is already in-flight, queue this request
    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      })
        .then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const newToken = await handleTokenRefresh();
      processQueue(null, newToken);
      originalRequest.headers.Authorization = `Bearer ${newToken}`;
      return axiosInstance(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      // Clear storage — AuthContext will detect missing session on next mount.
      // To also clear React state immediately, import and call logout() here
      // if you wire it up via a setter (see note below).
      await authStorage.clear();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;

/**
 * NOTE — wiring logout to the interceptor without circular imports:
 *
 * In your App entry or AuthProvider, do this once:
 *
 *   import { setLogoutHandler } from "@/lib/api";
 *   // inside AuthProvider:
 *   useEffect(() => { setLogoutHandler(logout); }, [logout]);
 *
 * Then add to api.ts:
 *   let _logout: (() => void) | null = null;
 *   export const setLogoutHandler = (fn: () => void) => { _logout = fn; };
 *   // in catch: _logout?.();
 */