import { useForm } from "react-hook-form";
import { useTask } from "../../context/TaskContext";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

/**
 * Componente CreateTaskForm
 * - Componente para actualizar un anuncio (task2).
 * - Recibe `task` (objeto con datos actuales) y `close` (función para cerrar el modal).
 * - Utiliza react-hook-form para manejar el formulario y su validación básica.
 * - Llama a updateTask2 desde el TaskContext para enviar la actualización al backend.
 * - Muestra notificaciones con SweetAlert2 y redirige a /admin tras el éxito.
 */
export default function CreateTaskForm({ task, close }) {
    // Inicializa el formulario con valores por defecto basados en `task` (si existe)
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ 
        defaultValues: { 
            title2: task?.title2 ?? "", 
            description2: task?.description2 ?? "" 
        } 
    });

    // Función del contexto para actualizar anuncios tipo 2
    const { updateTask2 } = useTask();

    // Hook para navegar entre rutas una vez finalizado el proceso
    const navigate = useNavigate();

    // Función que maneja el submit del formulario
    const onSubmit = async (data) => {
        try {
            // Llama al contexto para actualizar el anuncio con el id del task y los datos del formulario
            await updateTask2(task._id, data);

            // Muestra notificación de éxito
            Swal.fire({
                text: "Tu anuncio se ha actualizado.",
                icon: "success",
                confirmButtonColor: "#2563eb",
                confirmButtonText: "Aceptar",
                background: "#fefefe",
                color: "#1e293b",
                timer: 2000,
                timerProgressBar: true,
            }).then(() => navigate("/admin")); // Redirige al panel de admin
        } catch (err) {
            // Muestra notificación de error si la actualización falla
            Swal.fire({
                title: "Error",
                text: "No se pudo actualizar el anuncio.",
                icon: "error",
                confirmButtonColor: "#dc2626",
            });
        }
    };

    return (
        <div className="flex flex-col items-stretch bg-white p-32 rounded-xl shadow-lg w-500 h-full">
            {/* Encabezado del modal */}
            <header className="bg-dark-green p-16 rounded-xl mb-8 text-center shadow-lg">
                <h2 style={{color: "white"}} className="m-0 text-center text-[1.5rem] text-white">Actualizar Anuncio</h2>
            </header>

            {/* Formulario controlado por react-hook-form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 shadow-lg rounded-xl w-full my-8 mx-0 p-16 bf-white">
                
                {/* Campo: Título del anuncio */}
                <div className="flex flex-col gap-4">
                    <label htmlFor="title2" className="text-[1rem] font-[600] text-dark-slate">Titulo</label>
                    <input type="text" {...register("title2", { required: true })}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese el titulo de su anuncio"
                    />
                    {
                        // Nota: aquí se revisa `errors.name` — probablemente quisieras usar `errors.title2`.
                        // No modifiqué el código, solo lo comento para que lo tengas en cuenta.
                        errors.name && (<p className="text-red text-[0.8rem]">El titulo es requerido</p>)
                    }
                </div>

                {/* Campo: Descripción del anuncio */}
                <div className="flex flex-col gap-4">
                    <label htmlFor="description2" className="text-[1rem] font-[600] text-dark-slate">Descripcion</label>
                    <textarea type="text" {...register("description2")}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese la descripcion de su anuncio"
                    />
                </div>

                {/* Botones de acción: cancelar (cierra modal) y actualizar (envía formulario) */}
                <div className="flex justify-between gap-16 mt-8">
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
    );
}
