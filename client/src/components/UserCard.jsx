// Importa los estilos específicos para el componente UserCard.
// Este archivo CSS controla la apariencia visual de la tarjeta de usuario.
import "./UserCard.css";

// Componente funcional UserCard.
// Recibe una prop llamada 'usr', que contiene información del usuario
// (por ejemplo, name y email).
export default function UserCard({ usr }) {
    return (
        // Contenedor principal que agrupa la tarjeta del usuario.
        // La clase 'cards-container' se encarga de la disposición y estilo general.
        <div className="cards-container">  {/* Contenedor para las cards */}

            {/* Tarjeta individual del usuario */}
            <div className="card-user">

                {/* Muestra el nombre del usuario.
                    - Se usa style inline para centrar el texto.
                    - Clases Tailwind para tamaño, color y peso de fuente. */}
                <h2 style={{textAlign: "center"}} className="text-[1.5rem] text-dark-gray font-bold">
                    {usr.name}
                </h2>

                {/* Muestra el email del usuario.
                    - También centrado y con estilo tipográfico a través de Tailwind. */}
                <p style={{textAlign: "center"}} className="text-[1rem] text-light-gray font-bold">
                    {usr.email}
                </p>
            </div>
        </div>
    );
}
