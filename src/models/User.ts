export interface IUser {
  _id: string;
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: "user" | "admin";
  coins: number;
  verified: boolean;
  createdAt: Date;
}
