import { useEffect, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

import { useTask } from "../../context/TaskContext";
import TaskCard2 from "../../components/TaskCard2";
import assets from "../../assets";

interface CreateTaskFormData {
  title2: string;
  description2: string;
  image: string;
}

function UserAnuncios() {
  const { register, handleSubmit, setValue } =
    useForm<CreateTaskFormData>();

  const { createTask2, getTaskAdmin2, tasksAdmin2 } =
    useTask();

  const [imageBase64, setImageBase64] =
    useState<string>("");

  const [imageError, setImageError] =
    useState<string>("");

  useEffect(() => {
    getTaskAdmin2();
  }, [getTaskAdmin2]);

  const handleImageChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    const file = event.target.files?.[0];

    if (!file) return;

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!validImageTypes.includes(file.type)) {
      setImageError(
        "Por favor, selecciona un archivo de imagen válido, por ejemplo: JPG, PNG, GIF, WEBP."
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

  const onSubmit = handleSubmit(
    async (data: CreateTaskFormData) => {
      if (imageBase64) {
        const formData: CreateTaskFormData = {
          ...data,
          image: imageBase64,
        };

        await createTask2(formData as never);
      } else {
        setImageError(
          "La imagen no es válida o no se ha seleccionado ninguna."
        );
      }
    }
  );

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <header className="border-b border-white/10 bg-[#111827]/[0.85] backdrop-blur-sm">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={assets.casa} alt="Inicio" className="h-10 w-auto" />
            <span className="text-lg font-semibold text-white">Comunidad DDG</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              to="/user"
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-[#d1d5db] transition hover:bg-white/20"
            >
              Inicio
            </Link>
            <Link
              to="/profile"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
            >
              <img
                src={assets.usuario1}
                alt="Usuario"
                className="h-8 w-8 rounded-full"
              />
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[920px] px-6 py-10">
        <section className="mb-12">
          <h1 className="text-3xl font-bold text-white">Crear anuncio</h1>
          <p className="mt-3 text-sm text-[#cbd5e1]">
            Publica un anuncio para la comunidad con descripción e imagen.
          </p>
        </section>

        <section className="mb-14 rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.4)]">
          <form onSubmit={onSubmit} className="flex flex-col gap-6">
            <input
              type="text"
              placeholder="Ingrese el título de su anuncio"
              {...register("title2")}
              autoFocus
              className="w-full rounded-3xl border border-white/10 bg-[#0f172a] px-5 py-4 text-sm text-white outline-none transition focus:border-[#3ecf8e] focus:ring-2 focus:ring-[#3ecf8e]/20"
            />

            <textarea
              rows={4}
              placeholder="Descripción"
              {...register("description2")}
              className="w-full rounded-3xl border border-white/10 bg-[#0f172a] px-5 py-4 text-sm text-white outline-none transition focus:border-[#3ecf8e] focus:ring-2 focus:ring-[#3ecf8e]/20"
            />

            <label className="flex cursor-pointer items-center justify-between rounded-3xl border border-dashed border-white/30 bg-white/5 px-5 py-4 text-sm text-[#cbd5e1] transition hover:border-[#3ecf8e] hover:text-white">
              <span>{imageBase64 ? "Imagen cargada" : "Selecciona una imagen"}</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>

            {imageError && (
              <p className="text-sm font-medium text-red-400">{imageError}</p>
            )}

            <button
              type="submit"
              className="w-full rounded-full bg-[#3ecf8e] px-6 py-4 text-sm font-semibold text-[#0f172a] transition hover:bg-[#5fd9a6]"
            >
              Publicar anuncio
            </button>
          </form>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-white mb-6">Anuncios recientes</h2>
          <div className="grid gap-6">
            {tasksAdmin2.map((task) => (
              <TaskCard2 tasks2={task} key={task._id} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserAnuncios;
