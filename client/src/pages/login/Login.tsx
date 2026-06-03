import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import type { RegisterFormData } from "../../interfaces/IAuthForms";
import "./Login.css";

/* ─── Tipos ─────────────────────────────────────── */
interface LoginFormData {
  username: string;
  password: string;
}

type RegisterViewFormData = Omit<RegisterFormData, "role">;

/* ════════════════════════════════════════════════ */
export default function Login() {
  const [vista, setVista] = useState<"login" | "registro" | "reset">("login");

  return (
    <div className="login-page">
      {/* ── PANEL IZQUIERDO ── */}
      <div className="login-panel-left">
        {/* Marca */}
        <div className="login-branding">
          <div className="login-logo">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5z" fill="white" />
              <path
                d="M2 17l10 5 10-5M2 12l10 5 10-5"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="login-brand-name">Comunidad DDG</span>
        </div>

        {/* Contenido principal */}
        <div className="login-panel-left-inner">
          {vista === "login" && (
            <FormularioLogin
              onIrRegistro={() => setVista("registro")}
              onIrReset={() => setVista("reset")}
            />
          )}
          {vista === "registro" && (
            <FormularioRegistro onIrLogin={() => setVista("login")} />
          )}
          {vista === "reset" && (
            <FormularioReset onIrLogin={() => setVista("login")} />
          )}
        </div>

        {/* Legal */}
        <p className="login-legal">
          Al continuar aceptas los{" "}
          <Link to="/">Términos de Servicio</Link> y la{" "}
          <Link to="/">Política de Privacidad</Link> de Comunidad DDG.
        </p>
      </div>

      {/* ── PANEL DERECHO: QUOTE ── */}
      <div className="login-panel-right">
        <div className="login-quote-icon">"</div>
        <p className="login-quote-text">
          Gestiona tu comunidad de forma fácil, segura y en tiempo real.
          Todo lo que necesitas en un solo lugar.
        </p>
        <div className="login-quote-author">
          <div className="login-quote-avatar">
            <span>D</span>
          </div>
          <span className="login-quote-handle">@comunidad_ddg</span>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════
   FORMULARIO DE LOGIN
   ════════════════════════════════════════════════ */
function FormularioLogin({
  onIrRegistro,
  onIrReset,
}: {
  onIrRegistro: () => void;
  onIrReset: () => void;
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>();
  const { signin, errors: signinErrorsRaw, isAuthenticate, user } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const navigate = useNavigate();

  const signinErrors: string[] = Array.isArray(signinErrorsRaw) ? signinErrorsRaw : [];

  const onSubmit = handleSubmit(async (data) => { await signin(data); });

  useEffect(() => {
    if (isAuthenticate && user?.role) {
      switch (user.role) {
        case "admin":    navigate("/admin");    break;
        case "vigilant": navigate("/vigilant"); break;
        default:         navigate("/user");
      }
    }
  }, [isAuthenticate, user, navigate]);

  return (
    <>
      <h1 className="login-title text-center">Bienvenido de nuevo</h1>
      <p className="login-subtitle text-center">Inicia sesión en tu cuenta</p>

      {signinErrors.map((e, i) => (
        <div className="login-error" key={i}>{e}</div>
      ))}

      <form onSubmit={onSubmit} className="login-form">
        {/* Usuario */}
        <div className="login-input-group">
          <label className="login-label">Usuario</label>
          <input
            type="text"
            {...register("username", { required: true })}
            className="login-input"
            placeholder="tu_usuario"
          />
          {errors.username && <p className="login-error-text">El usuario es requerido</p>}
        </div>

        {/* Contraseña */}
        <div className="login-input-group">
          <div className="login-field-header">
            <label className="login-label">Contraseña</label>
            <button type="button" className="login-forgot-link" onClick={onIrReset}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <div className="login-input-wrapper">
            <input
              type={showPass ? "text" : "password"}
              {...register("password", { required: true })}
              className="login-input"
              placeholder="••••••••"
              style={{ paddingRight: "42px" }}
            />
            <button type="button" className="login-eye-btn" onClick={() => setShowPass(!showPass)}>
              {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          {errors.password && <p className="login-error-text">La contraseña es requerida</p>}
        </div>

        <button type="submit" className="login-button">Iniciar sesión</button>
      </form>

      <div className="login-footer-links">
        <p>
          ¿No tienes cuenta?{" "}
          <span onClick={onIrRegistro}>Crear cuenta</span>
        </p>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════
   FORMULARIO DE REGISTRO
   ════════════════════════════════════════════════ */
function FormularioRegistro({ onIrLogin }: { onIrLogin: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterViewFormData>();
  const { signup, errors: registerErrors } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [exito, setExito] = useState(false);

  const onSubmit = handleSubmit(async (values) => {
    if (values.password !== values.confirmPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }
    try {
      await signup({ ...values, role: "normal" });
      setExito(true);
      setTimeout(() => onIrLogin(), 3000);
    } catch (e) {
      console.error("Error al crear cuenta:", e);
    }
  });

  if (exito) {
    return (
      <div className="login-exito">
        <div className="login-exito-icon">✓</div>
        <h2>¡Cuenta creada!</h2>
        <p>Redirigiendo al inicio de sesión…</p>
      </div>
    );
  }

  return (
    <>
      <div className="login-registro-header justify-center items-center">
        <button type="button" className="login-back-btn" onClick={onIrLogin}>
          <FiArrowLeft size={18} />
        </button>
        <div>
          <h1 className="login-title" style={{ marginBottom: 2 }}>Crear cuenta</h1>
          <p className="login-subtitle" style={{ marginBottom: 0 }}>Únete a la Comunidad DDG</p>
        </div>
      </div>

      {registerErrors?.map((e: string, i: number) => (
        <div className="login-error" key={i}>{e}</div>
      ))}

      <form onSubmit={onSubmit} className="login-form">
        {/* Nombre y Usuario en fila */}
        <div className="login-row">
          <div className="login-input-group">
            <label className="login-label">Nombre completo</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="login-input"
              placeholder="Juan García"
            />
            {errors.name && <p className="login-error-text">Requerido</p>}
          </div>
          <div className="login-input-group">
            <label className="login-label">Usuario</label>
            <input
              type="text"
              {...register("username", { required: true })}
              className="login-input"
              placeholder="jgarcia"
            />
            {errors.username && <p className="login-error-text">Requerido</p>}
          </div>
        </div>

        {/* Email */}
        <div className="login-input-group">
          <label className="login-label">Correo electrónico</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="login-input"
            placeholder="correo@ejemplo.com"
          />
          {errors.email && <p className="login-error-text">El correo es requerido</p>}
        </div>

        {/* Teléfono y Edad en fila */}
        <div className="login-row">
          <div className="login-input-group">
            <label className="login-label">Teléfono</label>
            <input
              type="tel"
              {...register("telephone", { required: true })}
              className="login-input"
              placeholder="+502 0000-0000"
            />
            {errors.telephone && <p className="login-error-text">Requerido</p>}
          </div>
          <div className="login-input-group">
            <label className="login-label">Edad</label>
            <input
              type="number"
              {...register("age", { required: true, valueAsNumber: true })}
              className="login-input"
              placeholder="25"
              min="0"
              step="1"
            />
            {errors.age && <p className="login-error-text">Requerida</p>}
          </div>
        </div>

        {/* Contraseña */}
        <div className="login-row">
          <div className="login-input-group">
            <label className="login-label">Contraseña</label>
            <div className="login-input-wrapper">
              <input
                type={showPass ? "text" : "password"}
                {...register("password", { required: true })}
                className="login-input"
                placeholder="••••••••"
                style={{ paddingRight: "42px" }}
              />
              <button type="button" className="login-eye-btn" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.password && <p className="login-error-text">Requerida</p>}
          </div>
          <div className="login-input-group">
            <label className="login-label">Confirmar contraseña</label>
            <div className="login-input-wrapper">
              <input
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword", { required: true })}
                className="login-input"
                placeholder="••••••••"
                style={{ paddingRight: "42px" }}
              />
              <button type="button" className="login-eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="login-error-text">Requerida</p>}
          </div>
        </div>

        <button type="submit" className="login-button">Crear cuenta</button>
      </form>

      <div className="login-footer-links">
        <p>
          ¿Ya tienes cuenta?{" "}
          <span onClick={onIrLogin}>Iniciar sesión</span>
        </p>
      </div>
    </>
  );
}

/* ════════════════════════════════════════════════
   FORMULARIO DE RESTABLECER CONTRASEÑA
   ════════════════════════════════════════════════ */
function FormularioReset({ onIrLogin }: { onIrLogin: () => void }) {
  const { register, handleSubmit, formState: { errors } } = useForm<{ username: string; password: string }>();
  const { updatePasswordByPassword } = useAuth();
  const [showPass, setShowPass] = useState(false);
  const [exito, setExito] = useState(false);
  const [errorLocal, setErrorLocal] = useState("");

  const onSubmit = handleSubmit(async (values) => {
    try {
      setErrorLocal("");
      await updatePasswordByPassword(values);
      setExito(true);
      setTimeout(() => onIrLogin(), 3000);
    } catch (e: any) {
      console.error(e);
      setErrorLocal(e?.response?.data?.message || "No se pudo restablecer la contraseña. Verifica el usuario.");
    }
  });

  if (exito) {
    return (
      <div className="login-exito">
        <div className="login-exito-icon">✓</div>
        <h2>¡Contraseña actualizada!</h2>
        <p>Redirigiendo al inicio de sesión…</p>
      </div>
    );
  }

  return (
    <>
      <div className="login-registro-header justify-center items-center">
        <button type="button" className="login-back-btn" onClick={onIrLogin}>
          <FiArrowLeft size={18} />
        </button>
        <div>
          <h1 className="login-title" style={{ marginBottom: 2 }}>Recuperar acceso</h1>
          <p className="login-subtitle" style={{ marginBottom: 0 }}>Restablece tu contraseña</p>
        </div>
      </div>

      {errorLocal && <div className="login-error">{errorLocal}</div>}

      <form onSubmit={onSubmit} className="login-form">
        <div className="login-input-group">
          <label className="login-label">Usuario</label>
          <input
            type="text"
            {...register("username", { required: true })}
            className="login-input"
            placeholder="tu_usuario"
          />
          {errors.username && <p className="login-error-text">El usuario es requerido</p>}
        </div>

        <div className="login-input-group">
          <label className="login-label">Nueva contraseña</label>
          <div className="login-input-wrapper">
            <input
              type={showPass ? "text" : "password"}
              {...register("password", { required: true })}
              className="login-input"
              placeholder="••••••••"
              style={{ paddingRight: "42px" }}
            />
            <button type="button" className="login-eye-btn" onClick={() => setShowPass(!showPass)}>
              {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          {errors.password && <p className="login-error-text">La nueva contraseña es requerida</p>}
        </div>

        <button type="submit" className="login-button">Restablecer contraseña</button>
      </form>
    </>
  );
}