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
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        setIsSubmitting(true);

        try {
            await createReport({
                ...data,
                image: imageBase64,
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
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <FormModal title="Nuevo Reporte">
            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex w-full max-w-full flex-col gap-4 bg-transparent p-0 shadow-none sm:gap-6"
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
                    <label className="ml-1 mb-1 text-sm font-medium text-[#9ca3af] sm:text-[15px]">
                        Imagen
                    </label>
                    <div className="relative">
                        <input
                            type="file"
                            onChange={handleImageChange}
                            className="w-full cursor-pointer rounded-lg border border-white/10 bg-[#2a2a2a] px-4 py-3 text-sm text-white outline-none transition focus:border-[#3ecf8e] focus:ring-2 focus:ring-[#3ecf8e]/20"
                        />
                    </div>
                    <FormError message={imageError} />

                </div>
                <div className="flex flex-col-reverse items-stretch gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                    <SecondaryButton
                        type="button"
                        onClick={close}
                        disabled={isSubmitting}
                    >
                        Cancelar
                    </SecondaryButton>
                    <PrimaryButton type="submit" loading={isSubmitting}>
                        {isSubmitting ? "Publicando..." : "Publicar"}
                    </PrimaryButton>

                </div>

            </form>

        </FormModal>
    );
}