export interface ICheckIn {
  _id: string;
  user: string;
  coins: number;
  createdAt: Date;
}

export interface ISpecialDay {
  _id: string;
  date: Date;
  coins: number;
}

export interface ICheckInConfig {
  _id: string;
  defaultCoins: number;
  specialDays: ISpecialDay[];
  createdAt: Date;
}
