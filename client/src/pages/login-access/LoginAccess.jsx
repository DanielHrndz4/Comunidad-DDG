// Importa hook de navegación de react-router para redireccionamiento programático.
import { useNavigate } from "react-router";

// Importa los recursos de imagen y assets.
import assets from "../../assets";

// Componente que renderiza un contenedor de tarjetas en la Home.
import HomeCardContainer from "../../components/HomeCardContainer";

// Formulario de pago para usuarios normales.
import PayVigilanceForUserNormal from "../../components/forms/PayVigilanceFormUserNormal";

// Hook de React para manejar estado local.
import { useState } from "react";

// Componente de popup/modal.
import Popup from "reactjs-popup";

// Componente principal de la Home para usuarios normales.
function UserHome() {

    const navigate = useNavigate();

    // Estado para controlar la visibilidad del popup de pago.
    const [paying, openPay] = useState();

    // Función para cerrar el popup.
    const closePopup = () => openPay(false);

    // Configuración de tarjetas del menú con texto, imagen y callback.
    const menuCards = [
        { text: "Reportes", image: assets.formularioDeLlenado, callback: () => navigate("/userReport") },
        { text: "Anuncios", image: assets.nota, callback: () => navigate("/userAnuncios") },
        { text: "Gestión de pagos", image: assets.dinero, callback: () => openPay(true) },
        { text: "Lista de usuarios", image: assets.tarjetaDeIdentificacion, callback: () => navigate("/allUsers") },
    ];

    return (
        // Contenedor principal de la página Home.
        <div className="flex grow-1 flex-col justify-center items-center p-29 w-full box-border">

            {/* Renderiza las tarjetas del menú */}
            <HomeCardContainer cards={menuCards} />

            {/* Popup modal para formulario de pagos */}
            <Popup 
                open={paying} 
                onClose={closePopup} 
                lockScroll={true} 
                position="top center" 
                closeOnDocumentClick={false} 
                modal={true}
                overlayStyle={{ background: 'rgba(0,0,0,0.5)' }} 
                contentStyle={{ maxHeight: '95%', overflow: 'auto' }}
            >
                <PayVigilanceForUserNormal close={closePopup} />
            </Popup>
        </div>
    );
}

// Exporta el componente como predeterminado.
export default UserHome;
