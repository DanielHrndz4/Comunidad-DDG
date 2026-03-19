import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import bcrypt from "bcryptjs";
import Swal from "sweetalert2";

/**
 * Componente UpdateAdminForm
 * - Permite actualizar los datos de un usuario desde el panel de administrador.
 * - Carga datos del usuario recibido en props y los prellena en el formulario.
 * - Si el usuario no escribe una nueva contraseña, no se envía al backend.
 * - Usa updateProfile() del AuthContext para actualizar en el servidor.
 * - Muestra SweetAlert para notificaciones y navega de regreso a /admin.
 */
export default function UpdateAdminForm({ user, close }) {

    // useForm inicializa el formulario con valores por defecto del usuario recibido
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: { ...(user ?? {}), password: "" }
    });

    // Hook de navegación para redirigir después de actualizar
    const navigate = useNavigate();

    // Función del contexto de autenticación para actualizar perfil
    const { updateProfile } = useAuth();

    /**
     * useEffect
     * - Cuando el usuario cambia, resetea el formulario con esos datos.
     * - Deja el campo contraseña vacío para evitar mostrar el hash.
     */
    useEffect(() => {
        if (user) {
            reset({ ...user, password: "" });
        }
    }, [user, reset]);

    /**
     * Función onSubmit
     * - Recibe los datos del formulario.
     * - Si el campo contraseña viene vacío, se elimina del payload.
     * - Llama a updateProfile() con el id del usuario y los datos modificados.
     * - Muestra mensaje de éxito o error.
     * - Luego cierra modal y redirige al administrador.
     */
    const onSubmit = async (data) => {
        const payload = { ...data };

        // Si no se escribió una contraseña nueva, no se envía al servidor
        if (!payload.password || payload.password.trim() === "") {
            delete payload.password;
        } 

        // Validación: se actualiza solo si existe el ID del usuario
        if (user?.id) {
            try {
                await updateProfile(user.id, payload);

                // Alerta éxito
                await Swal.fire({
                    title: "Actualizado",
                    text: "Datos del usuario actualizado correctamente.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });

                close(); // Cierra modal

                // Espera breve antes de navegar
                await new Promise((resolve) => setTimeout(resolve, 600));

                navigate("/admin"); // Redirección
            } catch (error) {
                console.error(error);

                // Alerta error
                Swal.fire({
                    title: "Error",
                    text: "Ocurrió un error al actualizar al usuario.",
                    icon: "error",
                    confirmButtonColor: "#d33",
                });
            }
        }
    };

    /**
     * Render del formulario
     * - Campos: name, username, email, contraseña (opcional), teléfono, edad
     * - Muestra errores en pantalla usando react-hook-form
     * - Botones: cancelar (close) y actualizar
     */
    return (
        <div className="flex flex-col items-stretch bg-white p-32 rounded-xl shadow-lg w-500 h-full">
            <header className="bg-dark-green p-16 rounded-xl mb-8 text-center shadow-lg">
                <h2 style={{ color: "white" }} className="m-0 text-center text-[1.5rem] text-white">Actualizar Usuario</h2>
            </header>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 shadow-lg rounded-xl w-full my-8 mx-0 p-16 bf-white">
                <div className="flex flex-col gap-4">
                    <label htmlFor="name" className="text-[1rem] font-[600] text-dark-slate">Nombre</label>
                    <input type="text" {...register("name", { required: true })}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese el nombre del usuario"
                    />
                    {
                        errors.name && (<p className="text-red text-[0.8rem]">El nombre es requerido</p>)
                    }
                </div>
                <div className="flex flex-col gap-4">
                    <label htmlFor="username" className="text-[1rem] font-[600] text-dark-slate">Username</label>
                    <input type="text" {...register("username", { required: true })}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese el usuario nuevo"
                    />
                    {
                        errors.username && (<p className="text-red text-[0.8rem]">El usuario es requerido</p>)
                    }
                </div>
                <div className="flex flex-col gap-4">
                    <label htmlFor="email" className="text-[1rem] font-[600] text-dark-slate">Email</label>
                    <input type="email" {...register("email", { required: true })}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese su email"
                    />
                    {
                        errors.email && (<p className="text-red text-[0.8rem]">El email es requerido</p>)
                    }
                </div>
                <div className="flex flex-col gap-4">
                    <label htmlFor="password" className="text-[1rem] font-[600] text-dark-slate">Contraseña</label>
                    <input type="password" {...register("password")}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="¿Si desea cambiar su contraseña? ingrese una segura"
                    />
                    {
                        errors.password && (<p className="text-red text-[0.8rem]">La contraseña es requerida</p>)
                    }
                </div>
                <div className="flex flex-col gap-4">
                    <label htmlFor="telephone" className="text-[1rem] font-[600] text-dark-slate">Teléfono</label>
                    <input type="text" {...register("telephone", { required: true })}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese el número de telefono"
                    />
                    {
                        errors.telephone && (<p className="text-red text-[0.8rem]">El teléfono es requerido</p>)
                    }
                </div>
                <div className="flex flex-col gap-4">
                    <label htmlFor="age" className="text-[1rem] font-[600] text-dark-slate">Edad</label>
                    <input
                        type="number"
                        min="0"
                        {...register("age", {
                            required: "La edad es requerida",
                            min: { value: 0, message: "La edad no puede ser negativa" }
                        })}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese la edad"
                    />

                    {
                        errors.age && (<p className="text-red text-[0.8rem]">La edad es requerida</p>)
                    }
                </div>

                <div className="flex justify-between gap-16 mt-16">
                    <button
                        type="button"
                        className="bg-custom-gray text-dark-gray py-12 px-16 border-none rounded-md
                        duration-300 ease-in-out cursor-pointer text-[1rem] hover:bg-mid-gray"
                        onClick={() => close()}>
                        Cancelar
                    </button>
                    <button type="submit" className="bg-dark-slate text-white py-12 px-16 border-none
                    duration-300 ease-in-out rounded-md cursor-pointer text-[1rem] hover:bg-custom-slate">
                        Actualizar
                    </button>
                </div>
            </form>
        </div>
    )
};
