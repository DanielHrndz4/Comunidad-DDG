import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useTask } from "../../context/TaskContext";
import Swal from "sweetalert2";

/**
 * CreateReportFormUserNormal
 * - Formulario para que un usuario normal cree un reporte/tarea con imagen en base64.
 * - Recibe `close` (función) para cerrar el modal/formulario desde el componente padre.
 */
export default function CreateReportFormUserNormal({ close }) {
    // react-hook-form: registro de campos, manejo de envío y errores
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    // Contexto personalizado para tareas (contiene la función createTask)
    const { createTask } = useTask();

    // Estado para almacenar la imagen en base64 y mensajes de error relacionados
    const [imageBase64, setImageBase64] = useState("");
    const [imageError, setImageError] = useState("");

    // Hook de navegación para redirigir al usuario después de crear la tarea
    const navigate = useNavigate();

    /**
     * handleImageChange
     * - Se ejecuta cuando el usuario selecciona un archivo.
     * - Valida el tipo de imagen, la convierte a base64 y la guarda en el estado
     *   y en el formulario (setValue) para que react-hook-form también la tenga.
     */
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
            if (!validImageTypes.includes(file.type)) {
                // Tipo no válido → mostrar mensaje y limpiar base64
                setImageError("Por favor, selecciona un archivo de imagen válido, por ejemplo: JPG, PNG, GIF, WEBP.");
                setImageBase64("");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                // Guarda el resultado base64 en el estado y en el formulario
                setImageBase64(reader.result);
                setValue("image", reader.result);
                setImageError("");
            };
            reader.readAsDataURL(file); // Convierte el archivo a base64
        }
    };

    /**
     * onSubmit
     * - Se ejecuta al enviar el formulario.
     * - Verifica que exista una imagen válida en base64, arma el payload y llama a createTask.
     * - Muestra alertas con SweetAlert y redirige según sea usuario normal.
     */
    const onSubmit = async (data) => {
        if (imageBase64) {
            const formData = { ...data, image: imageBase64 };
            try {
                // Llama al contexto para crear la tarea en el backend
                await createTask(formData);

                // Muestra confirmación visual
                Swal.fire({
                    title: "¡Publicación creada!",
                    text: "Tu publicación se ha guardado correctamente.",
                    icon: "success",
                    confirmButtonColor: "#2563eb",
                    confirmButtonText: "Aceptar",
                    background: "#fefefe",
                    color: "#1e293b",
                    timer: 2000,
                    timerProgressBar: true,
                });

                // Pequeña pausa para que el usuario vea la alerta
                await new Promise((resolve) => setTimeout(resolve, 800));

                // Redirige al panel de usuario normal
                navigate("/user");
            } catch (err) {
                // Alerta de error si falla la creación
                Swal.fire({
                    title: "Error",
                    text: "No se pudo crear la publicación.",
                    icon: "error",
                    confirmButtonColor: "#dc2626",
                });
            }
        } else {
            // Si no hay imagen válida, muestra mensaje de validación
            setImageError("La imagen no es válida o no se ha seleccionado ninguna.");
        }
    };

    return (
        <div className="flex flex-col items-stretch bg-white p-32 rounded-xl shadow-lg w-500 h-full">
            <header className="bg-dark-green p-16 rounded-xl mb-8 text-center shadow-lg">
                <h2 style={{ color: "white" }} className="m-0 text-center text-[1.5rem] text-white">Creación de Reporte</h2>
            </header>
            {/* Formulario controlado por react-hook-form */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 shadow-lg rounded-xl w-full my-8 mx-0 p-16 bf-white">
                <div className="flex flex-col gap-4">
                    <label htmlFor="title" className="text-[1rem] font-[600] text-dark-slate">Titulo</label>
                    <input type="text" {...register("title", { required: true })}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese el titulo de su reporte"
                    />
                    {
                        // Mensaje si falta el título (react-hook-form error)
                        errors.name && (<p className="text-red text-[0.8rem]">El titulo es requerido</p>)
                    }
                </div>
                <div className="flex flex-col gap-4">
                    <label htmlFor="description" className="text-[1rem] font-[600] text-dark-slate">Descripcion</label>
                    <textarea type="text" {...register("description")}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese la descripcion de su reporte"
                    />
                </div>
                <div className="flex flex-col gap-4">
                    <label htmlFor="image" className="text-[1rem] font-[600] text-dark-slate">Imagen</label>
                    {/* Input tipo file — onChange convierte la imagen a base64 */}
                    <input type="file" name="image" onChange={handleImageChange}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem] cursor-pointer hover:bg-mid-gray"
                    />
                    {
                        // Muestra error relacionado con la imagen (tipo o ausencia)
                        imageError && (<p className="text-red text-[0.8rem]">{imageError}</p>)
                    }
                </div>

                <div className="flex justify-between gap-16 mt-8">
                    {/* Botón cancelar: usa la función close pasada como prop */}
                    <button
                        type="button"
                        className="bg-custom-gray text-dark-gray py-12 px-16 border-none rounded-md
                        duration-300 ease-in-out cursor-pointer text-[1rem] hover:bg-mid-gray"
                        onClick={() => close()}>
                        Cancelar
                    </button>
                    {/* Botón enviar: dispara la validación y el envío */}
                    <button type="submit" className="bg-dark-slate text-white py-12 px-16 border-none
                    duration-300 ease-in-out rounded-md cursor-pointer text-[1rem] hover:bg-custom-slate">
                        Publicar
                    </button>
                </div>
            </form>
        </div>
    );
}
