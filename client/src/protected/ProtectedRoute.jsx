// Importamos el contexto de autenticación para obtener el estado del usuario
import { useAuth } from "../context/AuthContext";
// Importamos Navigate y Outlet de react-router
import { Navigate, Outlet } from "react-router";

// Componente funcional ProtectedRoute
// Se utiliza para proteger rutas que requieren que el usuario esté autenticado
export default function ProtectedRoute() {
    // Extraemos el estado de autenticación y si aún está cargando
    const { loading, isAuthenticate } = useAuth();

    // Si la información de autenticación todavía se está cargando, mostramos un mensaje temporal
    if (loading) return <h3>Loading..</h3>;

    // Si el usuario no está autenticado, lo redirigimos a la página de inicio ("/")
    if (!isAuthenticate) return <Navigate to={"/"} replace />;

    // Si el usuario está autenticado, renderizamos las rutas hijas definidas en Outlet
    return (<Outlet />);
};
