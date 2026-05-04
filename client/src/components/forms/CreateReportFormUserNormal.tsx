import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";
import Swal from "sweetalert2";
import { IReport } from "../../interfaces/IReport";
import { createReport } from "../../services/report.service";

interface Props {
    close: () => void;
}

export default function CreateReportFormUserNormal({ close }: Props) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm < IReport > ();

    const [imageBase64, setImageBase64] = useState < string > ("");
    const [imageError, setImageError] = useState < string > ("");

    const navigate = useNavigate();

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];

        if (!validTypes.includes(file.type)) {
            setImageError("Formato inválido (JPG, PNG, GIF, WEBP)");
            setImageBase64("");
            return;
        }

        const reader = new FileReader();

        reader.onloadend = () => {
            const result = reader.result as string;
            setImageBase64(result);
            setValue("image", result);
            setImageError("");
        };

        reader.readAsDataURL(file);
    };

    const onSubmit = async (data: IReport) => {
        if (!imageBase64) {
            setImageError("Debes seleccionar una imagen");
            return;
        }

        try {
            await createReport({ ...data, image: imageBase64 });

            Swal.fire({
                title: "¡Publicación creada!",
                icon: "success",
                timer: 2000,
            });

            navigate("/user");
        } catch {
            Swal.fire({
                title: "Error",
                text: "No se pudo crear la publicación",
                icon: "error",
            });
        }
    };

    return (
        <div className="flex flex-col bg-white p-8 rounded-2xl w-full max-w-lg border border-[#E5E5E7]">
            <h2 className="text-xl font-semibold mb-6">Creación de Reporte</h2>

            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                <div>
                    <label>Título</label>
                    <input
                        {...register("title", { required: true })}
                        className="w-full border border-[#E5E5E7] rounded-xl p-3 focus:ring-2 focus:ring-gray-300"
                    />
                    {errors.title && <p className="text-red-500 text-sm">Requerido</p>}
                </div>

                <div>
                    <label>Descripción</label>
                    <textarea
                        {...register("description")}
                        className="w-full border border-[#E5E5E7] rounded-xl p-3"
                    />
                </div>

                <div>
                    <label>Imagen</label>
                    <input type="file" onChange={handleImageChange} />
                    {imageError && <p className="text-red-500 text-sm">{imageError}</p>}
                </div>

                <div className="flex justify-between mt-4">
                    <button type="button" onClick={close}>
                        Cancelar
                    </button>

                    <button type="submit">Publicar</button>
                </div>
            </form>
        </div>
    );
}