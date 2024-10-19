import api from "./axios";

const getAll = (page?: number, pageSize?: number) => {
  return api.get("/user/all", {
    params: {
      page,
      limit: pageSize,
    },
  });
};

interface IUpdateProfilePayload {
  email: string;
  phone: string;
  address: string;
  firstName: string;
  lastName: string;
}

const updateProfile = ({
  email,
  phone,
  address,
  firstName,
  lastName,
}: IUpdateProfilePayload) => {
  return api.post("/user/update", {
    email,
    phone,
    address,
    firstName,
    lastName,
  });
};

export const userApi = {
  getAll,
  updateProfile,
};
