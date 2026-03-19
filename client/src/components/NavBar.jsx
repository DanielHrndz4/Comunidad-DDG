// Importa componentes y hooks necesarios:
// - Link: para navegación declarativa entre rutas.
// - useNavigate: hook para navegación programática.
// - assets: colección de imágenes u otros recursos.
// - Popup: componente de pop-up flotante de la librería 'reactjs-popup'.
// - useAuth: hook personalizado para manejar autenticación.
import { Link, useNavigate } from "react-router";
import assets from "../assets";
import Popup from "reactjs-popup";
import { useAuth } from "../context/AuthContext";

// Componente funcional NavBar: barra de navegación superior para la interfaz administrativa.
export default function NavBar() {
    // Obtiene la función logout desde el contexto de autenticación.
    const { logout } = useAuth();

    // Hook para redirigir programáticamente a otras rutas.
    const navigate = useNavigate();

    return (

        // Elemento <nav> que contiene toda la barra de navegación.
        // Usa clases de TailwindCSS para diseño: fondo, flexbox, espaciado y ancho total.
        <nav className="bg-custom-brown flex justify-between items-center py-16 px-32 w-full box-border">
            
            {/* Contenedor izquierdo: icono para volver al inicio del panel admin */}
            <div className="flex items-center gap-10">
                {/* Link a la ruta /admin */}
                <Link to="/admin">
                    <img
                        src={assets.casa}
                        alt="Inicio"
                        className="h-45 cursor-pointer"
                    />
                </Link>
            </div>

            {/* Contenedor derecho del navbar */}
            <div className="flex items-center gap-20">

                {/* Contenedor vacío (posible reserva para futuros elementos de UI) */}
                <div className="flex items-center gap-5">
                </div>

                {/* Popup mostrado al hacer clic en el icono de usuario */}
                <Popup
                    trigger={
                        // Botón que despliega el menú emergente.
                        <button type="button" className="button">
                            <img
                                src={assets.usuario1}
                                alt="Usuario"
                                className="h-45 cursor-pointer"
                            />
                        </button>
                    }
                    // Ubicación del popup y comportamiento de cierre.
                    position="bottom center" 
                    closeOnDocumentClick 
                    arrow={false}
                    keepTooltipInside=".tooltipBoundary"
                >

                    {/* Contenido interno del popup: menú de usuario */}
                    <div className="flex flex-col gap-8 bg-custom-brown border border-white rounded-md p-16 w-210">
                        
                        {/* Botón: ver perfil del usuario */}
                        <button 
                            className="flex justify-between items-center g-10 bg-none border-none cursor-pointer text-[1rem] text-left
                            py-8 px-10 rounded-xl duration-300 ease-in-out text-white hover:bg-dark-slate" 
                            onClick={() => { navigate("/admin/profile") }}
                        >
                            <p style={{color: "white"}}>Ver Perfil</p>
                            <img className="h-20 w-20" src={assets.girar} alt="Ver Perfil" />
                        </button>

                        {/* Botón: cerrar sesión */}
                        <button 
                            className="flex justify-between items-center g-10 bg-none border-none cursor-pointer text-[1rem] text-left
                            py-8 px-10 rounded-xl duration-300 ease-in-out text-white hover:bg-dark-slate" 
                            onClick={() => { logout() }}
                        >
                            <p style={{color: "white"}}>Cerrar sesión</p>
                            <img className="h-20 w-20" src={assets.cerrarSesion} alt="Cerrar sesión" />
                        </button>
                    </div>
                </Popup>

            </div>
        </nav>
    );
}
