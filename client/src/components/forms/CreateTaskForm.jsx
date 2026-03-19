import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router";
import { useState } from "react";
import { useTask } from "../../context/TaskContext";
import Swal from "sweetalert2";

export default function CreateTaskForm({ close }) {
    // useForm para manejo del formulario y validaciones
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    
    // Función del contexto para crear una tarea tipo 2
    const { createTask2 } = useTask();

    // Estados para manejar imagen seleccionada en Base64 y errores
    const [imageBase64, setImageBase64] = useState("");
    const [imageError, setImageError] = useState("");

    const navigate = useNavigate();

    // Maneja el cambio de la imagen, la convierte a Base64 y valida que sea formato aceptado
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Tipos de imágenes permitidas
            const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
            if (!validImageTypes.includes(file.type)) {
                setImageError("Por favor, selecciona un archivo de imagen válido, por ejemplo: JPG, PNG, GIF, WEBP.");
                setImageBase64("");
                return;
            }

            // Convertir a Base64 con FileReader
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64(reader.result); // Guarda la imagen codificada
                setValue("image", reader.result); // Inserta la imagen en el form manualmente
                setImageError("");
            };
            reader.readAsDataURL(file);
        }
    };

    // Función del submit del formulario
    const onSubmit = async (data) => {
        // Verifica que la imagen exista
        if (imageBase64) {
            const formData = { ...data, image: imageBase64 };

            try {
                // Envía la información al backend usando el contexto
                await createTask2(formData);

                // Notificación de éxito
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

                // Pausa opcional antes de redirigir
                await new Promise((resolve) => setTimeout(resolve, 800));
                navigate("/admin");
            } catch (err) {
                // Notificación de error
                Swal.fire({
                    title: "Error",
                    text: "No se pudo crear el anuncio.",
                    icon: "error",
                    confirmButtonColor: "#dc2626",
                });
            }
        } else {
            // Error si el usuario no subió imagen
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

                {/* Campo título */}
                <div className="flex flex-col gap-4">
                    <label htmlFor="title2" className="text-[1rem] font-[600] text-dark-slate">Titulo</label>
                    <input 
                        type="text" 
                        {...register("title2", { required: true })}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem]"
                        placeholder="Ingrese el titulo de su anuncio"
                    />
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
                        onChange={handleImageChange}
                        className="p-12 border border-mid-gray rounded-lg font-[1rem] cursor-pointer hover:bg-mid-gray"
                    />
                    {
                        imageError && (<p className="text-red text-[0.8rem]">{imageError}</p>)
                    }
                </div>

                {/* Botones de acción */}
                <div className="flex justify-between gap-16 mt-8">
                    {/* Botón cancelar: cierra modal/componente */}
                    <button
                        type="button"
                        className="bg-custom-gray text-dark-gray py-12 px-16 border-none rounded-md
                        duration-300 ease-in-out cursor-pointer text-[1rem] hover:bg-mid-gray"
                        onClick={() => close()}>
                        Cancelar
                    </button>

                    {/* Botón publicar */}
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
