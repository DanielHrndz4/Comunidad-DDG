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

export default function UpdateAdminForm({
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
    const payload: Partial<IUser> = { ...data };

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
          text: "Datos actualizados correctamente.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });

        close();

        navigate("/admin");

      } catch {
        Swal.fire({
          title: "Error",
          text: "Ocurrió un error al actualizar.",
          icon: "error",
        });
      }
    }
  };

  return (
    <div className="flex flex-col bg-white p-8 rounded-2xl w-full max-w-lg border border-[#E5E5E7]">

      <h2 className="text-xl font-semibold mb-6">
        Actualizar Usuario
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >

        <div>
          <label>Nombre</label>

          <input
            type="text"
            {...register("name", {
              required: true,
            })}
            className="w-full border border-[#E5E5E7] rounded-xl p-3"
          />

          {errors.name && (
            <p className="text-red-500 text-sm">
              El nombre es requerido
            </p>
          )}
        </div>

        <div>
          <label>Username</label>

          <input
            type="text"
            {...register("username", {
              required: true,
            })}
            className="w-full border border-[#E5E5E7] rounded-xl p-3"
          />

          {errors.username && (
            <p className="text-red-500 text-sm">
              El usuario es requerido
            </p>
          )}
        </div>

        <div>
          <label>Email</label>

          <input
            type="email"
            {...register("email", {
              required: true,
            })}
            className="w-full border border-[#E5E5E7] rounded-xl p-3"
          />

          {errors.email && (
            <p className="text-red-500 text-sm">
              El email es requerido
            </p>
          )}
        </div>

        <div>
          <label>Contraseña</label>

          <input
            type="password"
            {...register("password")}
            className="w-full border border-[#E5E5E7] rounded-xl p-3"
            placeholder="Opcional"
          />
        </div>

        <div>
          <label>Teléfono</label>

          <input
            type="text"
            {...register("telephone", {
              required: true,
            })}
            className="w-full border border-[#E5E5E7] rounded-xl p-3"
          />

          {errors.telephone && (
            <p className="text-red-500 text-sm">
              El teléfono es requerido
            </p>
          )}
        </div>

        <div>
          <label>Edad</label>

          <input
            type="number"
            min={0}
            {...register("age", {
              required: true,
              valueAsNumber: true,
              min: 0,
            })}
            className="w-full border border-[#E5E5E7] rounded-xl p-3"
          />

          {errors.age && (
            <p className="text-red-500 text-sm">
              Edad inválida
            </p>
          )}
        </div>

        <div className="flex justify-between mt-4">

          <button
            type="button"
            onClick={close}
          >
            Cancelar
          </button>

          <button type="submit">
            Actualizar
          </button>

        </div>
      </form>
    </div>
  );
}