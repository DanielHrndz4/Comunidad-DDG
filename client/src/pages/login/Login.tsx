import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { FiUser, FiMail, FiLock, FiPhone, FiX, FiEye, FiEyeOff } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import ResetPassword from "../login-access/ResetPassword";
import "./Login.css";

import type { LoginFormData, RegisterFormData } from "../../interfaces/IAuthForms";

interface LoginProps {
  initialMode?: "signin" | "signup";
  onClose?: () => void;
}

export default function Login({
  initialMode = "signin",
  onClose,
}: LoginProps) {
  const [isSignUp, setIsSignUp] = useState<boolean>(initialMode === "signup");
  const [showResetPassword, setShowResetPassword] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);
  const [registeredEmail, setRegisteredEmail] = useState<string>("");

  const [showPasswordSignUp, setShowPasswordSignUp] = useState<boolean>(false);
  const [showConfirmPasswordSignUp, setShowConfirmPasswordSignUp] = useState<boolean>(false);
  const [showPasswordSignIn, setShowPasswordSignIn] = useState<boolean>(false);

  const {
    signin,
    signup,
    errors: authErrorsRaw,
    isAuthenticate,
    user,
  } = useAuth();

  const navigate = useNavigate();

  const handleClose = (): void => {
    if (onClose) {
      onClose();
    } else {
      navigate("/");
    }
  };

  const authErrors: string[] = Array.isArray(authErrorsRaw) ? authErrorsRaw : [];

  // Form for signing in
  const {
    register: registerLogin,
    handleSubmit: handleSubmitLogin,
    formState: { errors: loginErrors },
    reset: resetLoginForm,
  } = useForm<LoginFormData>();

  // Form for signing up
  const {
    register: registerSignup,
    handleSubmit: handleSubmitSignup,
    formState: { errors: signupFormErrors },
    reset: resetSignupForm,
  } = useForm<RegisterFormData>();

  const handleResetPasswordClick = (): void => {
    setShowResetPassword(true);
  };

  const handleCloseResetPasswordClick = (): void => {
    setShowResetPassword(false);
  };

  const onSubmitLogin = handleSubmitLogin(async (data) => {
    await signin(data);
  });

  const onSubmitSignup = handleSubmitSignup(async (values) => {
    if (values.password !== values.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    try {
      const payload: RegisterFormData = {
        ...values,
        role: "normal",
      };

      setRegisteredEmail(values.email);
      await signup(payload);
      setSubmitted(true);
    } catch (error: unknown) {
      console.error("Error al crear cuenta:", error);
    }
  });

  // Handle redirects on success
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

  // Handle signup success message
  useEffect(() => {
    if (submitted) {
      if (authErrors.length === 0) {
        setSuccessMessage("¡Cuenta creada con éxito! Redirigiendo a verificación OTP...");
        const timer = setTimeout(() => {
          setSuccessMessage("");
          navigate("/verify-otp", { state: { email: registeredEmail } });
        }, 2000);
        return () => clearTimeout(timer);
      }
      setSubmitted(false);
    }
  }, [authErrors, submitted, registeredEmail, navigate]);

  const handleOverlayClick = () => {
    handleClose();
  };

  return (
    <div className="login-modal-overlay" onClick={handleOverlayClick}>
      {/* Decorative backdrop shapes */}
      <div className="bg-shape yellow-circle"></div>
      <div className="bg-shape red-triangle"></div>

      <div
        className={`login-modal-container ${isSignUp ? "right-panel-active" : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Sign Up Form Container */}
        <div className="auth-form-container sign-up-container">
          {onClose && (
            <button type="button" className="close-btn" onClick={handleClose} aria-label="Cerrar modal">
              <FiX />
            </button>
          )}
          
          <form onSubmit={onSubmitSignup} className="auth-form">
            <h1 className="auth-form-title">Crear Cuenta</h1>
            
            <span className="auth-form-sep">Ingresa tus datos para registrarte:</span>
            
            <div className="signup-grid">
              <div className="input-group">
                <FiUser className="input-icon" />
                <input
                  type="text"
                  placeholder="Nombre"
                  {...registerSignup("name", { required: "El nombre es requerido" })}
                />
              </div>

              <div className="input-group">
                <FiUser className="input-icon" />
                <input
                  type="text"
                  placeholder="Usuario"
                  {...registerSignup("username", { required: "El usuario es requerido" })}
                />
              </div>

              <div className="input-group">
                <FiMail className="input-icon" />
                <input
                  type="email"
                  placeholder="Email"
                  {...registerSignup("email", { 
                    required: "El email es requerido",
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: "Correo inválido"
                    }
                  })}
                />
              </div>

              <div className="input-group">
                <FiPhone className="input-icon" />
                <input
                  type="text"
                  placeholder="Teléfono"
                  {...registerSignup("telephone", { 
                    required: "El teléfono es requerido",
                    pattern: {
                      value: /^\d+$/,
                      message: "Solo números"
                    },
                    minLength: {
                      value: 8,
                      message: "Mínimo 8 dígitos"
                    }
                  })}
                />
              </div>

              <div className="input-group" style={{ position: "relative" }}>
                <FiLock className="input-icon" />
                <input
                  type={showPasswordSignUp ? "text" : "password"}
                  placeholder="Contraseña"
                  style={{ paddingRight: "35px" }}
                  {...registerSignup("password", { 
                    required: "La contraseña es requerida",
                    minLength: {
                      value: 8,
                      message: "Mínimo 8 caracteres"
                    }
                  })}
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordSignUp(!showPasswordSignUp)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#8fa09b",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2
                  }}
                >
                  {showPasswordSignUp ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>

              <div className="input-group" style={{ position: "relative" }}>
                <FiLock className="input-icon" />
                <input
                  type={showConfirmPasswordSignUp ? "text" : "password"}
                  placeholder="Confirmar Contraseña"
                  style={{ paddingRight: "35px" }}
                  {...registerSignup("confirmPassword", { required: "Confirme la contraseña" })}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPasswordSignUp(!showConfirmPasswordSignUp)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#8fa09b",
                    padding: "4px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 2
                  }}
                >
                  {showConfirmPasswordSignUp ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Error notifications */}
            {Object.values(signupFormErrors).length > 0 && (
              <p className="error-text-summary">
                {Object.values(signupFormErrors)[0]?.message}
              </p>
            )}

            {isSignUp && authErrors.map((error, i) => (
              <p className="error-text-summary" key={i}>
                {error}
              </p>
            ))}

            {successMessage && (
              <p className="success-text">
                {successMessage}
              </p>
            )}

            <button type="submit" className="action-btn">REGISTRARSE</button>

            <div className="mobile-toggle">
              ¿Ya tienes una cuenta?{" "}
              <span onClick={() => { setIsSignUp(false); resetSignupForm(); }}>
                Inicia sesión
              </span>
            </div>
          </form>
        </div>

        {/* Sign In Form Container */}
        <div className="auth-form-container sign-in-container">
          {onClose && (
            <button type="button" className="close-btn" onClick={handleClose} aria-label="Cerrar modal">
              <FiX />
            </button>
          )}
          
          <form onSubmit={onSubmitLogin} className="auth-form">
            <h1 className="auth-form-title">Iniciar Sesión</h1>
            
            <span className="auth-form-sep">Ingresa tus credenciales:</span>
            
            <div className="input-group">
              <FiUser className="input-icon" />
              <input
                type="text"
                placeholder="Usuario"
                {...registerLogin("username", { required: "El usuario es requerido" })}
              />
            </div>

            <div className="input-group" style={{ position: "relative" }}>
              <FiLock className="input-icon" />
              <input
                type={showPasswordSignIn ? "text" : "password"}
                placeholder="Contraseña"
                style={{ paddingRight: "35px" }}
                {...registerLogin("password", { required: "La contraseña es requerida" })}
              />
              <button
                type="button"
                onClick={() => setShowPasswordSignIn(!showPasswordSignIn)}
                style={{
                  position: "absolute",
                  right: "12px",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#8fa09b",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 2
                }}
              >
                {showPasswordSignIn ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>

            <a
              href="#"
              className="forgot-password-link"
              onClick={(e) => {
                e.preventDefault();
                handleResetPasswordClick();
              }}
            >
              ¿Olvidaste tu contraseña?
            </a>

            {/* Error notifications */}
            {Object.values(loginErrors).length > 0 && (
              <p className="error-text-summary">
                {Object.values(loginErrors)[0]?.message}
              </p>
            )}

            {!isSignUp && authErrors.map((error, i) => (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <p className="error-text-summary">
                  {error}
                </p>
                {error.toLowerCase().includes("verifica") && (
                  <button
                    type="button"
                    onClick={() => navigate("/verify-otp")}
                    className="verify-now-btn"
                  >
                    Verificar mi cuenta ahora
                  </button>
                )}
              </div>
            ))}

            <button type="submit" className="action-btn">INICIAR SESIÓN</button>

            <div className="mobile-toggle">
              ¿No tienes una cuenta?{" "}
              <span onClick={() => { setIsSignUp(true); resetLoginForm(); }}>
                Regístrate
              </span>
            </div>
          </form>
        </div>

        {/* Overlay Sliding Panels Container */}
        <div className="overlay-container">
          <div className="overlay">
            
            {/* Left Overlay Panel */}
            <div className="overlay-panel overlay-left">
              <div className="diprella-brand">
                <svg className="diprella-logo-svg" width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="24" height="24" rx="5" />
                  <circle cx="8" cy="8" r="2.5" />
                  <rect x="6" y="14" width="4" height="8" rx="1" />
                  <path d="M16 6a6 6 0 0 1 6 6" />
                  <circle cx="19" cy="18" r="1.5" fill="currentColor" />
                </svg>
                <span className="diprella-logo-text">Comunidad DDG</span>
              </div>

              {/* Decorative shapes */}
              <div className="overlay-bg-shape shape-diamond-1"></div>
              <div className="overlay-bg-shape shape-diamond-2"></div>
              <div className="overlay-bg-shape shape-circle"></div>

              <h1 className="overlay-title">¡Bienvenido de nuevo!</h1>
              <p className="overlay-desc">
                Para mantenerte conectado con nosotros por favor inicia sesión con tu información personal
              </p>
              <button
                type="button"
                className="ghost-btn"
                onClick={() => {
                  setIsSignUp(false);
                  resetSignupForm();
                }}
              >
                INICIAR SESIÓN
              </button>
            </div>

            {/* Right Overlay Panel */}
            <div className="overlay-panel overlay-right">
              <div className="diprella-brand">
                <svg className="diprella-logo-svg" width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="24" height="24" rx="5" />
                  <circle cx="8" cy="8" r="2.5" />
                  <rect x="6" y="14" width="4" height="8" rx="1" />
                  <path d="M16 6a6 6 0 0 1 6 6" />
                  <circle cx="19" cy="18" r="1.5" fill="currentColor" />
                </svg>
                <span className="diprella-logo-text">Comunidad DDG</span>
              </div>

              {/* Decorative shapes */}
              <div className="overlay-bg-shape shape-diamond-1"></div>
              <div className="overlay-bg-shape shape-diamond-2"></div>
              <div className="overlay-bg-shape shape-circle"></div>

              <h1 className="overlay-title">¡Hola, Amigo!</h1>
              <p className="overlay-desc">
                Ingresa tus datos personales y comienza tu viaje con nosotros
              </p>
              <button
                type="button"
                className="ghost-btn"
                onClick={() => {
                  setIsSignUp(true);
                  resetLoginForm();
                }}
              >
                REGISTRARSE
              </button>
            </div>

          </div>
        </div>

      </div>

      {showResetPassword && (
        <ResetPassword onClose={handleCloseResetPasswordClick} />
      )}
    </div>
  );
}