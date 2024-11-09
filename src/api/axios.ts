import axios from "axios";
import { TOKEN_EXPIRED } from "../context/action";
import { getDispatchFunction } from "../context/UserContext";
import { getLocalItem, setLocalItem } from "../services/localData";
import { authApi } from "./authApi";

export enum IResponseMessage {
  OK = "OK",
}

export interface IResponse<T> {
  data: T;
  message: IResponseMessage;
}

export interface IErrorResponse {
  message: IResponseMessage;
}

interface FailedQueuePromise {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
}

let isRefreshToken = false;
let failedQueue: FailedQueuePromise[] = []; // Queue to hold requests that failed due to token expiration

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const api = axios.create({
  baseURL: `${process.env["REACT_APP_API_URL"]}/api/v1`,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

api.interceptors.request.use((config) => {
  const token = getLocalItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => {
    const { status } = response;

    // 1. Should refresh token when status response 401
    // if status is response code 401, we need to send request token here
    if (status === 401) {
      if (!getLocalItem("access_token")) {
        return Promise.reject(response);
      }

      // if (!isRefreshToken) {
      //   // update isRefreshToken to true
      //   isRefreshToken = true;

      //   // call api to renew token
      // }
    }

    return response.data;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response.status === 401 && !originalRequest._retry) {
      // Check if the access token is expired
      if (isRefreshToken) {
        // If already refreshing, return a promise that resolves when the refresh is done
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return api(originalRequest);
          })
          .catch((err) => {
            const dispatch = getDispatchFunction();

            if (dispatch) {
              dispatch({ type: TOKEN_EXPIRED });
            }
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshToken = true;

      const refreshToken = getLocalItem("refresh_token");
      if (refreshToken) {
        try {
          // Call your API to refresh the token
          const { data } = await authApi.getNewToken(refreshToken);
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
            data;

          // Update the tokens in local storage
          setLocalItem("access_token", newAccessToken);
          setLocalItem("refresh_token", newRefreshToken);

          api.defaults.headers["Authorization"] = "Bearer " + newAccessToken; // Set the new access token in defaults

          // Retry the original request with the new access token
          originalRequest.headers["Authorization"] = "Bearer " + newAccessToken;

          processQueue(null, newAccessToken); // Process the queue
          return api(originalRequest);
        } catch (err) {
          processQueue(err, null); // Process the queue with error

          const dispatch = getDispatchFunction();

          if (dispatch) {
            dispatch({ type: TOKEN_EXPIRED });
          }
          return Promise.reject(err);
        } finally {
          isRefreshToken = false;
          originalRequest._retry = false;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default api;
