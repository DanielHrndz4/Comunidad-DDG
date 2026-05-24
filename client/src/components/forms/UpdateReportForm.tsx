import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

import { IReport } from "../../interfaces/IReport";
import { updateReport } from "../../services/report.service";

import FormModal from "../ui/FormModal";
import FormInput from "../ui/FormInput";
import FormTextarea from "../ui/FormTextarea";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";

interface Props {
    report: IReport & { _id: string };
    close: () => void;
}

export default function UpdateReportForm({
    report,
    close,
}: Props) {

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<IReport>({
        defaultValues: {
            title: report?.title ?? "",
            description: report?.description ?? "",
        },
    });

    const navigate = useNavigate();

    const titleValue =
        watch("title") || "";

    const descriptionValue =
        watch("description") || "";

    const onSubmit = async (
        data: IReport
    ) => {

        try {

            await updateReport(
                report._id,
                data
            );

            Swal.fire({
                text:
                    "Tu publicación se ha actualizado.",

                icon: "success",

                confirmButtonColor:
                    "#2563eb",

                confirmButtonText:
                    "Aceptar",

                background: "#fefefe",

                color: "#1e293b",

                timer: 2000,

                timerProgressBar: true,
            }).then(() =>
                navigate("/admin")
            );

        } catch {

            Swal.fire({
                title: "Error",

                text:
                    "No se pudo actualizar la publicación.",

                icon: "error",

                confirmButtonColor:
                    "#dc2626",
            });
        }
    };

    return (
        <FormModal title="Actualizar Reporte">

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
            >

                <FormInput
                    label="Título"
                    placeholder="Ingrese el título de su reporte"

                    error={
                        errors.title?.message
                    }

                    success={
                        titleValue.trim().length >= 3
                    }

                    {...register("title", {
                        required:
                            "El título es requerido",

                        minLength: {
                            value: 3,

                            message:
                                "Mínimo 3 caracteres",
                        },
                    })}
                />

                <FormTextarea
                    label="Descripción"
                    placeholder="Ingrese la descripción de su reporte"

                    rows={6}

                    error={
                        errors.description?.message
                    }

                    success={
                        descriptionValue.trim().length >= 10
                    }

                    {...register("description")}
                />

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
                        Actualizar
                    </PrimaryButton>

                </div>

            </form>

        </FormModal>
    );
}