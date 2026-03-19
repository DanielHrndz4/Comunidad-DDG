// Importamos el contexto de autenticación para obtener el estado del usuario
import { useAuth } from "../context/AuthContext";
// Importamos Navigate y Outlet de react-router
import { Navigate, Outlet } from "react-router";

// Componente funcional ProtectedRouteAdmin
// Se utiliza para proteger rutas que solo los usuarios con rol "admin" pueden acceder
export default function ProtectedRouteAdmin() {
    // Extraemos el estado de autenticación, si está cargando y la información del usuario
    const { loading, isAuthenticate, user } = useAuth();

    // Mientras se carga la información de autenticación, mostramos mensaje de carga
    if (loading) return <h3>Loading..</h3>;

    // Si el usuario no está autenticado, lo redirigimos a la página de inicio
    if (!isAuthenticate) return <Navigate to={"/"} replace />;

    // Si el usuario está autenticado y su rol es "admin", renderizamos las rutas hijas
    if(user.role === "admin") return (<Outlet />);

    // Nota: si el usuario está autenticado pero no es admin, no se renderiza nada
    // Se podría mejorar mostrando una página de "Acceso denegado"
};
