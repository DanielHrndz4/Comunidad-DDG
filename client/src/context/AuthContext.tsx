import {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
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
import type { UserRole } from "../interfaces/router.interface";

// ---- Tipos mínimos (sin inventar estructura de tu backend) ----
type GenericObject = Record<string, unknown>;

export interface AuthUser extends GenericObject {
  role?: UserRole; // clave para ProtectedRoute
}

export interface AuthContextValue {
  signup: (user: GenericObject) => Promise<void>;
  signin: (user: GenericObject) => Promise<void>;
  logout: () => void;

  createUser: (userData: GenericObject) => Promise<void>;
  updatePasswordByPassword: (data: { username: string; password: string }) => Promise<void>;

  getUsers: () => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  getOneProfile: (id: string) => Promise<unknown>;
  updateProfile: (id: string, profile: GenericObject) => Promise<unknown>;

  addPay: (pay: GenericObject) => Promise<void>;
  getAllUsers: () => Promise<void>;

  loading: boolean;
  user: AuthUser | null;
  isAuthenticate: boolean;
  setIsAuthenticate: React.Dispatch<React.SetStateAction<boolean>>;
  errors: string[];

  getAdminUsers: unknown[];
  users: unknown[];
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe estar dentro del provider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [users, setGetUsers] = useState<unknown[]>([]);
  const [isAuthenticate, setIsAuthenticate] = useState<boolean>(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [getAdminUsers, setGetAdminUsers] = useState<unknown[]>([]);

  const updatePasswordByPassword = async ({
    username,
    password,
  }: {
    username: string;
    password: string;
  }): Promise<void> => {
    try {
      setErrors([]);
      await updatePasswordRequest({ username, password });
    } catch (error: unknown) {
      const err = error as { response?: { data?: unknown } };
      const data = err.response?.data;

      const msgs =
        Array.isArray(data)
          ? (data as string[])
          : [
              (data as { message?: string } | undefined)?.message ||
                "Error al actualizar la contraseña",
            ];

      setErrors(msgs);
      throw error;
    }
  };

  const signup = async (userData: GenericObject): Promise<void> => {
    try {
      const res = (await registerRequest(userData)) as { data: AuthUser };
      setUser(res.data);
      setIsAuthenticate(true);
    } catch (error: unknown) {
      console.log("Error");
      setErrors(["Vuelva a intentarlo o contacte con el administrador"]);
      throw error;
    }
  };

  const signin = async (userData: GenericObject): Promise<void> => {
    try {
      const res = (await loginRequest(userData)) as { data: AuthUser };
      setUser(res.data);
      setIsAuthenticate(true);
      setErrors([]);
    } catch (error: unknown) {
      console.log("Revise que los campos sean correctos");
      setErrors(["Revise que los campos sean correctos"]);
    }
  };

  const createUser = async (userData: GenericObject): Promise<void> => {
    try {
      await registerRequestByAdmin(userData);
      setErrors([]);
    } catch (error: unknown) {
      console.log("Error");
      setErrors(["Revise que los campos sean correctos"]);
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
      const res = (await getUsersAdmin()) as { data: unknown[] };
      setGetAdminUsers(res.data);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const getAllUsers = async (): Promise<void> => {
    try {
      const res = (await getAllUsersForUser()) as { data: unknown[] };
      setGetUsers(res.data);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const deleteUser = async (id: string): Promise<void> => {
    try {
      await deleteUserAdmin(id);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const getOneProfile = async (id: string): Promise<unknown> => {
    try {
      const res = (await getOneProfileUser(id)) as { data: unknown };
      return res.data;
    } catch (error: unknown) {
      console.log(error);
      return undefined;
    }
  };

  const updateProfile = async (
    id: string,
    profile: GenericObject
  ): Promise<unknown> => {
    try {
      const res = (await updateOneProfile(id, profile)) as { data: GenericObject };
      const updated = res.data;

      setUser((prev) => ({ ...(prev ?? {}), ...updated } as AuthUser));
      return updated;
    } catch (error: unknown) {
      console.log(error);
      throw error;
    }
  };

  const addPay = async (pay: GenericObject): Promise<void> => {
    try {
      await addPayVigilanceFromUser(pay);
    } catch (error: unknown) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (errors.length > 0) {
      const time = setTimeout(() => {
        setErrors([]);
      }, 5000);
      return () => clearTimeout(time);
    }
  }, [errors]);

  useEffect(() => {
    async function checkLogin() {
      const cookies = Cookies.get() as Record<string, string | undefined>;

      if (!cookies.token) {
        setIsAuthenticate(false);
        setLoading(false);
        setUser(null);
        return;
      }

      try {
        const res = (await verifyTokenRequest()) as { data?: AuthUser };

        if (!res.data) {
          setIsAuthenticate(false);
          setLoading(false);
          return;
        }

        setIsAuthenticate(true);
        setUser(res.data);
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