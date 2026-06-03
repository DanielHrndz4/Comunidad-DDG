// Importa el componente de navegación para el layout de administrador.
import NavBar from "../../components/NavBar";

// Importa Outlet de react-router para renderizar las rutas hijas dentro del layout.
import { Outlet } from "react-router";

// Componente que define el layout general para la sección de administrador.
export default function AdminLayout() {

    return (
        // Contenedor principal del layout:
        // - Fuente por defecto: sans
        // - Fondo blanco personalizado
        // - Altura mínima de pantalla completa
        // - Flex vertical para colocar NavBar y contenido
        // - 'tooltipBoundary' usado para limitar tooltips o popups dentro del layout
        <div className="font-sans bg-custom-white h-content min-h-screen m-0 flex flex-col tooltipBoundary">
            
            {/* Barra de navegación fija en la parte superior */}
            <NavBar />

            {/* Outlet renderiza las rutas hijas definidas en react-router */}
            <Outlet />
        </div>
    );
}
