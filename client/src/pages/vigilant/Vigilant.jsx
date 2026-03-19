// Importamos useState de React para manejar estados locales si fuera necesario (aunque no se usa aquí)
import { useState } from "react";
// Importamos Link y useNavigate de react-router para navegación entre rutas
import { Link, useNavigate } from "react-router";
// Importamos los assets de imágenes desde la carpeta src/assets
import assets from "../../../src/assets";
// Importamos un componente personalizado que mostrará las tarjetas en la página principal
import HomeCardContainer from "../../components/HomeCardContainer";

// Componente funcional llamado Vigilant
function Vigilant() {
    // Inicializamos useNavigate para poder redirigir a otras rutas programáticamente
    const navigate = useNavigate();

    // Definimos un arreglo de tarjetas que se mostrarán en la interfaz
    const menuCards = [
        { 
            text: "Registro de visitas", // Texto que se muestra en la tarjeta
            image: assets.tarjetaDeIdentificacion, // Imagen que se muestra en la tarjeta
            callback: () => navigate("/visits") // Función que se ejecuta al hacer clic, redirige a la ruta /visits
        },
        { 
            text: "Horarios",
            image: assets.calendario,
            callback: () => navigate("/schedules") // Redirige a la ruta /schedules al hacer clic
        },
    ];

    return (
        // Contenedor principal de la página, con estilos de flexbox y padding
        <div className="flex grow-1 flex-col justify-center items-center p-29 w-full box-border">
            {/* Renderizamos el componente HomeCardContainer pasando las tarjetas definidas */}
            <HomeCardContainer cards={menuCards} />
        </div>
    );
}

// Exportamos el componente para que pueda ser usado en otras partes de la aplicación
export default Vigilant;
