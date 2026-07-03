import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";
import Swal from "sweetalert2";

import { IReport } from "../../interfaces/IReport";
import { createReport } from "../../services/report.service";
import { useGeolocation } from "../../hooks/useGeolocation";

import FormModal from "../ui/FormModal";
import FormInput from "../ui/FormInput";
import FormTextarea from "../ui/FormTextarea";
import FormError from "../ui/FormError";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";

interface Props {
    close: () => void;
}

export default function CreateReportFormUserNormal({
    close,
}: Props) {

    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        watch,
    } = useForm<IReport>();

    const [imageBase64, setImageBase64] =
        useState<string>("");

    const [imageError, setImageError] =
        useState<string>("");

    const {
        status: geoStatus,
        point: geoPoint,
        errorMessage: geoError,
        getLocation,
    } = useGeolocation();

    const navigate = useNavigate();

    const titleValue = watch("title") || "";
    const descriptionValue =
        watch("description") || "";

    const handleImageChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {

        const file = event.target.files?.[0];

        if (!file) return;

        const validTypes = [
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
        ];

        if (!validTypes.includes(file.type)) {

            setImageError(
                "Formato inválido (JPG, PNG, GIF, WEBP)"
            );

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
            setImageError(
                "Debes seleccionar una imagen"
            );
            return;
        }

        if (geoStatus !== "success" || !geoPoint) {
            Swal.fire({
                title: "Ubicación requerida",
                text: "Debes obtener tu ubicación antes de publicar el reporte",
                icon: "warning",
            });
            return;
        }

        try {
            await createReport({
                ...data,
                image: imageBase64,
                location: geoPoint,
            });
            Swal.fire({
                title: "¡Publicación creada!",
                icon: "success",
                timer: 2000,
                showConfirmButton: false,
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
        <FormModal title="Nuevo Reporte">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
            >
                <FormInput
                    label="Título"
                    placeholder="Ingrese el título del reporte"
                    error={errors.title?.message}
                    success={titleValue.trim().length >= 5}
                    {...register("title", {
                        required: "El título es requerido",
                        minLength: {
                            value: 5,
                            message: "Mínimo 5 caracteres",
                        },
                    })}
                />
                <FormTextarea
                    label="Descripción"
                    placeholder="Ingrese una descripción"
                    maxLength={300}
                    error={errors.description?.message}
                    success={
                        descriptionValue.trim().length >= 10
                    }
                    {...register("description", {
                        required:
                            "La descripción es requerida",
                        minLength: {
                            value: 10,
                            message:
                                "Mínimo 10 caracteres",
                        },
                    })}
                />
                <div className="flex flex-col gap-2">
                    <label
                        className="
                            text-[0.88rem]
                            font-medium
                            text-[#6E6E73]
                            ml-1
                        "
                    >
                        Imagen
                    </label>
                    <input
                        type="file"
                        onChange={handleImageChange}
                        className="
                            w-full
                            bg-[#F5F5F7]
                            border
                            border-[#D2D2D7]
                            rounded-[20px]
                            px-4
                            py-3
                            text-[0.95rem]
                            text-[#1D1D1F]
                            transition-all
                            duration-200

                            file:mr-4
                            file:px-4
                            file:py-2
                            file:border-0
                            file:rounded-full
                            file:bg-[#0071E3]
                            file:text-white
                            file:cursor-pointer
                            hover:file:brightness-110
                        "
                    />
                    <FormError message={imageError} />

                </div>

                <div className="flex flex-col gap-2">
                    <label
                        className="
                            text-[0.88rem]
                            font-medium
                            text-[#6E6E73]
                            ml-1
                        "
                    >
                        Ubicación
                    </label>

                    {geoStatus === "loading" && (
                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                bg-[#F5F5F7]
                                border
                                border-[#D2D2D7]
                                rounded-[20px]
                                px-4
                                py-3
                                text-[0.9rem]
                                text-[#6E6E73]
                            "
                        >
                            <span
                                className="
                                    w-4
                                    h-4
                                    rounded-full
                                    border-2
                                    border-[#D2D2D7]
                                    border-t-[#0071E3]
                                    animate-spin
                                "
                            />
                            Obteniendo tu ubicación...
                        </div>
                    )}

                    {geoStatus === "success" && geoPoint && (
                        <div
                            className="
                                flex
                                items-center
                                justify-between
                                gap-2
                                bg-[#F5FFF8]
                                border
                                border-[#34C759]
                                rounded-[20px]
                                px-4
                                py-3
                                text-[0.9rem]
                                text-[#1D1D1F]
                            "
                        >
                            <span>
                                ✓ Ubicación obtenida ({geoPoint.coordinates[1]}, {geoPoint.coordinates[0]})
                            </span>
                            <button
                                type="button"
                                onClick={getLocation}
                                className="
                                    text-[0.8rem]
                                    px-3
                                    py-1
                                    rounded-full
                                    bg-white
                                    border
                                    border-[#D2D2D7]
                                    text-[#1D1D1F]
                                    cursor-pointer
                                    hover:bg-[#EBEBED]
                                "
                            >
                                Actualizar
                            </button>
                        </div>
                    )}

                    {geoStatus === "error" && (
                        <div
                            className="
                                flex
                                flex-col
                                gap-2
                                bg-[#FFF5F5]
                                border
                                border-[#FF3B30]
                                rounded-[20px]
                                px-4
                                py-3
                            "
                        >
                            <FormError message={geoError ?? "No se pudo obtener tu ubicación"} />
                            <button
                                type="button"
                                onClick={getLocation}
                                className="
                                    self-start
                                    text-[0.8rem]
                                    px-3
                                    py-1
                                    rounded-full
                                    bg-[#FF3B30]
                                    text-white
                                    cursor-pointer
                                    hover:brightness-90
                                "
                            >
                                Reintentar
                            </button>
                        </div>
                    )}
                </div>

                <div
                    className="
                        flex
                        justify-between
                        items-center
                        pt-3
                    "
                >
                    <SecondaryButton
                        type="button"
                        onClick={close}
                    >
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton
                        type="submit"
                        disabled={geoStatus !== "success" || !geoPoint}
                    >
                        Publicar
                    </PrimaryButton>

                </div>

            </form>

        </FormModal>
    );
}