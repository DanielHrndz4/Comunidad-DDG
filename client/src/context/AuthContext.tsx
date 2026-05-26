import {
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";

import {
  registerRequest,
  loginRequest,
  verifyTokenRequest,
  getUsersAdmin,
  deleteUserAdmin,
  getOneProfileUser,
  updateOneProfile,
  addPayVigilanceFromUser,
  getAllUsersForUser,
  registerRequestByAdmin,
  updatePasswordRequest,
} from "../api/auth.js";

import Cookies from "js-cookie";

import type {
  AuthContextType,
  AuthProviderProps,
  LoginData,
  UpdatePasswordData,
} from "../interfaces/IAuthContext";

import type { IUser } from "../interfaces/IUser";
import type { IPayment } from "../interfaces/IPayment";

export const AuthContext =
  createContext<AuthContextType | null>(null);

export const useAuth = (): AuthContextType => {

  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth debe estar dentro del provider"
    );
  }

  return context;
};

export const AuthProvider = ({
  children,
}: AuthProviderProps) => {

  const [user, setUser] =
    useState<IUser | null>(null);

  const [users, setGetUsers] =
    useState<IUser[]>([]);

  const [isAuthenticate, setIsAuthenticate] =
    useState<boolean>(false);

  const [errors, setErrors] =
    useState<string[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [getAdminUsers, setGetAdminUsers] =
    useState<IUser[]>([]);

  const updatePasswordByPassword = async (
    data: UpdatePasswordData
  ): Promise<void> => {

    const {
      username,
      password,
    } = data;

    try {

      setErrors([]);

      await updatePasswordRequest({
        username,
        password,
      });

    } catch (error: unknown) {

      const err = error as {
        response?: {
          data?: unknown;
        };
      };

      const data =
        err.response?.data;

      const msgs =
        Array.isArray(data)
          ? (data as string[])
          : [
              (
                data as {
                  message?: string;
                } | undefined
              )?.message ||
                "Error al actualizar la contraseña",
            ];

      setErrors(msgs);

      throw error;
    }
  };

  const signup = async (
    userData: IUser
  ): Promise<void> => {

    try {

      const res =
        await registerRequest(userData);

      setUser(res.data.data);

      setIsAuthenticate(true);

    } catch (error: unknown) {

      console.log("Error");

      setErrors([
        "Vuelva a intentarlo o contacte con el administrador",
      ]);

      throw error;
    }
  };

  const signin = async (
    userData: LoginData
  ): Promise<void> => {

    try {

      const res =
        await loginRequest(userData);

      setUser(res.data.data);

      setIsAuthenticate(true);

      setErrors([]);

    } catch (error: unknown) {

      console.log(
        "Revise que los campos sean correctos"
      );

      setErrors([
        "Revise que los campos sean correctos",
      ]);
    }
  };

  const createUser = async (
    userData: IUser
  ): Promise<void> => {

    try {

      await registerRequestByAdmin(
        userData
      );

      setErrors([]);

    } catch (error: unknown) {

      console.log("Error");

      setErrors([
        "Revise que los campos sean correctos",
      ]);

      throw error;
    }
  };

  const logout = (): void => {

    Cookies.remove("token");

    setIsAuthenticate(false);

    setUser(null);
  };

  const getUsers = async (): Promise<void> => {

    try {

      const res =
        await getUsersAdmin();

      setGetAdminUsers(res.data.data);

    } catch (error: unknown) {

      console.log(error);
    }
  };

  const getAllUsers = async (): Promise<void> => {

    try {

      const res =
        await getAllUsersForUser();

      setGetUsers(res.data.data);

    } catch (error: unknown) {

      console.log(error);
    }
  };

  const deleteUser = async (
    id: string
  ): Promise<void> => {

    try {

      await deleteUserAdmin(id);

    } catch (error: unknown) {

      console.log(error);
    }
  };

  const getOneProfile = async (
    id: string
  ): Promise<IUser | undefined> => {

    try {

      const res =
        await getOneProfileUser(id);

      return res.data.data;

    } catch (error: unknown) {

      console.log(error);

      return undefined;
    }
  };

  const updateProfile = async (
    id: string,
    profile: Partial<IUser>
  ): Promise<IUser | undefined> => {

    try {

      const res =
        await updateOneProfile(
          id,
          profile
        );

      const updated = res.data.data;

      setUser((prev) => ({
        ...(prev ?? {}),
        ...updated,
      }));

      return updated;

    } catch (error: unknown) {

      console.log(error);

      throw error;
    }
  };

  const addPay = async (
    pay: IPayment
  ): Promise<void> => {

    try {

      await addPayVigilanceFromUser(
        pay
      );

    } catch (error: unknown) {

      console.log(error);
    }
  };

  useEffect(() => {

    if (errors.length > 0) {

      const time =
        setTimeout(() => {

          setErrors([]);

        }, 5000);

      return () =>
        clearTimeout(time);
    }

  }, [errors]);

  useEffect(() => {

    async function checkLogin() {

      const cookies =
        Cookies.get() as Record<
          string,
          string | undefined
        >;

      if (!cookies.token) {

        setIsAuthenticate(false);

        setLoading(false);

        setUser(null);

        return;
      }

      try {

        const res =
          await verifyTokenRequest();

        if (!res.data.data) {

          setIsAuthenticate(false);

          setLoading(false);

          return;
        }

        setIsAuthenticate(true);

        setUser(res.data.data);

        setLoading(false);

      } catch (error: unknown) {

        console.log(error);

        setIsAuthenticate(false);

        setUser(null);

        setLoading(false);
      }
    }

    checkLogin();

  }, []);

  return (
    <AuthContext.Provider
      value={{
        signup,

        loading,

        user,

        isAuthenticate,

        setIsAuthenticate,

        errors,

        signin,

        logout,

        getAdminUsers,

        getUsers,

        deleteUser,

        getOneProfile,

        updateProfile,

        addPay,

        users,

        getAllUsers,

        createUser,

        updatePasswordByPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};