import { useNavigate } from "react-router";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-root">
      <div className="right-section-home">
        <h1>Comunidad de Servicio DDG</h1>

        <div className="join-container-home">
          <button
            className="register-button-home"
            onClick={() => navigate("/register")}
          >
            Crear cuenta
          </button>

          <p>¿Ya tienes una cuenta?</p>

          <button
            className="login-button-login"
            onClick={() => navigate("/login")}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}