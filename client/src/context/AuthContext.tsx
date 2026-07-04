import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";

import {
  registerRequest,
  loginRequest,
  verifyTokenRequest,
  logoutRequest,
  getUsersAdmin,
  deleteUserAdmin,
  getOneProfileUser,
  updateOneProfile,
  addPayVigilanceFromUser,
  getPaymentsRequest,
  getAllUsersForUser,
  registerRequestByAdmin,
  updatePasswordRequest,
  requestPasswordResetRequest,
  confirmPasswordResetRequest,
} from "../api/auth";


import type {
  AuthContextType,
  AuthProviderProps,
  LoginData,
  UpdatePasswordData,
} from "../interfaces/IAuthContext";

import type { IUser } from "../interfaces/IUser";
import type { IPayment, IPaymentRecord } from "../interfaces/IPayment";
import { RegisterFormData } from "@/interfaces/IAuthForms";

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

  const requestPasswordReset = async (
    emailOrUsername: string
  ): Promise<{ email: string }> => {
    try {
      setErrors([]);
      const res = await requestPasswordResetRequest(emailOrUsername);
      return res.data.data;
    } catch (error: unknown) {
      const err = error as {
        response?: {
          data?: unknown;
        };
        message?: string;
      };
      const data = err.response?.data;
      const msgs = Array.isArray(data)
        ? (data as string[])
        : [
          (data as { message?: string } | undefined)?.message ||
          err.message ||
          "Error al solicitar código OTP",
        ];
      setErrors(msgs);
      throw error;
    }
  };

  const confirmPasswordReset = async (
    data: { emailOrUsername: string; otp: string; password: string }
  ): Promise<void> => {
    try {
      setErrors([]);
      await confirmPasswordResetRequest(data);
    } catch (error: unknown) {
      const err = error as {
        response?: {
          data?: unknown;
        };
        message?: string;
      };
      const data = err.response?.data;
      const msgs = Array.isArray(data)
        ? (data as string[])
        : [
          (data as { message?: string } | undefined)?.message ||
          err.message ||
          "Error al restablecer la contraseña",
        ];
      setErrors(msgs);
      throw error;
    }
  };

  const signup = async (
    userData: RegisterFormData
  ): Promise<void> => {

    try {

      const res =
        await registerRequest(userData);

      setUser(res.data.data);

      setIsAuthenticate(true);

    } catch (error: unknown) {

      const err = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };

      const backendMessage =
        err.response?.data?.message ||
        err.message ||
        "Vuelva a intentarlo o contacte con el administrador";

      setErrors([backendMessage]);

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

      const err = error as {
        response?: {
          data?: {
            message?: string;
          };
        };
        message?: string;
      };

      const backendMessage =
        err.response?.data?.message ||
        err.message ||
        "Revise que los campos sean correctos";

      setErrors([backendMessage]);
    }
  };

  const createUser = async (
    userData: RegisterFormData
  ): Promise<void> => {
    try {
      const res = await registerRequestByAdmin(userData);

      setGetAdminUsers((prev) => [
        ...prev,
        res.data.data.user ?? res.data.data,
      ]);

      setErrors([]);
    } catch (error: unknown) {
      const err = error as {
        response?: {
          data?: {
            message?: string;
            errors?: string[];
          };
        };
      };

      console.log("CREATE USER ERROR:", err.response?.data);

      const backendMessage =
        err.response?.data?.message ||
        "Revise que los campos sean correctos";

      setErrors([backendMessage]);

      throw error;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await logoutRequest();
    } catch (_) {
      // ignore if server is unreachable
    }
    setIsAuthenticate(false);
    setUser(null);
  };


  const getUsers = useCallback(async (): Promise<void> => {
    try {
      const res = await getUsersAdmin();
      setGetAdminUsers(res.data.data);
    } catch (error: unknown) {
      console.log(error);
    }
  }, []);

  const getAllUsers = useCallback(async (): Promise<void> => {
    try {
      const res = await getAllUsersForUser();
      setGetUsers(res.data.data);
    } catch (error: unknown) {
      console.log(error);
    }
  }, []);

  const deleteUser = async (
    id: string
  ): Promise<void> => {
    try {
      await deleteUserAdmin(id);

      setGetAdminUsers((prev) =>
        prev.filter((u) => {
          const userId = u._id ?? u.id;
          return userId !== id;
        })
      );

      setGetUsers((prev) =>
        prev.filter((u) => {
          const userId = u._id ?? u.id;
          return userId !== id;
        })
      );
    } catch (error: unknown) {
      console.log(error);
      throw error;
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
      await updateOneProfile(id, profile);

      const freshRes = await getOneProfileUser(id);
      const freshUser = freshRes.data.data as IUser;

      if (user && (user._id === id || user.id === id)) {
        setUser((prev) => ({
          ...(prev ?? {}),
          ...freshUser,
        }));
      }

      setGetAdminUsers((prev) =>
        prev.map((u) => {
          const userId = u._id ?? u.id;
          return userId === id ? { ...u, ...freshUser } : u;
        })
      );

      setGetUsers((prev) =>
        prev.map((u) => {
          const userId = u._id ?? u.id;
          return userId === id ? { ...u, ...freshUser } : u;
        })
      );

      return freshUser;
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

  const getPayments = async (): Promise<IPaymentRecord[]> => {
    try {
      const res = await getPaymentsRequest();
      if (res.data && res.data.data) {
        return res.data.data;
      }
      return [];
    } catch (error: unknown) {
      console.error("Error al obtener pagos:", error);
      return [];
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

        // Token missing or invalid — user is not authenticated
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

        getPayments,

        users,

        getAllUsers,

        createUser,

        updatePasswordByPassword,

        requestPasswordReset,

        confirmPasswordReset,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};