import { useEffect } from "react";
import { Link } from "react-router";

import { useAuth } from "../../context/AuthContext";
import UserCard from "../../components/UserCard";
import assets from "../../assets";
import "./User.css";

export default function Users() {
  const { users, getAllUsers } = useAuth();

  useEffect(() => {
    getAllUsers();
  }, [getAllUsers]);

  return (
    <div>
      <div>
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

      <div className="admin-header">
        <h2 className="font-sans text-[1.75rem] font-bold text-white m-0 text-center">
          Lista de usuarios
        </h2>
      </div>

      <div className="admin-users-container">
        {users.map((userObject) => (
          <UserCard
            usr={userObject}
            key={userObject._id}
          />
        ))}
      </div>
    </div>
  );
}