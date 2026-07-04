import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

import { useAuth } from "../../context/AuthContext";
import type { RegisterFormData } from "../../interfaces/IAuthForms";

import FormModal from "../ui/FormModal";
import FormInput from "../ui/FormInput";
import FormError from "../ui/FormError";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";

interface Props {
  close: () => void;
}

type CreateUserFormData = Omit<
  RegisterFormData,
  "confirmPassword"
>;

export default function CreateUserForm({
  close,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateUserFormData>();

  const { createUser, getUsers } = useAuth();
  const navigate = useNavigate();

  const nameValue = watch("name") || "";
  const usernameValue = watch("username") || "";
  const emailValue = watch("email") || "";
  const passwordValue = watch("password") || "";
  const telephoneValue = watch("telephone") || "";

  const getErrorMessage = (
    value: unknown
  ): string | undefined =>
    typeof value === "string" ? value : undefined;

  const onSubmit = async (
    data: CreateUserFormData
  ): Promise<void> => {
    try {
      const payload: RegisterFormData = {
        ...data,
        confirmPassword: data.password,
      };

      await createUser(payload);
      await getUsers();

      await Swal.fire({
        title: "¡Usuario creado!",
        text: "El usuario se ha creado correctamente.",
        icon: "success",
        confirmButtonColor: "#2563eb",
        timer: 2000,
        showConfirmButton: false,
      });

      close();
      navigate("/admin");
    } catch (error: unknown) {
      console.error(error);

      Swal.fire({
        title: "Error",
        text: "No se pudo crear al usuario.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <FormModal title="Nuevo Usuario">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <FormInput
          label="Nombre"
          placeholder="Ingrese el nombre del usuario"
          error={getErrorMessage(errors.name?.message)}
          success={nameValue.trim().length >= 3}
          {...register("name", {
            required: "El nombre es requerido",
            minLength: {
              value: 3,
              message: "Mínimo 3 caracteres",
            },
          })}
        />

        <FormInput
          label="Username"
          placeholder="Ingrese un username"
          error={getErrorMessage(errors.username?.message)}
          success={usernameValue.trim().length >= 3}
          {...register("username", {
            required: "El username es requerido",
            minLength: {
              value: 3,
              message: "Mínimo 3 caracteres",
            },
          })}
        />

        <FormInput
          type="email"
          label="Email"
          placeholder="example@gmail.com"
          error={getErrorMessage(errors.email?.message)}
          success={emailValue.includes("@")}
          {...register("email", {
            required: "El email es requerido",
          })}
        />

        <FormInput
          type="password"
          label="Contraseña"
          placeholder="Mínimo 8 caracteres"
          error={getErrorMessage(errors.password?.message)}
          success={passwordValue.length >= 8}
          {...register("password", {
            required: "La contraseña es requerida",
            minLength: {
              value: 8,
              message: "Mínimo 8 caracteres",
            },
          })}
        />

        <FormInput
          label="Teléfono"
          placeholder="12345678"
          maxLength={8}
          error={getErrorMessage(errors.telephone?.message)}
          success={telephoneValue.trim().length === 8}
          {...register("telephone", {
            required: "El teléfono es requerido",
            pattern: {
              value: /^[0-9]{8}$/,
              message:
                "Debe contener exactamente 8 dígitos",
            },
          })}
        />



        <div className="flex flex-col gap-2">
          <label className="text-[0.88rem] font-medium text-[#6E6E73] ml-1">
            Rol
          </label>

          <select
            {...register("role", {
              required: "El rol es requerido",
            })}
            defaultValue="normal"
            className="
              w-full
              h-[58px]
              px-5
              rounded-[20px]
              bg-[#F5F5F7]
              border
              border-[#D2D2D7]
              text-[#1D1D1F]
              outline-none
              transition-all
              duration-200
              focus:border-[#0071E3]
              focus:ring-4
              focus:ring-[#0071E3]/10
            "
          >
            <option value="normal">
              Normal
            </option>
            <option value="vigilant">
              Vigilante
            </option>
          </select>

          <FormError
            message={getErrorMessage(errors.role?.message)}
          />
        </div>

        <div className="flex justify-between items-center pt-3">
          <SecondaryButton
            type="button"
            onClick={close}
          >
            Cancelar
          </SecondaryButton>

          <PrimaryButton type="submit">
            Crear cuenta
          </PrimaryButton>
        </div>
      </form>
    </FormModal>
  );
}
