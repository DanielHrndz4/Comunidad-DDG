import { useEffect, useState, type ChangeEvent } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

import { useTask } from "../../context/TaskContext";
import TaskCard from "../../components/TaskCard";
import assets from "../../assets";
import "./LoginAccess.css";
import type { IReport } from "../../interfaces/IReport";

interface UserReportFormData {
  title: string;
  description: string;
  image: string;
}

function UserReport() {
  const { register, handleSubmit, setValue } =
    useForm<UserReportFormData>();

  const { createTask, getTaskAdmin, tasksAdmin } =
    useTask();

  const [imageBase64, setImageBase64] =
    useState<string>("");

  const [imageError, setImageError] =
    useState<string>("");

  useEffect(() => {
    getTaskAdmin();
  }, [getTaskAdmin]);

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
    async (data: UserReportFormData) => {
      if (imageBase64) {
        const formData: UserReportFormData = {
          ...data,
          image: imageBase64,
        };

        await createTask(formData as unknown as IReport);
      } else {
        setImageError(
          "La imagen no es válida o no se ha seleccionado ninguna."
        );
      }
    }
  );

  return (
    <div>
      <div className="header-login-access">
        <nav className="user-home-navbar">
          <div className="user-home-navbar-left">
            <Link to="/" />
          </div>

          <div className="user-home-navbar-right">
            <Link to="/user">
              <img
                src={assets.casa}
                alt="Inicio"
                className="user-home-icono"
              />
            </Link>

            <div className="user-home-dropdown">
              <Link to="/profile">
                <img
                  src={assets.usuario1}
                  alt="Usuario"
                  className="user-home-icono-usuario"
                />
              </Link>
            </div>
          </div>
        </nav>
      </div>

      <br />

      <div className="add-topic">
        <form onSubmit={onSubmit}>
          <div>
            <input
              type="text"
              placeholder="Ingrese el titulo de su reporte"
              {...register("title")}
              autoFocus
            />
          </div>

          <div>
            <textarea
              rows={3}
              placeholder="Descripción"
              {...register("description")}
            />
          </div>

          <div>
            <input
              type="file"
              onChange={handleImageChange}
            />

            {imageError && (
              <p style={{ color: "red" }}>
                {imageError}
              </p>
            )}
          </div>

          <button type="submit">
            Publicar
          </button>
        </form>
      </div>

      <div>
        {tasksAdmin.map((task) => (
          <TaskCard
            task={task}
            key={task._id}
          />
        ))}
      </div>
    </div>
  );
}

export default UserReport;