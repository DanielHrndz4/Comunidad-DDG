import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { useTask } from "../../context/TaskContext";
import { useEffect, useState } from "react";
import TaskCard2 from "../../components/TaskCard2.jsx";
import assets from "../../../src/assets";
import "./LoginAccess.css";

function UserAnuncios() {
    // Hook de React Hook Form
    const { register, handleSubmit, setValue } = useForm();

    // Contexto para manejar tareas
    const { createTask2, getTaskAdmin2, tasksAdmin2 } = useTask();

    // Estado local para la imagen en base64 y errores de imagen
    const [imageBase64, setImageBase64] = useState("");
    const [imageError, setImageError] = useState(""); 

    // Cargar los anuncios al montar el componente
    useEffect(() => {
        getTaskAdmin2();
    }, []);

    // Función para manejar la selección de imágenes
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Validar tipos de imagen permitidos
            const validImageTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
            if (!validImageTypes.includes(file.type)) {
                setImageError("Por favor, selecciona un archivo de imagen válido, por ejemplo: JPG, PNG, GIF, WEBP.");
                setImageBase64(""); 
                return;
            }

            // Convertir la imagen a base64 para previsualización y envío
            const reader = new FileReader();
            reader.onloadend = () => {
                setImageBase64(reader.result); 
                setValue("image", reader.result);
                setImageError(""); 
            };
            reader.readAsDataURL(file); 
        }
    };

    // Función para enviar el formulario
    const onSubmit = handleSubmit((data) => {
        if (imageBase64) {
            const formData = { ...data, image: imageBase64 }; 
            createTask2(formData);
        } else {
            setImageError("La imagen no es válida o no se ha seleccionado ninguna.");
        }
    });

    // Función para recargar la página
    const handleReload = () => {
        window.location.reload();
    };

    // Función de ejemplo para abrir/cerrar menú (no usada en este fragmento)
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

            {/* Formulario para crear un anuncio */}
            <div className="add-topic">
                <form onSubmit={onSubmit}>
                    {/* Título del anuncio */}
                    <div>
                        <input
                            type="text"
                            placeholder="Ingrese el titulo de su anuncio"
                            {...register("title2")}
                            autoFocus
                        />
                    </div>

                    {/* Descripción del anuncio */}
                    <div>
                        <textarea
                            rows={3}
                            placeholder="Descripción"
                            {...register("description2")}
                        ></textarea>
                    </div>

                    {/* Selección de imagen */}
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

            {/* Mostrar la lista de anuncios */}
            <div>
                {tasksAdmin2.map(tasks => (
                    <TaskCard2 tasks2={tasks} key={tasks._id} />
                ))}
            </div>
        </div>
    );
}

export default UserAnuncios;
