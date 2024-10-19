import { ICheckIn, ICheckInConfig, ISpecialDay } from "../models/CheckIn";
import { IUser } from "../models/User";
import api, { IResponse } from "./axios";

const getList = () => {
  return api.get("/game/getAll");
};

const deleteUser = (userId: string) => {
  return api.post<
    unknown,
    IResponse<{
      data: null;
    }>
  >("/user/delete", { userId });
};

const deleteUsers = (usernames: string[]) => {
  return api.post("/game/deleteUsers", { usernames });
};

export interface IUpdateUserPayload {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

const updateUser = (data: IUpdateUserPayload) => {
  return api.post("/game/updateUser", data);
};

const updateCoin = (coins: string, userId: string) => {
  return api.post<unknown, IResponse<IUser>>("/game/updateCoin", {
    coins,
    userId,
  });
};

const searchUser = (username: string) => {
  return api.get<
    unknown,
    IResponse<{
      users: IUser[];
      totalDocs: number;
      totalPages: number;
      page: number;
    }>
  >("/user/search", {
    params: {
      username,
    },
  });
};

const getCheckInHistory = (id: string) => {
  return api.get<
    unknown,
    IResponse<{
      docs: ICheckIn[];
      totalPages: number;
      page: number;
    }>
  >("/checkin/history", {
    params: {
      user: id,
    },
  });
};

const getCheckInConfig = () => {
  return api.get<unknown, IResponse<ICheckInConfig>>("/checkin/getConfig");
};

const updateRewardCoin = (coins: number) => {
  return api.post<unknown, IResponse<ICheckInConfig>>(
    "/checkin/updateDefaultCoin",
    {
      coins,
    }
  );
};

const updateSpecialDayCoin = (id: string, coins: number) => {
  return api.post<unknown, IResponse<ICheckInConfig>>(
    "/checkin/updateSpecialDay",
    {
      id,
      coins,
    }
  );
};

const deleteSpecialDay = (id: string) => {
  return api.post<unknown, IResponse<ICheckInConfig>>(
    "/checkin/deleteSpecialDay",
    {
      id,
    }
  );
};

const addSpecialDay = (coins: number, date: string) => {
  return api.post<unknown, IResponse<ISpecialDay>>("/checkin/addSpecialDay", {
    coins,
    date,
  });
};

export const gameApi = {
  getList,
  deleteUser,
  updateUser,
  deleteUsers,
  updateCoin,
  searchUser,
  getCheckInHistory,
  getCheckInConfig,
  updateRewardCoin,
  updateSpecialDayCoin,
  deleteSpecialDay,
  addSpecialDay,
};
