import { useEffect } from "react";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";

import { useAuth } from "../../context/AuthContext";
import type { IUser } from "../../interfaces/IUser";
import FormModal from "../ui/FormModal";
import FormInput from "../ui/FormInput";
import PrimaryButton from "../ui/PrimaryButton";
import SecondaryButton from "../ui/SecondaryButton";

interface Props {
    user: IUser & { id?: string };
    close: () => void;
}

export default function UpdateUserNormalForm({ user, close }: Props) {
    const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<IUser>({
        defaultValues: { ...(user ?? {}), password: "" },
    });
    const { updateProfile } = useAuth();

    useEffect(() => {
        if (user) reset({ ...user, password: "" });
    }, [user, reset]);

    const onSubmit = async (data: IUser) => {
        const payload: Partial<IUser> = { ...data };
        if (!payload.password || payload.password.trim() === "") delete payload.password;
        const userId = user?.id ?? (user as any)?._id;
        if (!userId) { Swal.fire({ title: "Error", text: "No se encontró el ID del usuario.", icon: "error", confirmButtonColor: "#2dbda1" }); return; }
        try {
            await updateProfile(userId, payload);
            await Swal.fire({ title: "¡Actualizado!", text: "Datos guardados correctamente.", icon: "success", timer: 2000, showConfirmButton: false });
            close();
        } catch {
            Swal.fire({ title: "Error", text: "No se pudo actualizar el perfil.", icon: "error", confirmButtonColor: "#2dbda1" });
        }
    };

    const v = watch();

    return (
        <FormModal title="Editar Perfil" subtitle="Vecino" accentColor="#2dbda1" onClose={close}>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "14px" }}>
                    <FormInput label="Nombre" placeholder="Tu nombre" error={errors.name?.message as string}
                        success={v.name?.trim().length >= 3}
                        {...register("name", { required: "Requerido", minLength: { value: 3, message: "Mín. 3 caracteres" } })} />

                    <FormInput label="Username" placeholder="usuario123" error={errors.username?.message as string}
                        success={v.username?.trim().length >= 3}
                        {...register("username", { required: "Requerido", minLength: { value: 3, message: "Mín. 3 caracteres" } })} />
                </div>

                <div style={{ marginBottom: "14px" }}>
                    <FormInput type="email" label="Email" placeholder="ejemplo@gmail.com" error={errors.email?.message as string}
                        success={v.email?.includes("@")}
                        {...register("email", { required: "Requerido" })} />
                </div>

                <div style={{ marginBottom: "14px" }}>
                    <FormInput type="password" label="Nueva contraseña (opcional)" placeholder="Dejar vacío para no cambiar"
                        error={errors.password?.message as string}
                        success={(v.password?.length ?? 0) >= 8}
                        {...register("password", { minLength: { value: 8, message: "Mín. 8 caracteres" } })} />
                </div>

                <div style={{ marginBottom: "22px" }}>
                    <FormInput label="Teléfono" placeholder="12345678" maxLength={8}
                        error={errors.telephone?.message as string}
                        success={v.telephone?.trim().length === 8}
                        {...register("telephone", { required: "Requerido", pattern: { value: /^[0-9]{8}$/, message: "8 dígitos exactos" } })} />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
                    <SecondaryButton type="button" onClick={close}>Cancelar</SecondaryButton>
                    <PrimaryButton type="submit">Guardar cambios</PrimaryButton>
                </div>
            </form>
        </FormModal>
    );
}
