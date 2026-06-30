import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";

interface ResetPasswordProps {
  onClose: () => void;
}

interface ResetPasswordFormData {
  username: string;
  password: string;
}

export default function ResetPassword({ onClose }: ResetPasswordProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>();

  const { updatePasswordByPassword, errors: updateErrors } = useAuth();

  const onSubmit = handleSubmit(async (data: ResetPasswordFormData) => {
    try {
      await updatePasswordByPassword(data);
      onClose();
    } catch (err: unknown) {
      console.error("Error al actualizar la contraseña:", err);
    }
  });

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/75 p-6">
      <div className="w-full max-w-md rounded-[32px] bg-[#111827] p-8 shadow-[0_24px_80px_rgba(0,0,0,0.75)]">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Restablecer contraseña</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm text-[#9ca3af] transition hover:text-white"
          >
            Cerrar
          </button>
        </div>

        {updateErrors.map((error, i) => (
          <div key={i} className="rounded-3xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        ))}

        <form onSubmit={onSubmit} className="mt-6 space-y-5">
          <label className="block text-sm text-[#cbd5e1]">
            <span className="mb-2 block">Usuario</span>
            <input
              type="text"
              {...register("username", { required: true })}
              placeholder="Usuario"
              className="w-full rounded-3xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#3ecf8e] focus:ring-2 focus:ring-[#3ecf8e]/20"
            />
          </label>
          {errors.username && (
            <p className="text-sm text-red-400">El usuario es requerido</p>
          )}

          <label className="block text-sm text-[#cbd5e1]">
            <span className="mb-2 block">Contraseña nueva</span>
            <input
              type="password"
              {...register("password", { required: true })}
              placeholder="Contraseña nueva"
              className="w-full rounded-3xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#3ecf8e] focus:ring-2 focus:ring-[#3ecf8e]/20"
            />
          </label>
          {errors.password && (
            <p className="text-sm text-red-400">La contraseña nueva es requerida</p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-white/10 bg-transparent px-5 py-3 text-sm text-[#cbd5e1] transition hover:border-[#3ecf8e] hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-full bg-[#3ecf8e] px-5 py-3 text-sm font-semibold text-[#050505] transition hover:bg-[#5fd9a6]"
            >
              Aceptar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
