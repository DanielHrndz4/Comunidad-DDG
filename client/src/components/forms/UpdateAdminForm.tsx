import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import Swal from "sweetalert2";

import { IUser } from "../../interfaces/IUser";
import { updateUser } from "../../services/auth.service";

import FormModal from "../ui/FormModal";
import FormInput from "../ui/FormInput";
import FormError from "../ui/FormError";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";

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
    watch,
  } = useForm<IUser>({
    defaultValues: {
      ...(user ?? {}),
      password: "",
    },
  });

  const navigate = useNavigate();

  const nameValue =
    watch("name") || "";

  const usernameValue =
    watch("username") || "";

  const emailValue =
    watch("email") || "";

  const passwordValue =
    watch("password") || "";

  const telephoneValue =
    watch("telephone") || "";

  useEffect(() => {

    if (user) {

      reset({
        ...user,
        password: "",
      });
    }

  }, [user, reset]);

  const onSubmit = async (
    data: IUser
  ) => {

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

        await updateUser(
          user.id,
          payload
        );

        await Swal.fire({
          title: "Actualizado",
          text:
            "Datos actualizados correctamente.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
        });

        close();

        navigate("/admin");

      } catch {

        Swal.fire({
          title: "Error",
          text:
            "Ocurrió un error al actualizar.",
          icon: "error",
        });
      }
    }
  };

  return (
    <FormModal title="Actualizar Usuario">

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >

        <FormInput
          label="Nombre"
          placeholder="Ingrese el nombre"

          error={
            errors.name?.message
          }

          success={
            nameValue.trim().length >= 3
          }

          {...register("name", {
            required:
              "El nombre es requerido",

            minLength: {
              value: 3,
              message:
                "Mínimo 3 caracteres",
            },
          })}
        />

        <FormInput
          label="Username"
          placeholder="Ingrese el username"

          error={
            errors.username?.message
          }

          success={
            usernameValue.trim().length >= 3
          }

          {...register("username", {
            required:
              "El usuario es requerido",

            minLength: {
              value: 3,
              message:
                "Mínimo 3 caracteres",
            },
          })}
        />

        <FormInput
          type="email"
          label="Email"
          placeholder="example@gmail.com"

          error={
            errors.email?.message
          }

          success={
            emailValue.includes("@")
          }

          {...register("email", {
            required:
              "El email es requerido",
          })}
        />

        <FormInput
          type="password"
          label="Contraseña"
          placeholder="Opcional"

          error={
            errors.password?.message
          }

          success={
            passwordValue.length >= 12
          }

          {...register("password", {
            minLength: {
              value: 12,
              message:
                "Mínimo 12 caracteres",
            },
          })}
        />

        <FormInput
          label="Teléfono"
          placeholder="12345678"
          maxLength={8}

          error={
            errors.telephone?.message
          }

          success={
            telephoneValue.trim().length === 8
          }

          {...register("telephone", {
            required:
              "El teléfono es requerido",

            pattern: {
              value: /^[0-9]{8}$/,

              message:
                "Debe contener exactamente 8 dígitos",
            },
          })}
        />

        <FormInput
          type="number"
          label="Edad"
          placeholder="Ingrese la edad"

          error={
            errors.age?.message
          }

          success={
            Number(watch("age")) > 0
          }

          {...register("age", {
            required:
              "La edad es requerida",

            valueAsNumber: true,

            min: {
              value: 0,

              message:
                "Edad inválida",
            },
          })}
        />

        <div
          className="
                        flex
                        justify-between
                        items-center
                        pt-3
                    "
        >

          <SecondaryButton
            type="button"
            onClick={close}
          >
            Cancelar
          </SecondaryButton>

          <PrimaryButton type="submit">
            Actualizar
          </PrimaryButton>

        </div>

      </form>

    </FormModal>
  );
}