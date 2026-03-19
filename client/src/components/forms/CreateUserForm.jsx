import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

export default function CreateUserForm({ close }) {

    // Inicialización del formulario con react-hook-form
    // register: registra los inputs
    // handleSubmit: maneja el envío del formulario
    // reset: limpia el formulario después de enviar
    // errors: contiene los errores de validación de los campos
    const { register, handleSubmit, reset, formState: { errors } } = useForm();

    // Obtiene del AuthContext la función createUser y posibles errores del servidor
    const { createUser, errors: signinErrorsRaw } = useAuth();

    // Hook para navegación de rutas
    const navigate = useNavigate();

    // Normaliza los errores del servidor a un array para manejar correctamente
    const signinErrors = Array.isArray(signinErrorsRaw)
        ? signinErrorsRaw
        : (signinErrorsRaw ? [signinErrorsRaw] : []);

    // Función que se ejecuta cuando se envía el formulario
    const onSubmit = async (data) => {
        try {
            // Envía los datos al AuthContext para crear al usuario
            await createUser(data);

            // Muestra alerta de éxito usando SweetAlert2
            Swal.fire({
                title: "Usuario creado!",
                text: "El usuario se ha creado correctamente.",
                icon: "success",
                confirmButtonColor: "#2563eb",
                confirmButtonText: "Aceptar",
                background: "#fefefe",
                color: "#1e293b",
                timer: 2000,
                timerProgressBar: true,
            }).then(() => navigate("/admin")); // Redirige al panel de admin

        } catch (error) {
            // Alerta si ocurre un error en el proceso
            Swal.fire({
                title: "Error",
                text: "No se pudo crear al usuario, revisar que los campos cumplan con su estructura o revise que el usuario o el correo sean únicos.",
                icon: "error",
                confirmButtonColor: "#dc2626",
            });
        }
    };

    return (
        <div className="flex flex-col items-stretch bg-white p-32 rounded-xl shadow-lg w-500 h-full">

            {/* Encabezado del formulario */}
            <header className="bg-dark-green p-16 rounded-xl mb-8 text-center shadow-lg">
                <h2 style={{ color: "white" }} className="m-0 text-center text-[1.5rem] text-white">
                    Creación de Usuario
                </h2>
            </header>

            {/* Formulario principal */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 shadow-lg rounded-xl w-full my-8 mx-0 p-16 bf-white">

                {/* Campo: Nombre */}
                <div className="flex flex-col gap-4">
                    <label htmlFor="name" className="text-[1rem] font-[600] text-dark-slate">Nombre</label>

                    <input
                        id="name"
                        type="text"
                        {...register("name", { required: true })}  // Validación requerida
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese el nombre del usuario (nombres y apellidos)"
                    />

                    {/* Mensaje de error */}
                    {errors.name && (<p className="text-red text-[0.8rem]">El nombre es requerido</p>)}
                </div>

                {/* Campo: Username */}
                <div className="flex flex-col gap-4">
                    <label htmlFor="username" className="text-[1rem] font-[600] text-dark-slate">Username</label>

                    <input
                        id="username"
                        type="text"
                        {...register("username", { required: true })}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese un usuario nuevo"
                    />

                    {errors.username && (<p className="text-red text-[0.8rem]">El usuario es requerido</p>)}
                </div>

                {/* Campo: Email */}
                <div className="flex flex-col gap-4">
                    <label htmlFor="email" className="text-[1rem] font-[600] text-dark-slate">Email</label>

                    <input
                        id="email"
                        type="email"
                        {...register("email", { required: true })}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese su email (example@gmail.com)"
                    />

                    {errors.email && (<p className="text-red text-[0.8rem]">El email es requerido</p>)}
                </div>

                {/* Campo: Contraseña */}
                <div className="flex flex-col gap-4">
                    <label htmlFor="password" className="text-[1rem] font-[600] text-dark-slate">Contraseña</label>

                    <input
                        id="password"
                        type="password"
                        {...register("password", { required: true })}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese una contraseña para el usuario (mínimo 12 cáracteres)"
                    />

                    {errors.password && (<p className="text-red text-[0.8rem]">La contraseña es requerida</p>)}
                </div>

                {/* Campo: Teléfono */}
                <div className="flex flex-col gap-4">
                    <label htmlFor="telephone" className="text-[1rem] font-[600] text-dark-slate">Teléfono</label>

                    <input
                        id="telephone"
                        type="text"
                        {...register("telephone", { required: true })}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese el número de télefono (mínimo de 8 dígitos)"
                    />

                    {errors.telephone && (<p className="text-red text-[0.8rem]">El teléfono es requerido</p>)}
                </div>

                {/* Campo: Edad */}
                <div className="flex flex-col gap-4">
                    <label htmlFor="age" className="text-[1rem] font-[600] text-dark-slate">Edad</label>

                    <input
                        id="age"
                        type="number"
                        min="0"
                        {...register("age", {
                            required: "La edad es requerida",
                            min: { value: 0, message: "La edad no puede ser negativa" }
                        })}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese la edad (mayor de 18 años)"
                    />

                    {errors.age && (<p className="text-red text-[0.8rem]">La edad es requerida</p>)}
                </div>

                {/* Selector de rol del usuario */}
                <div className="flex flex-col py-4">
                    <select
                        {...register("role", { required: true })}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        defaultValue="normal"
                    >
                        <option value="normal">Normal</option>
                        <option value="vigilant">Vigilant</option>
                    </select>

                    {errors.role && <p className="text-red text-[0.8rem]">El rol es requerido</p>}
                </div>

                {/* Botones del formulario */}
                <div className="flex justify-between gap-16">

                    {/* Botón para cerrar el modal */}
                    <button
                        type="button"
                        className="bg-custom-gray text-dark-gray py-12 px-16 border-none rounded-md
                        duration-300 ease-in-out cursor-pointer text-[1rem] hover:bg-mid-gray"
                        onClick={() => close()}
                    >
                        Cancelar
                    </button>

                    {/* Botón para enviar el formulario */}
                    <button
                        type="submit"
                        className="bg-dark-slate text-white py-12 px-16 border-none
                        duration-300 ease-in-out rounded-md cursor-pointer text-[1rem] hover:bg-custom-slate"
                    >
                        Crear cuenta
                    </button>
                </div>
            </form>
        </div>
    );
}
