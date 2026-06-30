import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";

import appSwal from "../../utils/swal";

import { useAuth } from "../../context/AuthContext";
import type { RegisterFormData } from "../../interfaces/IAuthForms";

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
    <div className="fixed inset-0 z-[1000] flex bg-[#1c1c1c]
      bg-[radial-gradient(ellipse_at_80%_10%,rgba(139,92,246,0.07)_0%,transparent_55%),radial-gradient(ellipse_at_95%_90%,rgba(99,102,241,0.05)_0%,transparent_40%)]">

      {/* ── PANEL IZQUIERDO ── */}
      <div className="w-2/5 min-w-[380px] h-screen flex flex-col justify-between px-48 py-32 box-border bg-[#1c1c1c] border-r border-white/[0.07] overflow-y-auto
        max-md:w-full max-md:min-w-0 max-md:h-auto max-md:min-h-screen">

        {/* Marca */}
        <div className="flex items-center gap-10 mb-0">
          <div className="w-32 h-32 bg-gradient-to-br from-[#3ecf8e] to-[#1a9e6e] rounded-lg flex items-center justify-center">
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
          <span className="text-[15px] font-semibold text-[#e2e8f0] tracking-tight">Comunidad DDG</span>
        </div>

        {/* Contenido principal */}
        <div className="flex-1 flex flex-col justify-center w-full py-32">
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
        <p className="text-[11px] text-[#4a5568] text-center leading-relaxed [&_a]:text-[#6b7280] [&_a]:underline">
          Al continuar aceptas los{" "}
          <Link to="/">Términos de Servicio</Link> y la{" "}
          <Link to="/">Política de Privacidad</Link> de Comunidad DDG.
        </p>
      </div>

      {/* ── PANEL DERECHO: QUOTE ── */}
      <div className="flex-1 flex-col justify-center items-start px-80 py-80 bg-[#141414] relative overflow-hidden hidden md:flex
        bg-[radial-gradient(ellipse_at_85%_15%,rgba(139,92,246,0.10)_0%,transparent_50%),radial-gradient(ellipse_at_15%_85%,rgba(99,102,241,0.07)_0%,transparent_45%)]
        before:content-[''] before:absolute before:-top-[120px] before:-right-[120px] before:w-[600px] before:h-[600px] before:bg-[radial-gradient(circle,rgba(139,92,246,0.08)_0%,rgba(62,207,142,0.04)_40%,transparent_70%)] before:pointer-events-none
        after:content-[''] after:absolute after:-bottom-[80px] after:-left-[80px] after:w-[400px] after:h-[400px] after:bg-[radial-gradient(circle,rgba(99,102,241,0.06)_0%,transparent_65%)] after:pointer-events-none">

        <div className="text-[80px] leading-[0.7] text-white/[0.12] font-serif mb-32">"</div>
        <p className="text-[26px] font-light text-[#e2e8f0] leading-relaxed max-w-[520px] m-0 mb-40 tracking-tight">
          Gestiona tu comunidad de forma fácil, segura y en tiempo real.
          Todo lo que necesitas en un solo lugar.
        </p>
        <div className="flex items-center gap-14">
          <div className="w-40 h-40 rounded-full bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] flex items-center justify-center font-bold text-white text-[16px] border-2 border-white/10 overflow-hidden shrink-0">
            <span>D</span>
          </div>
          <span className="text-[14px] text-[#9ca3af] font-medium">@comunidad_ddg</span>
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
      <h1 className="text-[28px] font-bold text-white m-0 mb-6 tracking-tight leading-tight text-center">Bienvenido de nuevo</h1>
      <p className="text-[14px] text-[#3ecf8e] m-0 mb-28 font-medium text-center">Inicia sesión en tu cuenta</p>

      {signinErrors.map((e, i) => (
        <div className="bg-red-500/10 border border-red-500/30 text-[#fca5a5] px-14 py-10 rounded-md text-[13px] w-full box-border mb-12" key={i}>{e}</div>
      ))}

      <form onSubmit={onSubmit} className="w-full flex flex-col gap-18 bg-transparent">
        {/* Usuario */}
        <div className="flex flex-col gap-6 w-full">
          <label className="text-[#e2e8f0] text-[13px] font-medium">Usuario</label>
          <input
            type="text"
            {...register("username", { required: true })}
            className="w-full box-border bg-[#141414] text-[#e2e8f0] border border-white/[0.12] rounded-md px-14 py-11 text-[14px] outline-none transition-all duration-200 font-[inherit] placeholder:text-[#4a5568] focus:border-[#3ecf8e] focus:shadow-[0_0_0_3px_rgba(62,207,142,0.15)]"
            placeholder="tu_usuario"
          />
          {errors.username && <p className="text-[#f87171] text-[12px] mt-4">El usuario es requerido</p>}
        </div>

        {/* Contraseña */}
        <div className="flex flex-col gap-6 w-full">
          <div className="flex justify-between items-center">
            <label className="text-[#e2e8f0] text-[13px] font-medium">Contraseña</label>
            <button type="button" className="text-[13px] text-[#3ecf8e] bg-none border-none p-0 cursor-pointer font-[inherit] transition-colors duration-200 hover:text-[#5fd9a6] hover:underline" onClick={onIrReset}>
              ¿Olvidaste tu contraseña?
            </button>
          </div>
          <div className="relative w-full">
            <input
              type={showPass ? "text" : "password"}
              {...register("password", { required: true })}
              className="w-full box-border bg-[#141414] text-[#e2e8f0] border border-white/[0.12] rounded-md px-14 py-11 pr-42 text-[14px] outline-none transition-all duration-200 font-[inherit] placeholder:text-[#4a5568] focus:border-[#3ecf8e] focus:shadow-[0_0_0_3px_rgba(62,207,142,0.15)]"
              placeholder="••••••••"
            />
            <button type="button" className="absolute right-12 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[#6b7280] flex items-center p-0 transition-colors duration-200 hover:text-[#9ca3af]" onClick={() => setShowPass(!showPass)}>
              {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-[#f87171] text-[12px] mt-4">La contraseña es requerida</p>}
        </div>

        <button type="submit" className="w-full py-10 px-16 bg-[#3ecf8e] text-[#1a1a1a] border-none rounded-md text-[14px] font-bold cursor-pointer transition-all duration-200 font-[inherit] mt-4 hover:bg-[#5fd9a6] active:scale-[0.99]">Iniciar sesión</button>
      </form>

      <div className="text-center mt-20">
        <p className="text-[13px] text-[#6b7280] m-0">
          ¿No tienes cuenta?{" "}
          <span className="text-[#3ecf8e] cursor-pointer font-medium transition-colors duration-200 hover:text-[#5fd9a6] hover:underline" onClick={onIrRegistro}>Crear cuenta</span>
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
      await appSwal.fire({
        title: "Verifica la contraseña",
        text: "Las contraseñas no coinciden.",
        icon: "warning",
      });
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
      <div className="flex flex-col items-center justify-center text-center py-40 gap-12">
        <div className="w-56 h-56 rounded-full bg-gradient-to-br from-[#3ecf8e] to-[#1a9e6e] flex items-center justify-center text-[24px] text-white font-bold">✓</div>
        <h2 className="text-white text-[22px] font-bold m-0">¡Cuenta creada!</h2>
        <p className="text-[#9ca3af] text-[14px] m-0">Redirigiendo al inicio de sesión…</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-16 mb-24 w-full justify-center">
        <button type="button" className="bg-white/[0.06] border border-white/10 text-[#e2e8f0] rounded-lg w-38 h-38 cursor-pointer flex items-center justify-center shrink-0 transition-colors duration-200 hover:bg-white/[0.12]" onClick={onIrLogin}>
          <FiArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-[28px] font-bold text-white m-0 mb-2 tracking-tight leading-tight">Crear cuenta</h1>
          <p className="text-[14px] text-[#3ecf8e] m-0 font-medium">Únete a la Comunidad DDG</p>
        </div>
      </div>

      {registerErrors?.map((e: string, i: number) => (
        <div className="bg-red-500/10 border border-red-500/30 text-[#fca5a5] px-14 py-10 rounded-md text-[13px] w-full box-border mb-12" key={i}>{e}</div>
      ))}

      <form onSubmit={onSubmit} className="w-full flex flex-col gap-18 bg-transparent">
        {/* Nombre y Usuario en fila */}
        <div className="grid grid-cols-2 gap-14 w-full">
          <div className="flex flex-col gap-6 w-full">
            <label className="text-[#e2e8f0] text-[13px] font-medium">Nombre completo</label>
            <input
              type="text"
              {...register("name", { required: true })}
              className="w-full box-border bg-[#141414] text-[#e2e8f0] border border-white/[0.12] rounded-md px-14 py-11 text-[14px] outline-none transition-all duration-200 font-[inherit] placeholder:text-[#4a5568] focus:border-[#3ecf8e] focus:shadow-[0_0_0_3px_rgba(62,207,142,0.15)]"
              placeholder="Juan García"
            />
            {errors.name && <p className="text-[#f87171] text-[12px] mt-4">Requerido</p>}
          </div>
          <div className="flex flex-col gap-6 w-full">
            <label className="text-[#e2e8f0] text-[13px] font-medium">Usuario</label>
            <input
              type="text"
              {...register("username", { required: true })}
              className="w-full box-border bg-[#141414] text-[#e2e8f0] border border-white/[0.12] rounded-md px-14 py-11 text-[14px] outline-none transition-all duration-200 font-[inherit] placeholder:text-[#4a5568] focus:border-[#3ecf8e] focus:shadow-[0_0_0_3px_rgba(62,207,142,0.15)]"
              placeholder="jgarcia"
            />
            {errors.username && <p className="text-[#f87171] text-[12px] mt-4">Requerido</p>}
          </div>
        </div>

        {/* Email */}
        <div className="flex flex-col gap-6 w-full">
          <label className="text-[#e2e8f0] text-[13px] font-medium">Correo electrónico</label>
          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full box-border bg-[#141414] text-[#e2e8f0] border border-white/[0.12] rounded-md px-14 py-11 text-[14px] outline-none transition-all duration-200 font-[inherit] placeholder:text-[#4a5568] focus:border-[#3ecf8e] focus:shadow-[0_0_0_3px_rgba(62,207,142,0.15)]"
            placeholder="correo@ejemplo.com"
          />
          {errors.email && <p className="text-[#f87171] text-[12px] mt-4">El correo es requerido</p>}
        </div>

        {/* Teléfono y Edad en fila */}
        <div className="grid grid-cols-2 gap-14 w-full">
          <div className="flex flex-col gap-6 w-full">
            <label className="text-[#e2e8f0] text-[13px] font-medium">Teléfono</label>
            <input
              type="tel"
              {...register("telephone", { required: true })}
              className="w-full box-border bg-[#141414] text-[#e2e8f0] border border-white/[0.12] rounded-md px-14 py-11 text-[14px] outline-none transition-all duration-200 font-[inherit] placeholder:text-[#4a5568] focus:border-[#3ecf8e] focus:shadow-[0_0_0_3px_rgba(62,207,142,0.15)]"
              placeholder="+502 0000-0000"
            />
            {errors.telephone && <p className="text-[#f87171] text-[12px] mt-4">Requerido</p>}
          </div>
          <div className="flex flex-col gap-6 w-full">
            <label className="text-[#e2e8f0] text-[13px] font-medium">Edad</label>
            <input
              type="number"
              {...register("age", { required: true, valueAsNumber: true })}
              className="w-full box-border bg-[#141414] text-[#e2e8f0] border border-white/[0.12] rounded-md px-14 py-11 text-[14px] outline-none transition-all duration-200 font-[inherit] placeholder:text-[#4a5568] focus:border-[#3ecf8e] focus:shadow-[0_0_0_3px_rgba(62,207,142,0.15)]"
              placeholder="25"
              min="0"
              step="1"
            />
            {errors.age && <p className="text-[#f87171] text-[12px] mt-4">Requerida</p>}
          </div>
        </div>

        {/* Contraseña */}
        <div className="grid grid-cols-2 gap-14 w-full">
          <div className="flex flex-col gap-6 w-full">
            <label className="text-[#e2e8f0] text-[13px] font-medium">Contraseña</label>
            <div className="relative w-full">
              <input
                type={showPass ? "text" : "password"}
                {...register("password", { required: true })}
                className="w-full box-border bg-[#141414] text-[#e2e8f0] border border-white/[0.12] rounded-md px-14 py-11 pr-42 text-[14px] outline-none transition-all duration-200 font-[inherit] placeholder:text-[#4a5568] focus:border-[#3ecf8e] focus:shadow-[0_0_0_3px_rgba(62,207,142,0.15)]"
                placeholder="••••••••"
              />
              <button type="button" className="absolute right-12 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[#6b7280] flex items-center p-0 transition-colors duration-200 hover:text-[#9ca3af]" onClick={() => setShowPass(!showPass)}>
                {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-[#f87171] text-[12px] mt-4">Requerida</p>}
          </div>
          <div className="flex flex-col gap-6 w-full">
            <label className="text-[#e2e8f0] text-[13px] font-medium">Confirmar contraseña</label>
            <div className="relative w-full">
              <input
                type={showConfirm ? "text" : "password"}
                {...register("confirmPassword", { required: true })}
                className="w-full box-border bg-[#141414] text-[#e2e8f0] border border-white/[0.12] rounded-md px-14 py-11 pr-42 text-[14px] outline-none transition-all duration-200 font-[inherit] placeholder:text-[#4a5568] focus:border-[#3ecf8e] focus:shadow-[0_0_0_3px_rgba(62,207,142,0.15)]"
                placeholder="••••••••"
              />
              <button type="button" className="absolute right-12 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[#6b7280] flex items-center p-0 transition-colors duration-200 hover:text-[#9ca3af]" onClick={() => setShowConfirm(!showConfirm)}>
                {showConfirm ? <FiEyeOff size={16} /> : <FiEye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-[#f87171] text-[12px] mt-4">Requerida</p>}
          </div>
        </div>

        <button type="submit" className="w-full py-10 px-16 bg-[#3ecf8e] text-[#1a1a1a] border-none rounded-md text-[14px] font-bold cursor-pointer transition-all duration-200 font-[inherit] mt-4 hover:bg-[#5fd9a6] active:scale-[0.99]">Crear cuenta</button>
      </form>

      <div className="text-center mt-20">
        <p className="text-[13px] text-[#6b7280] m-0">
          ¿Ya tienes cuenta?{" "}
          <span className="text-[#3ecf8e] cursor-pointer font-medium transition-colors duration-200 hover:text-[#5fd9a6] hover:underline" onClick={onIrLogin}>Iniciar sesión</span>
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
      <div className="flex flex-col items-center justify-center text-center py-40 gap-12">
        <div className="w-56 h-56 rounded-full bg-gradient-to-br from-[#3ecf8e] to-[#1a9e6e] flex items-center justify-center text-[24px] text-white font-bold">✓</div>
        <h2 className="text-white text-[22px] font-bold m-0">¡Contraseña actualizada!</h2>
        <p className="text-[#9ca3af] text-[14px] m-0">Redirigiendo al inicio de sesión…</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex items-center gap-16 mb-24 w-full justify-center">
        <button type="button" className="bg-white/[0.06] border border-white/10 text-[#e2e8f0] rounded-lg w-38 h-38 cursor-pointer flex items-center justify-center shrink-0 transition-colors duration-200 hover:bg-white/[0.12]" onClick={onIrLogin}>
          <FiArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-[28px] font-bold text-white m-0 mb-2 tracking-tight leading-tight">Recuperar acceso</h1>
          <p className="text-[14px] text-[#3ecf8e] m-0 font-medium">Restablece tu contraseña</p>
        </div>
      </div>

      {errorLocal && <div className="bg-red-500/10 border border-red-500/30 text-[#fca5a5] px-14 py-10 rounded-md text-[13px] w-full box-border mb-12">{errorLocal}</div>}

      <form onSubmit={onSubmit} className="w-full flex flex-col gap-18 bg-transparent">
        <div className="flex flex-col gap-6 w-full">
          <label className="text-[#e2e8f0] text-[13px] font-medium">Usuario</label>
          <input
            type="text"
            {...register("username", { required: true })}
            className="w-full box-border bg-[#141414] text-[#e2e8f0] border border-white/[0.12] rounded-md px-14 py-11 text-[14px] outline-none transition-all duration-200 font-[inherit] placeholder:text-[#4a5568] focus:border-[#3ecf8e] focus:shadow-[0_0_0_3px_rgba(62,207,142,0.15)]"
            placeholder="tu_usuario"
          />
          {errors.username && <p className="text-[#f87171] text-[12px] mt-4">El usuario es requerido</p>}
        </div>

        <div className="flex flex-col gap-6 w-full">
          <label className="text-[#e2e8f0] text-[13px] font-medium">Nueva contraseña</label>
          <div className="relative w-full">
            <input
              type={showPass ? "text" : "password"}
              {...register("password", { required: true })}
              className="w-full box-border bg-[#141414] text-[#e2e8f0] border border-white/[0.12] rounded-md px-14 py-11 pr-42 text-[14px] outline-none transition-all duration-200 font-[inherit] placeholder:text-[#4a5568] focus:border-[#3ecf8e] focus:shadow-[0_0_0_3px_rgba(62,207,142,0.15)]"
              placeholder="••••••••"
            />
            <button type="button" className="absolute right-12 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[#6b7280] flex items-center p-0 transition-colors duration-200 hover:text-[#9ca3af]" onClick={() => setShowPass(!showPass)}>
              {showPass ? <FiEyeOff size={16} /> : <FiEye size={16} />}
            </button>
          </div>
          {errors.password && <p className="text-[#f87171] text-[12px] mt-4">La nueva contraseña es requerida</p>}
        </div>

        <button type="submit" className="w-full py-10 px-16 bg-[#3ecf8e] text-[#1a1a1a] border-none rounded-md text-[14px] font-bold cursor-pointer transition-all duration-200 font-[inherit] mt-4 hover:bg-[#5fd9a6] active:scale-[0.99]">Restablecer contraseña</button>
      </form>
    </>
  );
}