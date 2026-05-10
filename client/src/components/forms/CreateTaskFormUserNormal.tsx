import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useState } from "react";
import Swal from "sweetalert2";

import { ITaskAnnouncement } from "../../interfaces/ITaskAnnouncement";
import { createAnnouncement } from "../../services/task.service";

interface Props {
  close: () => void;
}

export default function CreateTaskFormUserNormal({ close }: Props) {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ITaskAnnouncement>();

  const [imageBase64, setImageBase64] = useState<string>("");
  const [imageError, setImageError] = useState<string>("");

  const navigate = useNavigate();

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

  const onSubmit = async (data: ITaskAnnouncement) => {
    if (!imageBase64) {
      setImageError("Debes seleccionar una imagen");
      return;
    }

    try {
      await createAnnouncement({
        ...data,
        image: imageBase64,
      });

      Swal.fire({
        title: "¡Anuncio creado!",
        icon: "success",
        timer: 2000,
      });

      navigate("/user");
    } catch {
      Swal.fire({
        title: "Error",
        text: "No se pudo crear el anuncio",
        icon: "error",
      });
    }
  };

  return (
    <div className="flex flex-col bg-white p-8 rounded-2xl w-full max-w-lg border border-[#E5E5E7]">
      <h2 className="text-xl font-semibold mb-6">
        Creación de Anuncio
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <div>
          <label>Título</label>

          <input
            {...register("title2", { required: true })}
            className="w-full border border-[#E5E5E7] rounded-xl p-3 focus:ring-2 focus:ring-gray-300"
            placeholder="Ingrese el titulo de su anuncio"
          />

          {errors.title2 && (
            <p className="text-red-500 text-sm">
              El título es requerido
            </p>
          )}
        </div>

        <div>
          <label>Descripción</label>

          <textarea
            {...register("description2")}
            className="w-full border border-[#E5E5E7] rounded-xl p-3"
            placeholder="Ingrese la descripción de su anuncio"
          />
        </div>

        <div>
          <label>Imagen</label>

          <input
            type="file"
            onChange={handleImageChange}
          />

          {imageError && (
            <p className="text-red-500 text-sm">
              {imageError}
            </p>
          )}
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="button"
            onClick={close}
          >
            Cancelar
          </button>

          <button type="submit">
            Publicar
          </button>
        </div>
      </form>
    </div>
  );
}