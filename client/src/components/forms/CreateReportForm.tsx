import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";
import Swal from "sweetalert2";

import { IReport } from "../../interfaces/IReport";
import { createReport } from "../../services/report.service";

import FormModal from "../ui/FormModal";
import FormInput from "../ui/FormInput";
import FormTextarea from "../ui/FormTextarea";
import FormError from "../ui/FormError";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";

interface ReportFormData extends Omit<IReport, "location"> {
    longitude: number;
    latitude: number;
}

interface Props {
    close: () => void;
}

export default function CreateReportForm({ close }: Props) {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch,
    } = useForm<ReportFormData>();

    const [imageBase64, setImageBase64] = useState<string>("");
    const [imageError, setImageError] = useState<string>("");
    const [geoLoading, setGeoLoading] = useState(false);

    const navigate = useNavigate();

    const titleValue = watch("title") || "";
    const descriptionValue = watch("description") || "";

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

    const handleGeolocate = () => {
        if (!navigator.geolocation) {
            Swal.fire({ title: "Error", text: "Tu navegador no soporta geolocalización", icon: "error" });
            return;
        }
        setGeoLoading(true);
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                setValue("longitude", parseFloat(pos.coords.longitude.toFixed(6)));
                setValue("latitude", parseFloat(pos.coords.latitude.toFixed(6)));
                setGeoLoading(false);
            },
            () => {
                Swal.fire({ title: "Error", text: "No se pudo obtener tu ubicación", icon: "error" });
                setGeoLoading(false);
            }
        );
    };

    const onSubmit = async (data: ReportFormData) => {
        if (!imageBase64) {
            setImageError("Debes seleccionar una imagen");
            return;
        }

        const report: IReport = {
            ...data,
            image: imageBase64,
            location: {
                type: "Point",
                coordinates: [Number(data.longitude), Number(data.latitude)],
            },
        };

        try {
            await createReport(report);

            Swal.fire({
                title: "¡Publicación creada!",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
            });

            navigate("/admin");
        } catch {
            Swal.fire({
                title: "Error",
                text: "No se pudo crear la publicación",
                icon: "error",
            });
        }
    };

    return (
        <FormModal title="Nuevo Reporte">
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">

                <FormInput
                    label="Título"
                    placeholder="Ingrese el título del reporte"
                    error={errors.title?.message}
                    success={titleValue.trim().length >= 5}
                    {...register("title", {
                        required: "El título es requerido",
                        minLength: { value: 5, message: "Mínimo 5 caracteres" },
                    })}
                />

                <FormTextarea
                    label="Descripción"
                    placeholder="Ingrese una descripción"
                    maxLength={300}
                    error={errors.description?.message}
                    success={descriptionValue.trim().length >= 10}
                    {...register("description", {
                        required: "La descripción es requerida",
                        minLength: { value: 10, message: "Mínimo 10 caracteres" },
                    })}
                />

                <div className="flex flex-col gap-2">
                    <label className="text-[0.88rem] font-medium text-[#6E6E73] ml-1">
                        Imagen
                    </label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="
                            w-full bg-[#F5F5F7] border border-[#D2D2D7] rounded-[20px]
                            px-4 py-3 text-[0.95rem] text-[#1D1D1F] transition-all duration-200
                            file:mr-4 file:px-4 file:py-2 file:border-0 file:rounded-full
                            file:bg-[#0071E3] file:text-white file:cursor-pointer hover:file:brightness-110
                        "
                    />
                    <FormError message={imageError} />
                </div>

                {/* Sección de ubicación geoespacial */}
                <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                        <label className="text-[0.88rem] font-medium text-[#6E6E73] ml-1">
                            Ubicación (GeoJSON)
                        </label>
                        <button
                            type="button"
                            onClick={handleGeolocate}
                            disabled={geoLoading}
                            className="
                                text-[0.8rem] px-3 py-1 rounded-full
                                bg-[#34C759] text-white cursor-pointer
                                hover:brightness-90 disabled:opacity-50
                            "
                        >
                            {geoLoading ? "Obteniendo..." : "📍 Usar mi ubicación"}
                        </button>
                    </div>

                    <div className="flex gap-3">
                        <div className="flex-1 flex flex-col gap-1">
                            <FormInput
                                label="Longitud"
                                placeholder="-89.2182"
                                type="number"
                                step="any"
                                error={errors.longitude?.message}
                                {...register("longitude", {
                                    required: "La longitud es requerida",
                                    min: { value: -180, message: "Mín. -180" },
                                    max: { value: 180, message: "Máx. 180" },
                                })}
                            />
                        </div>
                        <div className="flex-1 flex flex-col gap-1">
                            <FormInput
                                label="Latitud"
                                placeholder="13.6929"
                                type="number"
                                step="any"
                                error={errors.latitude?.message}
                                {...register("latitude", {
                                    required: "La latitud es requerida",
                                    min: { value: -90, message: "Mín. -90" },
                                    max: { value: 90, message: "Máx. 90" },
                                })}
                            />
                        </div>
                    </div>
                </div>

                <div className="flex justify-between items-center pt-3">
                    <SecondaryButton type="button" onClick={close}>
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton type="submit">
                        Publicar
                    </PrimaryButton>
                </div>

            </form>
        </FormModal>
    );
}
