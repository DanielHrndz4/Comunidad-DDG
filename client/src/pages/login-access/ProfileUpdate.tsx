import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useParams } from "react-router";
import bcrypt from "bcryptjs";
import Swal from "sweetalert2";

import { useAuth } from "../../context/AuthContext";
import assets from "../../assets";
import "./ProfileUpdate.css";

interface ProfileUpdateProps {
  close: () => void;
}

interface ProfileUpdateFormData {
  name: string;
  username: string;
  email: string;
  password?: string;
  telephone: string;
}

export default function ProfileUpdate({
  close,
}: ProfileUpdateProps) {
  const { register, handleSubmit, setValue } =
    useForm<ProfileUpdateFormData>();

  const { getOneProfile, updateProfile } =
    useAuth();

  const params = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    async function loadProfile(): Promise<void> {
      if (params.id) {
        const profile = await getOneProfile(
          params.id
        );

        if (profile) {
          setValue("name", profile.name);
          setValue("username", profile.username);
          setValue("email", profile.email);
          setValue(
            "telephone",
            profile.telephone
          );
        }
      }
    }

    loadProfile();
  }, [params.id, setValue, getOneProfile]);

  const onSubmit = async (
    data: ProfileUpdateFormData
  ): Promise<void> => {
    const payload: ProfileUpdateFormData = {
      ...data,
    };

    if (
      !payload.password ||
      payload.password.trim() === ""
    ) {
      delete payload.password;
    } else {
      try {
        const passwordHash =
          await bcrypt.hash(
            payload.password,
            10
          );

        payload.password = passwordHash;
      } catch (error: unknown) {
        console.error(
          "Error al hashear la contraseña",
          error
        );

        Swal.fire({
          title: "Error",
          text: "Ocurrió un error al procesar la contraseña.",
          icon: "error",
          confirmButtonColor: "#d33",
        });

        return;
      }
    }

    if (params.id) {
      try {
        await updateProfile(params.id, payload);

        await Swal.fire({
          title: "Actualizado",
          text: "Datos del usuario actualizado correctamente.",
          icon: "success",
          showConfirmButton: false,
          timer: 2000,
          timerProgressBar: true,
        });

        close();

        await new Promise((resolve) =>
          setTimeout(resolve, 600)
        );

        navigate("/profile");
      } catch (error: unknown) {
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
    <div>
      <div>
        <nav className="user-home-navbar">
          <div className="user-home-navbar-left">
            <Link to="/" />
          </div>

          <div className="user-home-navbar-right">
            <Link to="/user">
              <img
                src={assets.casa}
                alt="Inicio"
                className="user-home-icono"
              />
            </Link>

            <div className="user-home-dropdown">
              <Link to="/profile">
                <img
                  src={assets.usuario1}
                  alt="Usuario"
                  className="user-home-icono-usuario"
                />
              </Link>
            </div>
          </div>
        </nav>
      </div>

      <div>
        <form
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            type="text"
            {...register("name", {
              required: true,
            })}
            placeholder="Nombre nuevo"
          />

          <input
            type="text"
            {...register("username", {
              required: true,
            })}
            placeholder="Usuario nuevo"
          />

          <input
            type="email"
            {...register("email", {
              required: true,
            })}
            placeholder="Correo nuevo"
          />

          <input
            type="password"
            {...register("password")}
            placeholder="Contraseña nueva"
          />

          <input
            type="text"
            {...register("telephone", {
              required: true,
            })}
            placeholder="Teléfono actualizado"
          />



          <button type="submit">
            Actualizar datos
          </button>
        </form>
      </div>
    </div>
  );
}