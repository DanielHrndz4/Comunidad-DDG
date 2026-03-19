// Importa un objeto llamado 'assets' desde el directorio '../assets'.
// Este objeto normalmente contiene rutas a imágenes u otros recursos estáticos.
import assets from "../assets";

// Componente funcional de React que recibe una propiedad 'text'.
// Esta propiedad se usa para mostrar el texto del botón.
export default function CreateButton({ text }) {
    return (
        // Contenedor principal con la clase 'add-schedule', usada para estilos.
        <div className="add-schedule" >
            {/* Muestra el texto recibido a través del prop 'text' */}
            <span>{text}</span>

            {/* Imagen del ícono para agregar.
                - src: obtiene la imagen desde assets.agregar
                - alt: describe la función del ícono para accesibilidad
                - className: permite estilizar la imagen mediante CSS */}
            <img
                src={assets.agregar}
                alt="Agregar horario"
                className="add-icon"
            />
        </div>
    )
}
