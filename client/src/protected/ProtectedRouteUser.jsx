// Importamos el contexto de autenticación para obtener información del usuario
import { useAuth } from "../context/AuthContext";
// Importamos Navigate y Outlet de react-router
import { Navigate, Outlet } from "react-router";

// Componente funcional ProtectedRouteUser
// Se utiliza para proteger rutas que solo usuarios que NO son admin ni vigilante pueden acceder
export default function ProtectedRouteUser() {
    // Extraemos el estado de autenticación, si está cargando y la información del usuario
    const { loading, isAuthenticate, user } = useAuth();

    // Mientras se carga la información de autenticación, mostramos mensaje de carga
    if (loading) return <h3>Loading..</h3>;

    // Si el usuario no está autenticado, lo redirigimos a la página de inicio
    if (!isAuthenticate) return <Navigate to={"/"} replace />;

    // Si el usuario tiene un rol que NO es "admin" ni "vigilant", renderizamos las rutas hijas
    if((user.role !== "admin") && (user.role !== "vigilant")) return (<Outlet />);

    // Nota: si el usuario es admin o vigilante, no se renderiza nada
    // Se podría mejorar mostrando una página de "Acceso denegado"
};
