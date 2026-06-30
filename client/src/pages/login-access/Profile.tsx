import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import { useAuth } from "../../context/AuthContext";
import type { IUser } from "../../interfaces/IUser";

interface ProfileUpdateFormData {
  name: string;
  username: string;
  email: string;
  password?: string;
  telephone: string;
  age: number;
}

export default function Profile() {
  const { user, updateProfile, updatePasswordByPassword } = useAuth();
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { register, handleSubmit, reset } = useForm<ProfileUpdateFormData>();

  useEffect(() => {
    if (!user) return;

    reset({
      name: user.name,
      username: user.username,
      email: user.email,
      password: "",
      telephone: user.telephone,
      age: user.age,
    });
  }, [user, reset]);

  if (!user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#030712] px-6 py-10">
        <p className="text-sm text-[#9ca3af]">Cargando perfil...</p>
      </main>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((word) => word[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
    : "U";

  const onSubmit = async (data: ProfileUpdateFormData) => {
    const payload: Partial<IUser> = {
      name: data.name,
      username: data.username,
      email: data.email,
      telephone: data.telephone,
      age: data.age,
    };

    const newPassword = data.password?.trim();

    setIsSaving(true);

    try {
      if (newPassword) {
        await updatePasswordByPassword({
          username: data.username,
          password: newPassword,
        });
      }

      const userId = user.id ?? user._id;
      if (!userId) throw new Error("ID de usuario no encontrado");

      await updateProfile(userId, payload);

      await Swal.fire({
        title: "¡Actualizado!",
        text: "Datos guardados correctamente.",
        icon: "success",
        background: "#111827",
        color: "#f8fafc",
        confirmButtonColor: "#3ecf8e",
        showConfirmButton: false,
        timer: 2000,
      });

      setEditing(false);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar la información.",
        icon: "error",
        background: "#111827",
        color: "#f8fafc",
        confirmButtonColor: "#ef4444",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const viewFields = [
    { label: "Nombre completo", value: user.name, icon: "👤" },
    { label: "Usuario", value: user.username, icon: "🔑" },
    { label: "Email", value: user.email, icon: "✉️" },
    { label: "Teléfono", value: user.telephone || "-", icon: "📱" },
    { label: "Edad", value: user.age ? `${user.age} años` : "-", icon: "🎂" },
  ];

  return (
    <main className="min-h-screen bg-[#030712] px-4 py-6 text-white sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      <div className="mx-auto max-w-[1120px] space-y-10">
        <div className="flex flex-col gap-6 rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.4)] sm:p-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Mi Perfil</h1>
            <p className="mt-3 text-sm text-[#9ca3af]">Gestiona tu información personal.</p>
          </div>

          {!editing && (
            <button
              type="button"
              className="inline-flex items-center justify-center gap-3 rounded-full bg-[#3ecf8e] px-5 py-3 text-sm font-semibold text-[#050505] transition hover:bg-[#5fd9a6]"
              onClick={() => setEditing(true)}
            >
              Editar perfil
            </button>
          )}
        </div>

        <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
          <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.4)]">
            <div className="mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-[#3ecf8e] to-[#1a9e6e] text-4xl font-bold text-[#050505] shadow-[0_12px_30px_rgba(62,207,142,0.35)]">
              {initials}
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm uppercase tracking-[0.24em] text-[#9ca3af]">Rol</p>
                <p className="mt-2 text-lg font-semibold">{user.role}</p>
              </div>
              <div className="rounded-3xl border border-white/10 bg-[#0f172a] p-4">
                <p className="text-sm uppercase tracking-[0.24em] text-[#9ca3af]">Email</p>
                <p className="mt-2 text-base text-[#d1d5db] break-words">{user.email}</p>
              </div>
            </div>
          </section>

          <section className="rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.4)]">
            {!editing ? (
              <div className="space-y-4">
                {viewFields.map((field) => (
                  <div key={field.label} className="flex flex-col gap-2 rounded-3xl border border-white/10 bg-[#111827] p-5">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{field.icon}</span>
                      <h2 className="text-sm font-semibold text-[#e5e7eb]">{field.label}</h2>
                    </div>
                    <p className="text-base text-[#cbd5e1]">{field.value}</p>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm text-[#cbd5e1]">
                    Nombre completo
                    <input
                      type="text"
                      {...register("name", { required: true })}
                      className="rounded-3xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#3ecf8e] focus:ring-2 focus:ring-[#3ecf8e]/20"
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm text-[#cbd5e1]">
                    Usuario
                    <input
                      type="text"
                      {...register("username", { required: true })}
                      className="rounded-3xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#3ecf8e] focus:ring-2 focus:ring-[#3ecf8e]/20"
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-2 text-sm text-[#cbd5e1]">
                  Email
                  <input
                    type="email"
                    {...register("email", { required: true })}
                    className="rounded-3xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#3ecf8e] focus:ring-2 focus:ring-[#3ecf8e]/20"
                  />
                </label>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="flex flex-col gap-2 text-sm text-[#cbd5e1]">
                    Teléfono
                    <input
                      type="text"
                      {...register("telephone", { required: true })}
                      className="rounded-3xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#3ecf8e] focus:ring-2 focus:ring-[#3ecf8e]/20"
                    />
                  </label>

                  <label className="flex flex-col gap-2 text-sm text-[#cbd5e1]">
                    Edad
                    <input
                      type="number"
                      {...register("age", { required: true, valueAsNumber: true })}
                      className="rounded-3xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#3ecf8e] focus:ring-2 focus:ring-[#3ecf8e]/20"
                    />
                  </label>
                </div>

                <label className="flex flex-col gap-2 text-sm text-[#cbd5e1]">
                  Nueva contraseña
                  <input
                    type="password"
                    {...register("password")}
                    placeholder="Dejar en blanco para no cambiar"
                    className="rounded-3xl border border-white/10 bg-[#0f172a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#3ecf8e] focus:ring-2 focus:ring-[#3ecf8e]/20"
                  />
                </label>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => setEditing(false)}
                    className="rounded-full border border-white/10 bg-transparent px-5 py-3 text-sm text-[#cbd5e1] transition hover:border-[#3ecf8e] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSaving}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#3ecf8e] px-6 py-3 text-sm font-semibold text-[#050505] transition hover:bg-[#5fd9a6] disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={isSaving}
                  >
                    {isSaving && <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#050505]/20 border-t-[#050505]" />}
                    {isSaving ? "Guardando..." : "Guardar cambios"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
