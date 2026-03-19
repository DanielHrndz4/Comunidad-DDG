// Importa hook de estado para manejar la visibilidad de los modales.
import { useState } from "react";

// Importa estilos específicos para la página Home.
import "./Home.css";

// Importa los componentes de Login y Register (modales).
import Login from "../login/Login";
import Register from "../register/Register";

// Componente principal de la página de inicio/Home.
function Home() {

  // Estado para controlar la visibilidad del modal de Login.
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Estado para controlar la visibilidad del modal de Register.
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  // Función para abrir el modal de Login.
  const handleLoginClick = () => {
    setShowLoginModal(true);
  };

  // Función para abrir el modal de Registro.
  const handleRegisterClick = () => {
    setShowRegisterModal(true);
  };

  // Función para cerrar el modal de Login.
  const handleCloseLoginModal = () => {
    setShowLoginModal(false);
  };

  // Función para cerrar el modal de Registro.
  const handleCloseRegisterModal = () => {
    setShowRegisterModal(false);
  };

  return (
    // Contenedor principal de la página Home.
    <div className="home-root">

      {/* Sección derecha con título y botones */}
      <div className="right-section-home">
        <h1 style={{color: "white"}}>COMUNIDAD DE SERVICIO DDG</h1>
        <div className="join-container-home">

          {/* Botón para abrir el modal de registro */}
          <button className="register-button-home" onClick={handleRegisterClick}>
            Crear cuenta
          </button>

          {/* Texto informativo */}
          <p style={{color: "white"}}>¿Ya tienes una cuenta?</p>

          {/* Botón para abrir el modal de Login */}
          <button className="login-button-login" onClick={handleLoginClick}>
            Iniciar sesión
          </button>
        </div>
      </div>

      {/* Renderización condicional de los modales */}
      {showLoginModal && <Login onClose={handleCloseLoginModal} />}
      {showRegisterModal && <Register onClose={handleCloseRegisterModal} />}
    </div>
  );
}

// Exporta el componente Home como predeterminado.
export default Home;
