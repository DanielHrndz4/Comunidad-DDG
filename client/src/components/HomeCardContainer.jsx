// Importa el componente HomeCard, que será utilizado para renderizar cada tarjeta individual.
import HomeCard from "./HomeCard";

// Componente funcional 'HomeCardContainer'.
// Recibe una prop llamada 'cards', que se espera sea un arreglo de objetos
// con la estructura necesaria para renderizar un HomeCard.
function HomeCardContainer({ cards }) {
    return (
        // Contenedor principal que usa clases de TailwindCSS:
        // - flex: disposición en flexbox.
        // - justify-center y items-center: centra los elementos horizontal y verticalmente.
        // - gap-60: define el espaciado entre tarjetas.
        // - flex-wrap: permite que las tarjetas salten a otra fila si no cabe todo en una línea.
        // - w-full: ocupa todo el ancho disponible.
        // - max-w-900: limita el ancho a un máximo específico.
        // - mt=40: (probablemente debería ser mt-40) aplica margen superior.
        <div className="flex justify-center items-center gap-60 flex-wrap w-full max-w-900 mt=40">

            {/* Itera el arreglo 'cards' y genera un componente HomeCard por cada objeto.
                - key={index}: usa el índice como clave (válido aunque no óptimo en todos los casos).
                - card={i}: pasa el objeto actual como prop al componente HomeCard. */}
            {cards.map((i, index) => <HomeCard key={index} card={i} />)}
        </div>
    );
}

// Exporta el contenedor para su uso en otros componentes.
export default HomeCardContainer;
