import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import { useForm } from "react-hook-form";
import { useTask } from "../../context/TaskContext";
import { useEffect, useState } from "react";
import TaskCard from "../../components/TaskCard.jsx";
import assets from "../../../src/assets";
import "./LoginAccess.css";

function UserReport() {
    // React Hook Form
    const { register, handleSubmit, setValue } = useForm();

    // Contexto de tareas
    const { createTask, getTaskAdmin, tasksAdmin } = useTask();

    // Contexto de autenticación
    const { logout, user } = useAuth();

    // Estado local para manejar la imagen en base64 y errores de imagen
    const [imageBase64, setImageBase64] = useState("");
    const [imageError, setImageError] = useState("");

    // Cargar los reportes existentes cuando el componente se monta
    useEffect(() => {
        getTaskAdmin();
    }, []);

    // Maneja la selección de imágenes
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
            if (!validImageTypes.includes(file.type)) {
                setImageError("Por favor, selecciona un archivo de imagen válido, por ejemplo: JPG, PNG, GIF, WEBP.");
                setImageBase64("");
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64(reader.result); // Guardar la imagen en base64
                setValue("image", reader.result); // Actualizar el valor del formulario
                setImageError(""); // Limpiar cualquier error previo
            };
            reader.readAsDataURL(file);
        }
    };

    // Maneja el envío del formulario
    const onSubmit = handleSubmit((data) => {
        if (imageBase64) {
            const formData = { ...data, image: imageBase64 };
            createTask(formData); // Crear un nuevo reporte
        } else {
            setImageError("La imagen no es válida o no se ha seleccionado ninguna.");
        }
    });

    // Función para recargar la página (no se está usando actualmente)
    const handleReload = () => {
        window.location.reload();
    };

    // Función de ejemplo para manejar menús (no implementada completamente)
    function toggleMenu() {
        setMenuOpen(!menuOpen);
    }

    return (
        <div>
            {/* Navbar superior */}
            <div className="header-login-access">
                <nav className="user-home-navbar">
                    <div className="user-home-navbar-left">
                        <Link></Link>
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

            {/* Formulario para crear un nuevo reporte */}
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
                        ></textarea>
                    </div>
                    <div>
                        <input
                            type="file"
                            onChange={handleImageChange}
                        />
                        {imageError && <p style={{ color: "red" }}>{imageError}</p>}
                    </div>
                    <button type="submit">Publicar</button>
                </form>
            </div>

            {/* Lista de reportes */}
            <div>
                {tasksAdmin.map(task => (
                    <TaskCard task={task} key={task._id} />
                ))}
            </div>
        </div>
    );
}

export default UserReport;
