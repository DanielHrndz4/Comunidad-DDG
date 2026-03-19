import { useNavigate } from "react-router";

function ButtonAddAnuncioNormal({ onClose }) {
    // Hook de React Router para navegar entre rutas
    const navigate = useNavigate();

    // Función que redirige a la ruta recibida como argumento
    function handleNavigation(route) {
        navigate(route);
    }

    return (
        // Contenedor que oscurece el fondo (overlay del modal)
        <div className="login-modal-overlay">
            <div className="login-modal">

                {/* Líneas decorativas dentro del modal */}
                <div className="login-divider">
                    <hr className="login-divider-line" />
                    <hr className="login-divider-line" />
                </div>

                {/* Botón que lleva al usuario normal a la página para agregar anuncios */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <button
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "gray",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "bold",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            transition: "background-color 0.3s"
                        }}
                        // Al hacer click navega a la sección de anuncios del usuario normal
                        onClick={() => { handleNavigation("/userAnuncios") }}
                    >
                        Agregar anuncio
                    </button>
                </div>

                <br />
                <br />

                {/* Botón para cerrar el modal, ejecuta onClose enviado como prop */}
                <div style={{ display: "flex", justifyContent: "center" }}>
                    <button
                        style={{
                            padding: "10px 20px",
                            backgroundColor: "#e74c3c",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            cursor: "pointer",
                            fontSize: "16px",
                            fontWeight: "bold",
                            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                            transition: "background-color 0.3s"
                        }}
                        onClick={onClose}
                    >
                        Cancelar
                    </button>
                </div>

            </div>
        </div>
    )
};

export default ButtonAddAnuncioNormal;
