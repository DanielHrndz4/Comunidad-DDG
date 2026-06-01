import { useState } from "react";

import "./Home.css";
import Login from "../login/Login";
import Register from "../register/Register";

export default function Home() {
  const [showLoginModal, setShowLoginModal] =
    useState<boolean>(false);

  const [showRegisterModal, setShowRegisterModal] =
    useState<boolean>(false);

  const handleLoginClick = (): void => {
    setShowLoginModal(true);
  };

  const handleRegisterClick = (): void => {
    setShowRegisterModal(true);
  };

  const handleCloseLoginModal = (): void => {
    setShowLoginModal(false);
  };

  const handleCloseRegisterModal = (): void => {
    setShowRegisterModal(false);
  };

  return (
    <div className="home-root">
      <div className="right-section-home">
        <h1 style={{ color: "white" }}>
          COMUNIDAD DE SERVICIO DDG
        </h1>

        <div className="join-container-home">
          <button
            className="register-button-home"
            onClick={handleRegisterClick}
          >
            Crear cuenta
          </button>

          <p style={{ color: "white" }}>
            ¿Ya tienes una cuenta?
          </p>

          <button
            className="login-button-login"
            onClick={handleLoginClick}
          >
            Iniciar sesión
          </button>
        </div>
      </div>

      {showLoginModal && (
        <Login onClose={handleCloseLoginModal} />
      )}

      {showRegisterModal && (
        <Register onClose={handleCloseRegisterModal} />
      )}
    </div>
  );
}