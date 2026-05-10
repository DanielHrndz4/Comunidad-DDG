import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

import { IUser } from "../../interfaces/IUser";
import { createUser } from "../../services/auth.service";

interface Props {
  close: () => void;
}

export default function CreateUserForm({ close }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IUser>();

  const navigate = useNavigate();

  const onSubmit = async (data: IUser) => {
    try {
      await createUser(data);

      Swal.fire({
        title: "Usuario creado!",
        text: "El usuario se ha creado correctamente.",
        icon: "success",
        confirmButtonColor: "#2563eb",
        timer: 2000,
      }).then(() => navigate("/admin"));

    } catch {
      Swal.fire({
        title: "Error",
        text: "No se pudo crear al usuario.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <div className="flex flex-col bg-white p-8 rounded-2xl w-full max-w-lg border border-[#E5E5E7]">
      <h2 className="text-xl font-semibold mb-6">
        Creación de Usuario
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div>
          <label>Nombre</label>

          <input
            {...register("name", { required: true })}
            className="w-full border border-[#E5E5E7] rounded-xl p-3 focus:ring-2 focus:ring-gray-300"
            placeholder="Ingrese el nombre del usuario"
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
            {...register("username", { required: true })}
            className="w-full border border-[#E5E5E7] rounded-xl p-3 focus:ring-2 focus:ring-gray-300"
            placeholder="Ingrese un username"
          />

          {errors.username && (
            <p className="text-red-500 text-sm">
              El username es requerido
            </p>
          )}
        </div>

        <div>
          <label>Email</label>

          <input
            type="email"
            {...register("email", { required: true })}
            className="w-full border border-[#E5E5E7] rounded-xl p-3 focus:ring-2 focus:ring-gray-300"
            placeholder="example@gmail.com"
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
            {...register("password", { required: true })}
            className="w-full border border-[#E5E5E7] rounded-xl p-3 focus:ring-2 focus:ring-gray-300"
            placeholder="Mínimo 12 caracteres"
          />

          {errors.password && (
            <p className="text-red-500 text-sm">
              La contraseña es requerida
            </p>
          )}
        </div>

        <div>
          <label>Teléfono</label>

          <input
            {...register("telephone", { required: true })}
            className="w-full border border-[#E5E5E7] rounded-xl p-3 focus:ring-2 focus:ring-gray-300"
            placeholder="Ingrese el teléfono"
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
            className="w-full border border-[#E5E5E7] rounded-xl p-3 focus:ring-2 focus:ring-gray-300"
          />

          {errors.age && (
            <p className="text-red-500 text-sm">
              Edad inválida
            </p>
          )}
        </div>

        <div>
          <label>Rol</label>

          <select
            {...register("role", { required: true })}
            defaultValue="normal"
            className="w-full border border-[#E5E5E7] rounded-xl p-3"
          >
            <option value="normal">Normal</option>
            <option value="vigilant">Vigilant</option>
          </select>

          {errors.role && (
            <p className="text-red-500 text-sm">
              El rol es requerido
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
            Crear cuenta
          </button>
        </div>
      </form>
    </div>
  );
}