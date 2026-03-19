import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import bcrypt from "bcryptjs";
import assets from "../../../src/assets";
import Swal from "sweetalert2";
import "./ProfileUpdate.css";

export default function ProfileUpdate({ close }) {
    // Hook para manejar formularios
    const { register, handleSubmit, formState: { errors }, setValue } = useForm();

    // Funciones del contexto de autenticación
    const { getOneProfile, updateProfile } = useAuth();

    // Parámetros de URL (id del usuario) y navegación
    const params = useParams();
    const navigate = useNavigate();

    // Cargar datos del perfil si existe el id en los parámetros
    useEffect(() => {
        async function loadProfile() {
            if (params.id) {
                const profile = await getOneProfile(params.id);
                // Prellenar formulario con los datos existentes
                setValue("name", profile.name);
                setValue("username", profile.username);
                setValue("email", profile.email);
                setValue("telephone", profile.telephone);
                setValue("age", profile.age);
            }
        }
        loadProfile();
    }, [params.id, setValue, getOneProfile]);

    // Función para enviar los datos del formulario
    const onSubmit = async (data) => {
        const payload = { ...data };

        // Si no se ingresó contraseña, eliminar del payload
        if (!payload.password || payload.password.trim() === "") {
            delete payload.password;
        } else {
            // Hashear la contraseña antes de enviarla
            try {
                const passwordHash = await bcrypt.hash(payload.password, 10);
                payload.password = passwordHash;
            } catch (error) {
                console.error("Error al hashear la contraseña", error);
                Swal.fire({
                    title: "Error",
                    text: "Ocurrió un error al procesar la contraseña.",
                    icon: "error",
                    confirmButtonColor: "#d33",
                });
                return;
            }
        }

        // Actualizar el perfil si existe el id
        if (params.id) {
            try {
                await updateProfile(params.id, payload);
                // Mostrar alerta de éxito
                await Swal.fire({
                    title: "Actualizado",
                    text: "Datos del usuario actualizado correctamente.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });
                // Cerrar el popup
                close();
                // Esperar un momento antes de navegar para mejorar UX
                await new Promise((resolve) => setTimeout(resolve, 600));
                navigate("/profile");
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
        <div>
            {/* Barra de navegación superior */}
            <div>
                <nav className="user-home-navbar">
                    <div className="user-home-navbar-left">
                        <Link>
                        </Link>
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

            {/* Formulario para actualizar datos del perfil */}
            <div>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="text"
                        {...register("name", { required: true })}
                        className=""
                        placeholder="Nombre nuevo"
                    />
                    <input
                        type="text"
                        {...register("username", { required: true })}
                        className=""
                        placeholder="Usuario nuevo"
                    />
                    <input
                        type="email"
                        {...register("email", { required: true })}
                        className=""
                        placeholder="Correo nuevo"
                    />
                    <input
                        type="password"
                        {...register("password", { required: true })}
                        className=""
                        placeholder="Contraseña nueva"
                    />
                    <input
                        type="text"
                        {...register("telephone", { required: true })}
                        className=""
                        placeholder="Teléfono actualizado"
                    />
                    <input
                        type="number"
                        {...register("age", { required: true })}
                        placeholder="Edad actualizada"
                    />
                    <button type="submit">Actualizar datos</button>
                </form>
            </div>
        </div>
    )
};
