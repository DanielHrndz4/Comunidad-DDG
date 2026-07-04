export type UserRole = "admin" | "normal" | "vigilant";

export interface IUser {
  id?: string;
  _id?: string;
  name: string;
  username: string;
  email: string;
  password: string;
  telephone: string;
  age?: number;
  role: UserRole;
}