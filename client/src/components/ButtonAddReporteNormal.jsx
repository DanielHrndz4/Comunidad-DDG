import { useNavigate } from "react-router";

// Componente que muestra un modal para agregar un reporte desde un usuario normal.
// onClose: función recibida por props para cerrar el modal.
function ButtonAddReporteNormal({onClose}) {

    // Hook que permite redirigir a otras rutas dentro de la app.
    const navigate = useNavigate();

    // Función que realiza la navegación hacia la ruta indicada.
    function handleNavigation(route) {
        navigate(route);
    }

    return (
        // Contenedor oscuro que funciona como fondo del modal.
        <div className="login-modal-overlay">
            <div className="login-modal">

                {/* Líneas decorativas del modal */}
                <div className="login-divider">
                    <hr className="login-divider-line" />
                    <hr className="login-divider-line" />
                </div>

                {/* Botón que navega al formulario de creación de reportes para usuarios normales */}
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
                        onClick={() => { handleNavigation("/userReport") }}
                    >
                        Agregar reporte
                    </button>
                </div>

                <br />
                <br />

                {/* Botón que cierra el modal utilizando la función onClose */}
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

export default ButtonAddReporteNormal;
