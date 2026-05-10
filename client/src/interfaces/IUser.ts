export type UserRole = "admin" | "normal" | "vigilant";

export interface IUser {
  name: string;
  username: string;
  email: string;
  password: string;
  telephone: string;
  age: number;
  role: UserRole;
}