import type {
  Dispatch,
  ReactNode,
  SetStateAction,
} from "react";

import type { IUser } from "./IUser";
import type { IPayment } from "./IPayment";
import type {
  LoginFormData,
  RegisterFormData,
} from "./IAuthForms";

export interface LoginData {
  username: string;
  password: string;
}

export interface UpdatePasswordData {
  username: string;
  password: string;
}

export interface AuthProviderProps {
  children: ReactNode;
}

export interface AuthContextType {
  signup: (
    userData: RegisterFormData
  ) => Promise<void>;

  signin: (
    user: LoginFormData
  ) => Promise<void>;

  logout: () => void;

  createUser: (
    userData: RegisterFormData
  ) => Promise<void>;

  updatePasswordByPassword: (
    data: UpdatePasswordData
  ) => Promise<void>;

  getUsers: () => Promise<void>;

  deleteUser: (
    id: string
  ) => Promise<void>;

  getOneProfile: (
    id: string
  ) => Promise<IUser | undefined>;

  updateProfile: (
    id: string,
    profile: Partial<IUser>
  ) => Promise<IUser | undefined>;

  addPay: (
    pay: IPayment
  ) => Promise<void>;

  getAllUsers: () => Promise<void>;

  loading: boolean;

  user: IUser | null;

  isAuthenticate: boolean;

  setIsAuthenticate: Dispatch<
    SetStateAction<boolean>
  >;

  errors: string[];

  getAdminUsers: IUser[];

  users: IUser[];
}