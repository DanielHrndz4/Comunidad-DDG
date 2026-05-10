import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";

import { IReport } from "../../interfaces/IReport";
import { updateReport } from "../../services/report.service";

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
  } = useForm<IReport>({
    defaultValues: {
      title: report?.title ?? "",
      description: report?.description ?? "",
    },
  });

  const navigate = useNavigate();

  const onSubmit = async (data: IReport) => {
    try {

      await updateReport(report._id, data);

      Swal.fire({
        text: "Tu publicación se ha actualizado.",
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
        text: "No se pudo actualizar la publicación.",
        icon: "error",
        confirmButtonColor: "#dc2626",
      });
    }
  };

  return (
    <div className="flex flex-col bg-white p-8 rounded-2xl w-full max-w-2xl border border-[#E5E5E7]">

      <header className="mb-6">
        <h2 className="text-2xl font-semibold text-slate-800">
          Actualizar Reporte
        </h2>
      </header>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >

        <div className="flex flex-col gap-2">

          <label
            htmlFor="title"
            className="text-sm font-medium text-slate-700"
          >
            Título
          </label>

          <input
            type="text"
            {...register("title", {
              required: true,
            })}
            className="p-3 border border-[#E5E5E7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all"
            placeholder="Ingrese el título de su reporte"
          />

          {errors.title && (
            <p className="text-red-500 text-sm">
              El título es requerido
            </p>
          )}

        </div>

        <div className="flex flex-col gap-2">

          <label
            htmlFor="description"
            className="text-sm font-medium text-slate-700"
          >
            Descripción
          </label>

          <textarea
            {...register("description")}
            className="p-3 border border-[#E5E5E7] rounded-2xl focus:outline-none focus:ring-2 focus:ring-slate-300 transition-all min-h-[120px]"
            placeholder="Ingrese la descripción de su reporte"
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