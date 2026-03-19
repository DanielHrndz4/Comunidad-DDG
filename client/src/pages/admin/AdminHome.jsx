// Importa hook para navegación programática entre rutas.
import { useNavigate } from "react-router";

// Importa recursos de imágenes locales.
import assets from "../../assets";

// Importa componente que renderiza un contenedor de HomeCards.
import HomeCardContainer from "../../components/HomeCardContainer";

// Importa formulario de pagos para vigilancia.
import PayVigilanceForm from "../../components/forms/PayVigilanceForm";

// Hook para manejar estado local del componente.
import { useState } from "react";

// Importa Popup para mostrar modales.
import Popup from "reactjs-popup";

// Componente de la página de inicio para administradores.
export default function AdminHome() {
    // Hook de navegación.
    const navigate = useNavigate();

    // Estado booleano que indica si se debe mostrar el popup de pago.
    const [paying, openPay] = useState();

    // Función para cerrar el popup.
    const closePopup = () => openPay(false);

    // Array de objetos que define las tarjetas del menú de administración.
    // Cada objeto tiene:
    // - text: texto que se mostrará en la tarjeta
    // - image: icono asociado
    // - callback: función a ejecutar al hacer click
    const menuCards = [
        { text: "Reportes", image: assets.formularioDeLlenado, callback: () => navigate("/admin/reports") },
        { text: "Anuncios", image: assets.nota, callback: () => navigate("/admin/tasks") },
        { text: "Gestión de pagos", image: assets.dinero, callback: () => openPay(true) },
        { text: "Gestión de usuarios", image: assets.tarjetaDeIdentificacion, callback: () => navigate("/admin/users") },
    ];

    return (
        // Contenedor principal de la página, con flexbox centrado y padding.
        <div className="flex grow-1 flex-col justify-center items-center p-29 w-full box-border">

            {/* Renderiza las tarjetas del menú usando HomeCardContainer */}
            <HomeCardContainer cards={menuCards} />

            {/* Popup modal para la gestión de pagos de vigilancia */}
            <Popup
                open={paying}                    // Estado para abrir/cerrar el popup
                onClose={closePopup}             // Función de cierre
                lockScroll={true}                // Bloquea scroll del fondo
                position="top center"            // Posición del popup
                closeOnDocumentClick={false}     // No cierra al click en el fondo
                modal={true}                     // Establece como modal
                overlayStyle={{ background: 'rgba(0,0,0,0.5)' }}  // Estilo de overlay semitransparente
                contentStyle={{ maxHeight: '95%', overflow: 'auto' }} // Estilo interno
            >
                {/* Formulario de pago de vigilancia dentro del popup */}
                <PayVigilanceForm close={closePopup} />
            </Popup>
        </div>
    );
}
