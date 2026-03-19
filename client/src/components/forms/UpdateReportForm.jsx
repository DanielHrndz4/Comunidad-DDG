import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useTask } from "../../context/TaskContext";
import Swal from "sweetalert2";

export default function CreateReportForm({ report, close }) {
    // Inicializa el formulario con valores por defecto basados en el reporte recibido
    const { register, handleSubmit, reset, formState: { errors } } = useForm({ 
        defaultValues: { 
            title: report?.title ?? "", 
            description: report?.description ?? ""
        } 
    });

    // Hook del contexto para actualizar tareas/reportes
    const { updateTask } = useTask();

    // Hook para redirigir después de actualizar
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            // Llama a la función del contexto para actualizar el reporte
            await updateTask(report._id, data);

            // Muestra alerta de éxito
            Swal.fire({
                text: "Tu publicación se ha actualizado.",
                icon: "success",
                confirmButtonColor: "#2563eb",
                confirmButtonText: "Aceptar",
                background: "#fefefe",
                color: "#1e293b",
                timer: 2000,
                timerProgressBar: true,
            }).then(() => navigate("/admin")); // Redirige al panel admin
        } catch (err) {
            // Alerta por error en la actualización
            Swal.fire({
                title: "Error",
                text: "No se pudo actualizar la publicación.",
                icon: "error",
                confirmButtonColor: "#dc2626",
            });
        }
    };

    return (
        <div className="flex flex-col items-stretch bg-white p-32 rounded-xl shadow-lg w-500 h-full">
            {/* Encabezado del modal */}
            <header className="bg-dark-green p-16 rounded-xl mb-8 text-center shadow-lg">
                <h2 style={{ color: "white" }} className="m-0 text-center text-[1.5rem] text-white">
                    Actualizar Reporte
                </h2>
            </header>

            {/* Formulario */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 shadow-lg rounded-xl w-full my-8 mx-0 p-16 bf-white">

                {/* Campo: título */}
                <div className="flex flex-col gap-4">
                    <label htmlFor="title" className="text-[1rem] font-[600] text-dark-slate">Titulo</label>
                    <input type="text"
                        {...register("title", { required: true })} // Validación requerida
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese el titulo de su reporte"
                    />
                    {
                        errors.name && (<p className="text-red text-[0.8rem]">El titulo es requerido</p>)
                    }
                </div>

                {/* Campo: descripción */}
                <div className="flex flex-col gap-4">
                    <label htmlFor="description" className="text-[1rem] font-[600] text-dark-slate">Descripcion</label>
                    <textarea type="text"
                        {...register("description")} // Campo opcional
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese la descripcion de su reporte"
                    />
                </div>

                {/* Botones de acción */}
                <div className="flex justify-between gap-16 mt-8">
                    {/* Cierra el modal */}
                    <button
                        type="button"
                        className="bg-custom-gray text-dark-gray py-12 px-16 border-none rounded-md
                        duration-300 ease-in-out cursor-pointer text-[1rem] hover:bg-mid-gray"
                        onClick={() => close()}>
                        Cancelar
                    </button>

                    {/* Envía el formulario */}
                    <button type="submit"
                        className="bg-dark-slate text-white py-12 px-16 border-none
                        duration-300 ease-in-out rounded-md cursor-pointer text-[1rem] hover:bg-custom-slate">
                        Actualizar
                    </button>
                </div>
            </form>
        </div>
    );
}
