import { useNavigate } from "react-router";

function ButtonAddReport({ onClose }) {
    // Hook de React Router que permite navegar entre rutas
    const navigate = useNavigate();

    // Función encargada de redirigir a la ruta especificada
    function handleNavigation(route) {
        navigate(route);
    }

    return (
        // Fondo oscuro del modal
        <div className="login-modal-overlay">
            <div className="login-modal">

                {/* Líneas decorativas dentro del modal */}
                <div className="login-divider">
                    <hr className="login-divider-line" />
                    <hr className="login-divider-line" />
                </div>

                {/* Botón para redirigir al formulario de creación de reportes */}
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
                        // Redirección al área de creación de reportes del administrador
                        onClick={() => { handleNavigation("/admincreatereports") }}
                    >
                        Agregar reporte
                    </button>
                </div>

                <br />
                <br />

                {/* Botón para cerrar el modal usando la función enviada por props */}
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

export default ButtonAddReport;
