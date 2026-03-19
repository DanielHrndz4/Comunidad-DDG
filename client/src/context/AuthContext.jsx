// Importa herramientas de React necesarias para crear contexto,
// manejar estados, acceder a contexto y manejar efectos secundarios.
import { createContext, useState, useContext, useEffect } from "react";

// Importa todas las funciones relacionadas con autenticación y administración de usuarios
// desde el módulo de API 'auth.js'.
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
    updatePasswordRequest
} from "../api/auth.js";

// Librería para manejar cookies del navegador.
import Cookies from "js-cookie";

// Crea un contexto global para la autenticación.
export const AuthContext = createContext();

// Hook personalizado que permite acceder al contexto de autenticación.
// Lanza un error si se intenta usar fuera del provider.
export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth debe estar dentro del provider");
    }
    return context;
};

// Componente provider que envuelve la aplicación
// y expone funciones y estados relacionados con autenticación.
export const AuthProvider = ({ children }) => {

    // Estado del usuario autenticado.
    const [user, setUser] = useState();

    // Lista de usuarios para vistas donde sea necesario.
    const [users, setGetUsers] = useState([]);

    // Estado booleano que indica si el usuario está autenticado.
    const [isAuthenticate, setIsAuthenticate] = useState(false);

    // Arreglo de errores para mostrar mensajes al usuario.
    const [errors, setErrors] = useState([]);

    // Estado de carga global (especialmente para verificar sesión).
    const [loading, setLoading] = useState(true);

    // Lista de usuarios obtenidos desde el panel admin.
    const [getAdminUsers, setGetAdminUsers] = useState([]);

    // Actualizar contraseña dado un username y un password.
    const updatePasswordByPassword = async ({ username, password }) => {
        try {
            setErrors([]);
            await updatePasswordRequest({ username, password });
        } catch (error) {
            const data = error.response?.data;
            const msgs = Array.isArray(data)
                ? data
                : [data?.message || "Error al actualizar la contraseña"];
            setErrors(msgs);
            throw error;
        }
    };

    // Registro de usuario normal.
    const signup = async (user) => {
        try {
            const res = await registerRequest(user);
            setUser(res.data);
            setIsAuthenticate(true);
        } catch (error) {
            console.log("Error");
            setErrors(["Vuelva a intentarlo o contacte con el administrador"]);
            throw error;
        }
    }

    // Inicio de sesión.
    const signin = async (user) => {
        try {
            const res = await loginRequest(user);
            setUser(res.data);
            setIsAuthenticate(true);
            setErrors([]);
        } catch (error) {
            console.log("Revise que los campos sean correctos");
            setErrors(["Revise que los campos sean correctos"]);
        }
    }

    // Crear usuario desde el panel admin.
    const createUser = async (userData) => {
        try {
            await registerRequestByAdmin(userData);
            setErrors([]);
        } catch (error) {
            console.log("Error");
            setErrors(["Revise que los campos sean correctos"]);
            throw error;
        }
    };

    // Cerrar sesión: elimina la cookie token y reinicia estados de usuario.
    const logout = () => {
        Cookies.remove("token");
        setIsAuthenticate(false);
        setUser(null);
    }

    // Obtener lista completa de usuarios (vista admin).
    const getUsers = async () => {
        try {
            const res = await getUsersAdmin();
            setGetAdminUsers(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    // Obtener lista de usuarios para vistas de usuario final.
    const getAllUsers = async () => {
        try {
            const res = await getAllUsersForUser();
            setGetUsers(res.data);
        } catch (error) {
            console.log(error);
        }
    }

    // Eliminar usuario desde el panel admin.
    const deleteUser = async (id) => {
        try {
            await deleteUserAdmin(id);
        } catch (error) {
            console.log(error);
        }
    };

    // Obtener un perfil específico por ID.
    const getOneProfile = async (id) => {
        try {
            const res = await getOneProfileUser(id);
            return res.data;
        } catch (error) {
            console.log(error);
        }
    }

    // Actualizar perfil del usuario actual.
    const updateProfile = async (id, profile) => {
        try {
            const res = await updateOneProfile(id, profile);
            const updated = res.data;

            // Fusiona datos antiguos del usuario con los actualizados.
            setUser(prev => ({ ...prev, ...updated }));
            return updated;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    // Agregar un pago asociado a la vigilancia de un usuario.
    const addPay = async (pay) => {
        try {
            const res = await addPayVigilanceFromUser(pay);
        } catch (error) {
            console.log(error);
        }
    }

    // Limpia automáticamente los mensajes de error después de 5 segundos.
    useEffect(() => {
        if (errors.length > 0) {
            const time = setTimeout(() => {
                setErrors([]);
            }, 5000);
            return () => clearTimeout(time);
        }
    }, [errors]);

    // Verifica si existe un token en cookies al cargar la aplicación
    // y valida ese token contra el backend.
    useEffect(() => {
        async function checkLogin() {
            const cookies = Cookies.get();

            // Si no existe token, se limpia estado y se finaliza carga.
            if (!cookies.token) {
                setIsAuthenticate(false);
                setLoading(false);
                return setUser(null);
            }

            try {
                // Verificación del token con el backend.
                const res = await verifyTokenRequest(cookies.token);

                if (!res.data) {
                    setIsAuthenticate(false);
                    setLoading(false);
                    return;
                }

                // Si la verificación es exitosa, establece usuario y autenticación.
                setIsAuthenticate(true);
                setUser(res.data);
                setLoading(false);

            } catch (error) {
                console.log(error);
                setIsAuthenticate(false);
                setUser(null);
                setLoading(false);
            }
        }
        checkLogin();
    }, []);

    // Provee todos los estados y funciones del contexto.
    return (
        <AuthContext.Provider value={{
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
            updatePasswordByPassword
        }}>
            {children}
        </AuthContext.Provider>
    );
};
