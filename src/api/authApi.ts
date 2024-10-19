import { IUser } from "../models/User";
import api, { IResponse } from "./axios";

interface ILoginPayload {
  username: string;
  password: string;
}

interface ILoginResponse {
  user: IUser;
  accessToken: string;
  refreshToken: string;
}

interface ITokenResponse {
  accessToken: string;
  refreshToken: string;
}

const login = ({ username, password }: ILoginPayload) => {
  return api.post<unknown, IResponse<ILoginResponse>>(`/auth/sign-in`, {
    username,
    password,
  });
};

const getNewToken = (refreshToken: string) => {
  return api.post<unknown, IResponse<ITokenResponse>>("/auth/refreshToken", {
    refreshToken,
  });
};

const logout = (refreshToken: string) => {
  return api.post<unknown, IResponse<null>>("/auth/sign-out", {
    refreshToken,
  });
};

export const authApi = {
  login,
  getNewToken,
  logout,
};
