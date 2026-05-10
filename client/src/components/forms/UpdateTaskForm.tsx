import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

import { ITaskAnnouncement } from "../../interfaces/ITaskAnnouncement";
import { updateAnnouncement } from "../../services/task.service";

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
  } = useForm<ITaskAnnouncement>({
    defaultValues: {
      title2: task?.title2 ?? "",
      description2: task?.description2 ?? "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (
    data: ITaskAnnouncement
  ) => {

    try {

      await updateAnnouncement(task._id, data);

      Swal.fire({
        text: "Tu anuncio se ha actualizado.",
        icon: "success",
        confirmButtonColor: "#2563eb",
        confirmButtonText: "Aceptar",
        background: "#fefefe",
        color: "#1e293b",
        timer: 2000,
        timerProgressBar: true,
      }).then(() => navigate("/admin"));

    } catch {

      Swal.fire({
        title: "Error",
        text: "No se pudo actualizar el anuncio.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <div className="flex flex-col bg-white p-8 rounded-2xl w-full max-w-2xl border border-[#E5E5E7]">

      <header className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">
          Actualizar Anuncio
        </h2>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >

        <div className="flex flex-col gap-2">

          <label
            htmlFor="title2"
            className="text-sm font-medium text-slate-700"
          >
            Título
          </label>

          <input
            type="text"
            {...register("title2", {
              required: true,
            })}
            className="p-3 border border-[#E5E5E7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
            placeholder="Ingrese el título de su anuncio"
          />

          {errors.title2 && (
            <p className="text-red-500 text-sm">
              El título es requerido
            </p>
          )}

        </div>

        <div className="flex flex-col gap-2">

          <label
            htmlFor="description2"
            className="text-sm font-medium text-slate-700"
          >
            Descripción
          </label>

          <textarea
            {...register("description2")}
            className="p-3 border border-[#E5E5E7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all min-h-[120px]"
            placeholder="Ingrese la descripción de su anuncio"
          />

        </div>

        <div className="flex justify-between gap-4 mt-4">

          <button
            type="button"
            onClick={close}
            className="px-5 py-3 rounded-2xl border border-[#E5E5E7] hover:bg-gray-100 transition-all"
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="px-5 py-3 rounded-2xl bg-slate-800 text-white hover:opacity-90 transition-all"
          >
            Actualizar
          </button>

        </div>
      </form>
    </div>
  );
}