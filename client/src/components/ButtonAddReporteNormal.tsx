import { useNavigate } from "react-router";

interface ButtonAddReporteNormalProps {
  onClose: () => void;
}

// Componente que muestra un modal para agregar un reporte desde un usuario normal.
export default function ButtonAddReporteNormal({
  onClose,
}: ButtonAddReporteNormalProps) {
  // Hook que permite redirigir a otras rutas dentro de la app.
  const navigate = useNavigate();

  // Función que realiza la navegación hacia la ruta indicada.
  function handleNavigation(route: string): void {
    navigate(route);
  }

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <div className="login-divider">
          <hr className="login-divider-line" />
          <hr className="login-divider-line" />
        </div>

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
              transition: "background-color 0.3s",
            }}
            onClick={() => {
              handleNavigation("/userReport");
            }}
          >
            Agregar reporte
          </button>
        </div>

        <br />
        <br />

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
              transition: "background-color 0.3s",
            }}
            onClick={onClose}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
