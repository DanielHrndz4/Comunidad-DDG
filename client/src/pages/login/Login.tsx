import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";

import { useAuth } from "../../context/AuthContext";
import ResetPassword from "../login-access/ResetPassword";
import "./Login.css";

interface LoginProps {
  onClose: () => void;
}

interface LoginFormData {
  username: string;
  password: string;
}

export default function Login({
  onClose,
}: LoginProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();

  const {
    signin,
    errors: signinErrorsRaw,
    isAuthenticate,
    user,
  } = useAuth();

  const [showResetPassword, setReserPasswordModal] =
    useState<boolean>(false);

  const navigate = useNavigate();

  const signinErrors: string[] = Array.isArray(
    signinErrorsRaw
  )
    ? signinErrorsRaw
    : [];

  const handleReserPasswordClick = (): void => {
    setReserPasswordModal(true);
  };

  const handleCloseReserPasswordClick = (): void => {
    setReserPasswordModal(false);
    onClose();
  };

  const onSubmit = handleSubmit(
    async (data: LoginFormData) => {
      await signin(data);
    }
  );

  useEffect(() => {
    if (isAuthenticate && user?.role) {
      switch (user.role) {
        case "admin":
          navigate("/admin");
          break;
        case "vigilant":
          navigate("/vigilant");
          break;
        default:
          navigate("/user");
      }
    }
  }, [isAuthenticate, user, navigate]);

  const closeForm = (): void => {
    onClose();
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <h2 className="login-title">
          Inicio de sesión
        </h2>

        <div className="login-divider">
          <hr className="login-divider-line" />
          <hr className="login-divider-line" />
        </div>

        {signinErrors.map((error, i) => (
          <div
            className="login-error"
            key={i}
          >
            {error}
          </div>
        ))}

        <form
          onSubmit={onSubmit}
          className="login-form"
        >
          <input
            style={{ color: "white" }}
            type="text"
            {...register("username", {
              required: true,
            })}
            className="login-input"
            placeholder="Usuario"
          />
          {errors.username && (
            <p className="login-error-text">
              El usuario es requerido
            </p>
          )}

          <input
            style={{ color: "white" }}
            type="password"
            {...register("password", {
              required: true,
            })}
            className="login-input"
            placeholder="Contraseña"
          />
          {errors.password && (
            <p className="login-error-text">
              La contraseña es requerida
            </p>
          )}

          <button
            style={{
              background: "white",
              color: "black",
            }}
            type="submit"
            className="login-button"
          >
            Aceptar
          </button>
        </form>

        <p style={{ color: "white" }}>
          <Link
            to="/"
            style={{ color: "white" }}
            className="login-register-link"
            onClick={handleReserPasswordClick}
          >
            ¿Olvidaste tu clave? Cambiar clave
          </Link>
        </p>

        <p
          onClick={closeForm}
          style={{
            color: "white",
            cursor: "pointer",
          }}
        >
          ¿No tienes cuenta? Ve a registrarte
        </p>

        <button
          type="button"
          style={{
            padding: "8px",
            cursor: "pointer",
            color: "gray",
          }}
          onClick={onClose}
        >
          Cancelar
        </button>
      </div>

      {showResetPassword && (
        <ResetPassword
          onClose={handleCloseReserPasswordClick}
        />
      )}
    </div>
  );
}