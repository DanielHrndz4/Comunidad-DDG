// Importamos el contexto de autenticación para obtener información del usuario
import { useAuth } from "../context/AuthContext";
// Importamos Navigate y Outlet de react-router
import { Navigate, Outlet } from "react-router";

// Componente funcional ProtectedRouteVigilant
// Se utiliza para proteger rutas que solo los usuarios con rol "vigilant" pueden acceder
export default function ProtectedRouteVigilant() {
    // Extraemos el estado de autenticación, si está cargando y la información del usuario
    const { loading, isAuthenticate, user } = useAuth();

    // Mientras se carga la información de autenticación, mostramos mensaje de carga
    if (loading) return <h3>Loading..</h3>;

    // Si el usuario no está autenticado, lo redirigimos a la página de inicio
    if (!isAuthenticate) return <Navigate to={"/"} replace />;

    // Si el usuario tiene rol "vigilant", renderizamos las rutas hijas
    if(user.role === "vigilant") return (<Outlet />);

    // Nota: si el usuario es de otro rol, no se renderiza nada
    // Se podría mejorar mostrando una página de "Acceso denegado"
};
