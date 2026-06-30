import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";

import appSwal from "../../utils/swal";

import { useAuth } from "../../context/AuthContext";
import type { RegisterFormData } from "../../interfaces/IAuthForms";

interface RegisterProps {
  onClose: () => void;
}

type RegisterViewFormData = Omit<RegisterFormData, "role">;

function Register({ onClose }: RegisterProps) {
  const [mostrarPassword, setMostrarPassword] = useState<boolean>(false);
  const [verPassword, setVerPassword] = useState<boolean>(false);
  const [verConfirmPassword, setVerConfirmPassword] = useState<boolean>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterViewFormData>();

  const { signup, errors: registerErrors } = useAuth();

  const [successMessage, setSuccessMessage] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (submitted) {
      if (registerErrors.length === 0) {
        setSuccessMessage("¡Cuenta creada con éxito!");
        const timer = setTimeout(() => {
          setSuccessMessage("");
          onClose();
        }, 5000);
        return () => clearTimeout(timer);
      }
      setSubmitted(false);
    }
  }, [registerErrors, submitted, onClose]);

  const onSubmit = handleSubmit(async (values: RegisterViewFormData) => {
    if (!mostrarPassword) {
      setMostrarPassword(true);
      return;
    }
    if (values.password !== values.confirmPassword) {
      await appSwal.fire({
        title: "Verifica la contraseña",
        text: "Las contraseñas no coinciden.",
        icon: "warning",
      });
      return;
    }
    try {
      const payload: RegisterFormData = { ...values, role: "normal" };
      await signup(payload);
      setSubmitted(true);
    } catch (error: unknown) {
      console.error("Error al crear cuenta:", error);
    }
  });

  const closeForm = (): void => { onClose(); };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-[1000] overflow-x-hidden">
      <div className="bg-[#141414] p-24 rounded-xl w-[400px] max-w-[90%] max-h-[90%] shadow-[0_4px_12px_rgba(0,0,0,0.4)] overflow-y-auto flex flex-col items-center relative box-border mx-auto border border-white/10">

        {/* Botón para regresar al paso anterior */}
        {mostrarPassword && (
          <button
            type="button"
            className="self-start bg-none border-none text-[1.25rem] text-[#e2e8f0] cursor-pointer mb-10"
            onClick={() => setMostrarPassword(false)}
          >
            ← Atrás
          </button>
        )}

        {/* Título del modal */}
        <h2 className="text-white text-[1.5rem] text-center mb-20 font-bold">
          Crea tu cuenta
        </h2>

        {/* Formulario de registro */}
        <form onSubmit={onSubmit} className="flex flex-col w-[85%] items-center justify-center bg-transparent gap-12">
          <input
            type="text"
            {...register("name", { required: true })}
            className="w-full box-border bg-[#1c1c1c] text-[#e2e8f0] border border-white/[0.12] rounded-full px-16 py-12 text-[1rem] outline-none transition-all duration-200 placeholder:text-[#4a5568] focus:border-[#3ecf8e] focus:shadow-[0_0_0_3px_rgba(62,207,142,0.15)]"
            placeholder="Ingrese su nombre"
          />
          {errors.name && <p className="text-[#fca5a5] text-[0.875rem] text-center">El nombre es requerido</p>}

          <input
            type="text"
            {...register("username", { required: true })}
            className="w-full box-border bg-[#1c1c1c] text-[#e2e8f0] border border-white/[0.12] rounded-full px-16 py-12 text-[1rem] outline-none transition-all duration-200 placeholder:text-[#4a5568] focus:border-[#3ecf8e] focus:shadow-[0_0_0_3px_rgba(62,207,142,0.15)]"
            placeholder="Ingrese un usuario"
          />
          {errors.username && <p className="text-[#fca5a5] text-[0.875rem] text-center">El usuario es requerido</p>}

          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full box-border bg-[#1c1c1c] text-[#e2e8f0] border border-white/[0.12] rounded-full px-16 py-12 text-[1rem] outline-none transition-all duration-200 placeholder:text-[#4a5568] focus:border-[#3ecf8e] focus:shadow-[0_0_0_3px_rgba(62,207,142,0.15)]"
            placeholder="Ingrese su correo"
          />
          {errors.email && <p className="text-[#fca5a5] text-[0.875rem] text-center">El email es requerido</p>}

          <input
            type="tel"
            {...register("telephone", { required: true })}
            className="w-full box-border bg-[#1c1c1c] text-[#e2e8f0] border border-white/[0.12] rounded-full px-16 py-12 text-[1rem] outline-none transition-all duration-200 placeholder:text-[#4a5568] focus:border-[#3ecf8e] focus:shadow-[0_0_0_3px_rgba(62,207,142,0.15)]"
            placeholder="Ingrese su teléfono"
          />
          {errors.telephone && <p className="text-[#fca5a5] text-[0.875rem] text-center">El teléfono es requerido</p>}

          <input
            type="number"
            {...register("age", { required: true, valueAsNumber: true })}
            className="w-full box-border bg-[#1c1c1c] text-[#e2e8f0] border border-white/[0.12] rounded-full px-16 py-12 text-[1rem] outline-none transition-all duration-200 placeholder:text-[#4a5568] focus:border-[#3ecf8e] focus:shadow-[0_0_0_3px_rgba(62,207,142,0.15)]"
            placeholder="Ingrese su edad"
            min="0"
            step="1"
          />
          {errors.age && <p className="text-[#fca5a5] text-[0.875rem] text-center">La edad es requerida</p>}

          {/* Campos de contraseña */}
          {mostrarPassword && (
            <div className="w-full flex flex-col gap-12">
              <div className="relative w-full">
                <input
                  type={verPassword ? "text" : "password"}
                  {...register("password", { required: true })}
                  placeholder="Clave"
                  className="w-full box-border bg-[#1c1c1c] text-[#e2e8f0] border border-white/[0.12] rounded-full px-16 py-12 pr-42 text-[1rem] outline-none transition-all duration-200 placeholder:text-[#4a5568] focus:border-[#3ecf8e] focus:shadow-[0_0_0_3px_rgba(62,207,142,0.15)]"
                />
                <button
                  type="button"
                  className="absolute right-16 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[#6b7280] flex items-center p-0 hover:text-[#9ca3af]"
                  onClick={() => setVerPassword(!verPassword)}
                >
                  {verPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
                {errors.password && <p className="text-[#fca5a5] text-[0.875rem] mt-4 text-center">La contraseña es requerida</p>}
              </div>

              <div className="relative w-full">
                <input
                  type={verConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword", { required: true })}
                  placeholder="Confirmar clave"
                  className="w-full box-border bg-[#1c1c1c] text-[#e2e8f0] border border-white/[0.12] rounded-full px-16 py-12 pr-42 text-[1rem] outline-none transition-all duration-200 placeholder:text-[#4a5568] focus:border-[#3ecf8e] focus:shadow-[0_0_0_3px_rgba(62,207,142,0.15)]"
                />
                <button
                  type="button"
                  className="absolute right-16 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-[#6b7280] flex items-center p-0 hover:text-[#9ca3af]"
                  onClick={() => setVerConfirmPassword(!verConfirmPassword)}
                >
                  {verConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                </button>
                {errors.confirmPassword && <p className="text-[#fca5a5] text-[0.875rem] mt-4 text-center">La confirmación es requerida</p>}
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-2/5 py-10 px-6 bg-[#3ecf8e] text-[#1a1a1a] border-none rounded-full cursor-pointer text-[1rem] font-bold mt-12 transition-all duration-200 hover:bg-[#5fd9a6] active:scale-[0.98]"
          >
            {mostrarPassword ? "Registrar" : "Siguiente"}
          </button>
        </form>

        {/* Opciones */}
        <button
          type="button"
          onClick={closeForm}
          className="text-[#3ecf8e] cursor-pointer bg-transparent border-none mt-20 text-[14px] font-medium hover:underline"
        >
          ¿Ya tienes cuenta? Regresa al inicio de sesión
        </button>

        <button
          type="button"
          className="py-8 cursor-pointer text-[#6b7280] bg-transparent border-none text-[14px] hover:text-[#9ca3af]"
          onClick={onClose}
        >
          Cancelar
        </button>

        {/* Mensajes de error y éxito */}
        {registerErrors.map((error, i) => (
          <div key={i} className="bg-red-500/10 border border-red-500/30 text-[#fca5a5] px-14 py-10 rounded-md text-[13px] w-full box-border mt-8">
            {error}
          </div>
        ))}

        {successMessage && (
          <div className="text-white text-[20px] font-bold text-center mt-12">
            {successMessage}
          </div>
        )}
      </div>
    </div>
  );
}

export default Register;