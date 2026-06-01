import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router";

import { useTask } from "../../context/TaskContext";
import TaskCard2 from "../../components/TaskCard2";
import assets from "../../assets";
import "./LoginAccess.css";

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
    event: React.ChangeEvent<HTMLInputElement>
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
              placeholder="Ingrese el titulo de su anuncio"
              {...register("title2")}
              autoFocus
            />
          </div>

          <div>
            <textarea
              rows={3}
              placeholder="Descripción"
              {...register("description2")}
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
        {tasksAdmin2.map((task) => (
          <TaskCard2
            tasks2={task}
            key={task._id}
          />
        ))}
      </div>
    </div>
  );
}

export default UserAnuncios;
