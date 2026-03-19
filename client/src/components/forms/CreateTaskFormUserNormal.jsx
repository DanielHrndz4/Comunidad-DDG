import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { useState } from "react";
import { useTask } from "../../context/TaskContext";
import Swal from "sweetalert2";

export default function CreateTaskFormUserNormal({ close }) {

    // Inicialización del formulario con react-hook-form
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();

    // Importa la función createTask2 desde el contexto de tareas
    const { createTask2 } = useTask();

    // Estados locales para la imagen convertida a Base64 y para errores de imagen
    const [imageBase64, setImageBase64] = useState("");
    const [imageError, setImageError] = useState("");

    // Hook para navegar entre rutas
    const navigate = useNavigate();

    // Maneja el cambio de archivo en el input de imagen
    const handleImageChange = (event) => {
        const file = event.target.files[0];

        if (file) {
            // Tipos de imágenes permitidas para evitar formatos inválidos
            const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

            // Validación del tipo de archivo
            if (!validImageTypes.includes(file.type)) {
                setImageError("Por favor, selecciona un archivo de imagen válido, por ejemplo: JPG, PNG, GIF, WEBP.");
                setImageBase64("");
                return;
            }

            // Lectura del archivo como Base64 usando FileReader
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64(reader.result); // Se guarda la imagen codificada
                setValue("image", reader.result); // Se inserta la imagen dentro del formulario
                setImageError(""); // Elimina el error si existía
            };

            reader.readAsDataURL(file);
        }
    };

    // Función principal del formulario al enviarse
    const onSubmit = async (data) => {

        // Verifica que se haya seleccionado una imagen antes de continuar
        if (imageBase64) {
            const formData = { ...data, image: imageBase64 };

            try {
                // Envía los datos al contexto para crear la tarea/anuncio
                await createTask2(formData);

                // Alerta visual de éxito con SweetAlert2
                Swal.fire({
                    title: "¡Anuncio creado!",
                    text: "Tu anuncio se ha guardado correctamente.",
                    icon: "success",
                    confirmButtonColor: "#2563eb",
                    confirmButtonText: "Aceptar",
                    background: "#fefefe",
                    color: "#1e293b",
                    timer: 2000,
                    timerProgressBar: true,
                });

                // Pausa antes de la redirección
                await new Promise((resolve) => setTimeout(resolve, 800));

                // Redirecciona al panel de usuario normal
                navigate("/user");

            } catch (err) {
                // Alerta de error si falla en el backend o contexto
                Swal.fire({
                    title: "Error",
                    text: "No se pudo crear el anuncio.",
                    icon: "error",
                    confirmButtonColor: "#dc2626",
                });
            }

        } else {
            // Error si el usuario intenta enviar sin seleccionar imagen
            setImageError("La imagen no es válida o no se ha seleccionado ninguna.");
        }
    };

    return (
        <div className="flex flex-col items-stretch bg-white p-32 rounded-xl shadow-lg w-500 h-full">

            {/* Encabezado del formulario */}
            <header className="bg-dark-green p-16 rounded-xl mb-8 text-center shadow-lg">
                <h2 style={{ color: "white" }} className="m-0 text-center text-[1.5rem] text-white">
                    Creación de Anuncio
                </h2>
            </header>

            {/* Formulario principal */}
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 shadow-lg rounded-xl w-full my-8 mx-0 p-16 bf-white">

                {/* Campo del título */}
                <div className="flex flex-col gap-4">
                    <label htmlFor="title2" className="text-[1rem] font-[600] text-dark-slate">Titulo</label>

                    <input
                        type="text"
                        {...register("title2", { required: true })}  // Validación básica
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese el titulo de su anuncio"
                    />

                    {/* Mensaje de error para el campo título */}
                    {
                        errors.name && (<p className="text-red text-[0.8rem]">El titulo es requerido</p>)
                    }
                </div>

                {/* Campo descripción */}
                <div className="flex flex-col gap-4">
                    <label htmlFor="description2" className="text-[1rem] font-[600] text-dark-slate">Descripcion</label>

                    <textarea
                        type="text"
                        {...register("description2")}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese la descripcion de su anuncio"
                    />
                </div>

                {/* Campo de imagen */}
                <div className="flex flex-col gap-4">
                    <label htmlFor="image" className="text-[1rem] font-[600] text-dark-slate">Imagen</label>

                    <input
                        type="file"
                        name="image"
                        onChange={handleImageChange} // Maneja la conversión a Base64
                        className="p-12 border border-mid-gray rounded-lg font-[1rem] cursor-pointer hover:bg-mid-gray"
                    />

                    {/* Mensaje de error si la imagen es inválida */}
                    {
                        imageError && (<p className="text-red text-[0.8rem]">{imageError}</p>)
                    }
                </div>

                {/* Botones de acción */}
                <div className="flex justify-between gap-16 mt-8">

                    {/* Botón para cerrar el formulario llamando a la función close() */}
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
                        Publicar
                    </button>

                </div>
            </form>
        </div>
    );
}
