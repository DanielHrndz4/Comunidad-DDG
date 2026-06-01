import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import { useAuth } from "../../context/AuthContext";
import type { IUser } from "../../interfaces/IUser";

interface Props {
  user: IUser;
  close: () => void;
}

interface ProfileUpdateFormData {
  name: string;
  username: string;
  email: string;
  password?: string;
  telephone: string;
  age: number;
}

export default function UpdateUserNormalForm({
  user,
  close,
}: Props) {
  const { updateProfile } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
  } = useForm<ProfileUpdateFormData>({
    defaultValues: {
      name: user.name,
      username: user.username,
      email: user.email,
      password: "",
      telephone: user.telephone,
      age: user.age,
    },
  });

  useEffect(() => {
    reset({
      name: user.name,
      username: user.username,
      email: user.email,
      password: "",
      telephone: user.telephone,
      age: user.age,
    });
  }, [user, reset]);

  const onSubmit = async (
    data: ProfileUpdateFormData
  ): Promise<void> => {
    const payload: Partial<IUser> = {
      ...data,
    };

    if (!payload.password || payload.password.trim() === "") {
      delete payload.password;
    }

    const userId = user.id ?? user._id;

    if (!userId) {
      Swal.fire({
        title: "Error",
        text: "No se encontró el identificador del usuario.",
        icon: "error",
      });
      return;
    }

    try {
      await updateProfile(userId, payload);

      await Swal.fire({
        title: "Actualizado",
        text: "Datos del usuario actualizados correctamente.",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });

      close();
    } catch (error: unknown) {
      console.error(error);

      Swal.fire({
        title: "Error",
        text: "Ocurrió un error al actualizar al usuario.",
        icon: "error",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        type="text"
        {...register("name", { required: true })}
        placeholder="Nombre nuevo"
      />

      <input
        type="text"
        {...register("username", { required: true })}
        placeholder="Usuario nuevo"
      />

      <input
        type="email"
        {...register("email", { required: true })}
        placeholder="Correo nuevo"
      />

      <input
        type="password"
        {...register("password")}
        placeholder="Contraseña nueva"
      />

      <input
        type="text"
        {...register("telephone", { required: true })}
        placeholder="Teléfono actualizado"
      />

      <input
        type="number"
        {...register("age", {
          required: true,
          valueAsNumber: true,
        })}
        placeholder="Edad actualizada"
      />

      <button type="submit">Actualizar datos</button>
    </form>
  );
}
