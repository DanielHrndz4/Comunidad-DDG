import { useNavigate } from "react-router";

interface ButtonAddAnuncioNormalProps {
  onClose: () => void;
}

export default function ButtonAddAnuncioNormal({
  onClose,
}: ButtonAddAnuncioNormalProps) {
  // Hook de React Router para navegar entre rutas
  const navigate = useNavigate();

  // Función que redirige a la ruta recibida como argumento
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
              handleNavigation("/userAnuncios");
            }}
          >
            Agregar anuncio
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