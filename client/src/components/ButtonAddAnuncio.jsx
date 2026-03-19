import { useNavigate } from "react-router";

function ButtonAddAnuncio({ onClose }) {
    // Hook para navegar programáticamente entre rutas
    const navigate = useNavigate();

    // Función general para manejar la navegación a una ruta específica
    function handleNavigation(route) {
        navigate(route);
    }

    return (
        // Capa oscura de fondo para el modal
        <div className="login-modal-overlay">
            <div className="login-modal">

                {/* Decoración de líneas en la parte superior del modal */}
                <div className="login-divider">
                    <hr className="login-divider-line" />
                    <hr className="login-divider-line" />
                </div>

                {/* Botón para ir a la página de creación de anuncios */}
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
                        onClick={() => { handleNavigation("/admincreateanuncios") }}
                    >
                        Agregar anuncio
                    </button>
                </div>

                <br />
                <br />

                {/* Botón para cerrar el modal */}
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
                        onClick={onClose} // Ejecuta la función pasada desde el padre
                    >
                        Cancelar
                    </button>
                </div>

            </div>
        </div>
    )
};

export default ButtonAddAnuncio;
