import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router";
import UserCard from "../../components/UserCard.jsx";
import assets from "../../../src/assets";
import "./User.css";

export default function Users() {
    // Contexto de autenticación
    const { user, users, getAllUsers, logout } = useAuth();

    // Estado local para el menú desplegable
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const navigate = useNavigate();

    // Cargar todos los usuarios cuando el componente se monta
    useEffect(() => {
        getAllUsers();
    }, []);

    // Alternar visibilidad del menú
    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev);
    };

    // Navegar al perfil del usuario actual
    const goToProfile = () => {
        navigate("/profile");
    };

    // Cerrar sesión y redirigir a la página de inicio
    const handleLogout = () => {
        logout();
        navigate("/");
    };

    // Navegar a la página principal del usuario
    const handleNavigateToUser = () => {
        navigate("/user");
    };

    return (
        <div>
            {/* Navbar superior */}
            <div>
                <nav className="user-home-navbar">
                    <div className="user-home-navbar-left">
                        <Link></Link>
                    </div>
                    <div className="user-home-navbar-right">
                        {/* Botón de inicio */}
                        <Link to="/user">
                            <img
                                src={assets.casa}
                                alt="Inicio"
                                className="user-home-icono"
                            />
                        </Link>

                        {/* Menú de usuario */}
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

            {/* Encabezado de la lista de usuarios */}
            <div className="admin-header">
                <h2 className="font-sans text-[1.75rem] font-bold text-white m-0 text-center">
                    Lista de usuarios
                </h2>
            </div>

            {/* Contenedor de tarjetas de usuarios */}
            <div className="admin-users-container">
                {users.map(userObject => (
                    <UserCard usr={userObject} key={userObject.id} />
                ))}
            </div>
        </div>
    );
};
