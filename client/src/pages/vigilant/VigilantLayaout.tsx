// Importamos el componente NavBarVigilant, que será la barra de navegación de la vista Vigilant
import NavBar from "../../components/NavBar";
// Importamos Outlet de react-router para renderizar las rutas hijas dentro de este layout
import { Outlet } from "react-router";

// Componente funcional VigilantLayout, que actúa como layout para las vistas de "Vigilant"
export default function VigilantLayout() {

    return (
        // Contenedor principal del layout
        // Clases de Tailwind:
        // - font-sans: fuente sans-serif
        // - bg-custom-white: fondo blanco personalizado
        // - h-content: altura basada en el contenido
        // - min-h-screen: mínimo altura igual a la altura de la pantalla
        // - m-0: sin margen
        // - flex flex-col: display flex en columna
        // - tooltipBoundary: clase personalizada, probablemente para manejar tooltips dentro del layout
        <div className="font-sans bg-transparent h-content min-h-screen m-0 flex flex-col tooltipBoundary">
            {/* Renderizamos la barra de navegación */}
            <NavBar />
            {/* Outlet renderiza cualquier ruta hija que se defina en react-router */}
            <Outlet />
        </div>
    );
}
