import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import Swal from "sweetalert2";

import { IUser } from "../../interfaces/IUser";
import { updateUser } from "../../services/auth.service";

interface Props {
  user: IUser & { id?: string };
  close: () => void;
}

export default function UpdateVigilantForm({
  user,
  close,
}: Props) {

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IUser>({
    defaultValues: {
      ...(user ?? {}),
      password: "",
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      reset({
        ...user,
        password: "",
      });
    }
  }, [user, reset]);

  const onSubmit = async (data: IUser) => {

    const payload: Partial<IUser> = {
      ...data,
    };

    if (
      !payload.password ||
      payload.password.trim() === ""
    ) {
      delete payload.password;
    }

    if (user?.id) {

      try {

        await updateUser(user.id, payload);

        await Swal.fire({
          title: "Actualizado",
          text: "Datos del usuario actualizados correctamente.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        close();

        await new Promise((resolve) =>
          setTimeout(resolve, 600)
        );

        navigate("/vigilant");

      } catch (error) {

        console.error(error);

        Swal.fire({
          title: "Error",
          text: "Ocurrió un error al actualizar al usuario.",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    }
  };

  return (
    <div className="flex flex-col bg-white p-8 rounded-2xl w-full max-w-2xl border border-[#E5E5E7]">

      <header className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">
          Actualizar Usuario
        </h2>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >

        <div className="flex flex-col gap-2">

          <label
            htmlFor="name"
            className="text-sm font-medium text-slate-700"
          >
            Nombre
          </label>

          <input
            type="text"
            {...register("name", {
              required: true,
            })}
            className="p-3 border border-[#E5E5E7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
            placeholder="Ingrese el nombre del usuario"
          />

          {errors.name && (
            <p className="text-red-500 text-sm">
              El nombre es requerido
            </p>
          )}

        </div>

        <div className="flex flex-col gap-2">

          <label
            htmlFor="username"
            className="text-sm font-medium text-slate-700"
          >
            Username
          </label>

          <input
            type="text"
            {...register("username", {
              required: true,
            })}
            className="p-3 border border-[#E5E5E7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
            placeholder="Ingrese el usuario nuevo"
          />

          {errors.username && (
            <p className="text-red-500 text-sm">
              El usuario es requerido
            </p>
          )}

        </div>

        <div className="flex flex-col gap-2">

          <label
            htmlFor="email"
            className="text-sm font-medium text-slate-700"
          >
            Email
          </label>

          <input
            type="email"
            {...register("email", {
              required: true,
            })}
            className="p-3 border border-[#E5E5E7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
            placeholder="Ingrese su email"
          />

          {errors.email && (
            <p className="text-red-500 text-sm">
              El email es requerido
            </p>
          )}

        </div>

        <div className="flex flex-col gap-2">

          <label
            htmlFor="password"
            className="text-sm font-medium text-slate-700"
          >
            Contraseña
          </label>

          <input
            type="password"
            {...register("password")}
            className="p-3 border border-[#E5E5E7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
            placeholder="Ingrese una nueva contraseña"
          />

        </div>

        <div className="flex flex-col gap-2">

          <label
            htmlFor="telephone"
            className="text-sm font-medium text-slate-700"
          >
            Teléfono
          </label>

          <input
            type="text"
            {...register("telephone", {
              required: true,
            })}
            className="p-3 border border-[#E5E5E7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
            placeholder="Ingrese el número de teléfono"
          />

          {errors.telephone && (
            <p className="text-red-500 text-sm">
              El teléfono es requerido
            </p>
          )}

        </div>

        <div className="flex flex-col gap-2">

          <label
            htmlFor="age"
            className="text-sm font-medium text-slate-700"
          >
            Edad
          </label>

          <input
            type="number"
            min={0}
            {...register("age", {
              required: true,
              valueAsNumber: true,
              min: 0,
            })}
            className="p-3 border border-[#E5E5E7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
            placeholder="Ingrese la edad"
          />

          {errors.age && (
            <p className="text-red-500 text-sm">
              La edad es requerida
            </p>
          )}

        </div>

        <div className="flex justify-between gap-4 mt-4">

          <button
            type="button"
            onClick={close}
            className="px-5 py-3 rounded-2xl border border-[#E5E5E7] hover:bg-gray-100 transition-all"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-5 py-3 rounded-2xl bg-slate-800 text-white hover:opacity-90 transition-all"
          >
            Actualizar
          </button>

        </div>
      </form>
    </div>
  );
}