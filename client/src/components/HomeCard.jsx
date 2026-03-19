// Componente funcional 'HomeCard' que recibe una prop llamada 'card'.
// Mediante destructuring, extrae las propiedades: text, image y callback.
function HomeCard({ card: { text, image, callback } }) {

    return (
        // Contenedor principal del componente.
        // Usa múltiples clases de TailwindCSS para:
        // - Definir fondo, padding, tamaño fijo y bordes redondeados.
        // - Configurar layout flex en columna y centrar el contenido.
        // - Aplicar transiciones, sombras y efectos hover (traslación y cambio de fondo).
        // - Habilitar el comportamiento de cursor tipo botón.
        // El evento onClick ejecuta la función 'callback' pasada como prop.
        <div className="bg-custom-gray p-20 rounded-[10px] w-240 h-240 flex flex-col justify-center
            items-center text-center duration-300 ease-in-out cursor-pointer shadow-md
            hover:-translate-y-10 hover:bg-hover-gray hover:shadow-lg"
            onClick={callback}>

            {/* Imagen principal de la tarjeta.
                - 'src' recibe la ruta de la imagen desde la prop 'image'.
                - 'alt' usa el texto de la tarjeta para accesibilidad.
                - La clase 'h-120' controla la altura y 'mb-10' agrega margen inferior. */}
            <img className="h-120 mb-10" src={image} alt={text} />

            {/* Texto de la tarjeta, estilizado con Tailwind:
                - 'text-custom-slate' define el color.
                - 'font-bold' aplica negritas.
                - 'm-0' quita márgenes del párrafo. */}
            <p className="text-custom-slate font-bold m-0">{text}</p>
        </div>
    );
}

// Exportación por defecto del componente, permitiendo su importación directa.
export default HomeCard;
