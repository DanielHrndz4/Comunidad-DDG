import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

import { ITaskAnnouncement } from "../../interfaces/ITaskAnnouncement";
import { updateAnnouncement } from "../../services/task.service";

import FormModal from "../ui/FormModal";
import FormInput from "../ui/FormInput";
import FormTextarea from "../ui/FormTextarea";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";

interface Props {
    task: ITaskAnnouncement & { _id: string };
    close: () => void;
}

export default function UpdateTaskForm({
    task,
    close,
}: Props) {

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm<ITaskAnnouncement>({
        defaultValues: {
            title2: task?.title2 ?? "",
            description2:
                task?.description2 ?? "",
        },
    });

    const navigate = useNavigate();

    const titleValue =
        watch("title2") || "";

    const descriptionValue =
        watch("description2") || "";

    const onSubmit = async (
        data: ITaskAnnouncement
    ) => {

        try {

            await updateAnnouncement(
                task._id,
                data
            );

            Swal.fire({
                text:
                    "Tu anuncio se ha actualizado.",

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
                    "No se pudo actualizar el anuncio.",

                icon: "error",

                confirmButtonColor:
                    "#dc2626",
            });
        }
    };

    return (
        <FormModal title="Actualizar Anuncio">

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="flex flex-col gap-6"
            >

                <FormInput
                    label="Título"
                    placeholder="Ingrese el título de su anuncio"

                    error={
                        errors.title2?.message
                    }

                    success={
                        titleValue.trim().length >= 3
                    }

                    {...register("title2", {
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
                    placeholder="Ingrese la descripción de su anuncio"

                    rows={6}

                    error={
                        errors.description2?.message
                    }

                    success={
                        descriptionValue.trim().length >= 10
                    }

                    {...register("description2")}
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