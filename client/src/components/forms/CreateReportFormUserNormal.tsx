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
        }
    };

    return (
        <FormModal title="Nuevo Reporte">
            <form
                onSubmit={handleSubmit(onSubmit)}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "24px",
                    background: "transparent",
                    boxShadow: "none",
                    padding: 0,
                    margin: 0,
                    width: "100%",
                    maxWidth: "100%"
                }}
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
                        style={{
                            fontSize: "14px",
                            fontWeight: "500",
                            color: "#9ca3af",
                            marginLeft: "4px",
                            marginBottom: "2px"
                        }}
                    >
                        Imagen
                    </label>
                    <div style={{ position: "relative" }}>
                        <input
                            type="file"
                            onChange={handleImageChange}
                            style={{
                                width: "100%",
                                backgroundColor: "#2a2a2a",
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "8px",
                                padding: "12px 16px",
                                color: "white",
                                outline: "none",
                                fontSize: "15px",
                                cursor: "pointer",
                                boxSizing: "border-box"
                            }}
                        />
                    </div>
                    <FormError message={imageError} />

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
                    <PrimaryButton type="submit">
                        Publicar
                    </PrimaryButton>

                </div>

            </form>

        </FormModal>
    );
}