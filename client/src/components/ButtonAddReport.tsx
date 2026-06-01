import { useNavigate } from "react-router";

interface ButtonAddReportProps {
  onClose: () => void;
}

export default function ButtonAddReport({
  onClose,
}: ButtonAddReportProps) {
  // Hook de React Router que permite navegar entre rutas
  const navigate = useNavigate();

  // Función encargada de redirigir a la ruta especificada
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
              handleNavigation("/admincreatereports");
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