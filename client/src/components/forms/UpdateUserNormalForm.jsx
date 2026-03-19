// Importamos useForm para manejar formularios con validaciones
import { useForm } from "react-hook-form";
// useNavigate para redireccionar después de actualizar
import { useNavigate } from "react-router";
// useEffect para reaccionar cuando cambie el usuario
import { useEffect } from "react";
// Hook personalizado de autenticación (para actualizar perfil)
import { useAuth } from "../../context/AuthContext";
// Librería para mostrar alertas estilizadas
import Swal from "sweetalert2";

// Componente que recibe:
// - user: datos del usuario a editar
// - close: función para cerrar el modal o formulario
export default function UpdateUserNormalForm({ user, close }) {

    // Configuración de react-hook-form con valores por defecto
    // Si existe "user", los campos se rellenan automáticamente
    const { register, handleSubmit, formState: { errors }, reset } = useForm({
        defaultValues: { ...(user ?? {}), password: "" }
    });

    // Hook para redirigir a otra ruta
    const navigate = useNavigate();

    // Función del contexto para actualizar el perfil
    const { updateProfile } = useAuth();

    // Cada vez que cambie el usuario (user), reseteamos el formulario
    // Esto permite que si abrimos el formulario para distintos usuarios, se actualicen los valores
    useEffect(() => {
        if (user) {
            reset({ ...user, password: "" });
        }
    }, [user, reset]);

    // Función principal de envío del formulario
    const onSubmit = async (data) => {
        const payload = { ...data };

        // Si el usuario NO ingresó una contraseña nueva, no se envía
        // Así evitamos sobreescribir la contraseña existente
        if (!payload.password || payload.password.trim() === "") {
            delete payload.password;
        }
        // El hashing de contraseña debe hacerse en backend

        // Solo actualiza si el usuario tiene un ID
        if (user?.id) {
            try {
                // Llamada al backend desde el contexto de autenticación
                await updateProfile(user.id, payload);

                // Alerta de éxito
                await Swal.fire({
                    title: "Actualizado",
                    text: "Datos del usuario actualizado correctamente.",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 2000,
                    timerProgressBar: true,
                });

                // Cerrar modal o formulario
                close();

                // Pausa para una mejor transición antes de navegar
                await new Promise((resolve) => setTimeout(resolve, 600));

                // Redirección a /user
                navigate("/user");

            } catch (error) {
                console.error(error);

                // Alerta de error si ocurre algo en la actualización
                Swal.fire({
                    title: "Error",
                    text: "Ocurrió un error al actualizar al usuario.",
                    icon: "error",
                    confirmButtonColor: "#d33",
                });
            }
        }
    };

    // Render del formulario completo con sus estilos
    return (
        <div className="flex flex-col items-stretch bg-white p-32 rounded-xl shadow-lg w-500 h-full">
            
            {/* Encabezado */}
            <header className="bg-dark-green p-16 rounded-xl mb-8 text-center shadow-lg">
                <h2 style={{ color: "white" }} className="m-0 text-center text-[1.5rem] text-white">
                    Actualizar Usuario
                </h2>
            </header>

            {/* Formulario con manejo de envío usando handleSubmit */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 shadow-lg rounded-xl w-full my-8 mx-0 p-16 bf-white">

                {/* Campo Nombre */}
                <div className="flex flex-col gap-4">
                    <label htmlFor="name" className="text-[1rem] font-[600] text-dark-slate">Nombre</label>
                    <input 
                        type="text" 
                        {...register("name", { required: true })}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese el nombre del usuario"
                    />
                    {errors.name && (<p className="text-red text-[0.8rem]">El nombre es requerido</p>)}
                </div>

                {/* Campo Username */}
                <div className="flex flex-col gap-4">
                    <label htmlFor="username" className="text-[1rem] font-[600] text-dark-slate">Username</label>
                    <input 
                        type="text" 
                        {...register("username", { required: true })}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese el usuario nuevo"
                    />
                    {errors.username && (<p className="text-red text-[0.8rem]">El usuario es requerido</p>)}
                </div>

                {/* Campo Email */}
                <div className="flex flex-col gap-4">
                    <label htmlFor="email" className="text-[1rem] font-[600] text-dark-slate">Email</label>
                    <input 
                        type="email" 
                        {...register("email", { required: true })}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese su email"
                    />
                    {errors.email && (<p className="text-red text-[0.8rem]">El email es requerido</p>)}
                </div>

                {/* Campo Contraseña (opcional, solo si desea cambiarla) */}
                <div className="flex flex-col gap-4">
                    <label htmlFor="password" className="text-[1rem] font-[600] text-dark-slate">Contraseña</label>
                    <input 
                        type="password" 
                        {...register("password")}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="¿Si desea cambiar su contraseña? ingrese una segura"
                    />
                    {errors.password && (<p className="text-red text-[0.8rem]">La contraseña es requerida</p>)}
                </div>

                {/* Campo Teléfono */}
                <div className="flex flex-col gap-4">
                    <label htmlFor="telephone" className="text-[1rem] font-[600] text-dark-slate">Teléfono</label>
                    <input 
                        type="text" 
                        {...register("telephone", { required: true })}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese el número de telefono"
                    />
                    {errors.telephone && (<p className="text-red text-[0.8rem]">El teléfono es requerido</p>)}
                </div>

                {/* Campo Edad */}
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
                    {errors.age && (<p className="text-red text-[0.8rem]">La edad es requerida</p>)}
                </div>

                {/* Botones de acción */}
                <div className="flex justify-between gap-16 mt-16">
                    <button
                        type="button"
                        className="bg-custom-gray text-dark-gray py-12 px-16 border-none rounded-md duration-300 ease-in-out cursor-pointer text-[1rem] hover:bg-mid-gray"
                        onClick={() => close()}>
                        Cancelar
                    </button>

                    <button 
                        type="submit" 
                        className="bg-dark-slate text-white py-12 px-16 border-none duration-300 ease-in-out rounded-md cursor-pointer text-[1rem] hover:bg-custom-slate">
                        Actualizar
                    </button>
                </div>
            </form>
        </div>
    );
};
