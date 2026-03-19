import { Link, useNavigate } from "react-router";
import assets from "../assets";
import Popup from "reactjs-popup";
import { useAuth } from "../context/AuthContext";

export default function NavBarVigilant() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    return (

        <nav className="bg-custom-brown flex justify-between items-center py-16 px-32 w-full box-border">
            <div className="flex items-center gap-10">
                <Link to="/vigilant">
                    <img
                        src={assets.casa}
                        alt="Inicio"
                        className="h-45 cursor-pointer"
                    />
                </Link>
            </div>
            <div className="flex items-center gap-20">

                <div className="flex items-center gap-5">

                </div>
                <Popup
                    trigger={
                        <button type="button" className="button">
                            <img
                                src={assets.usuario1}
                                alt="Usuario"
                                className="h-45 cursor-pointer"
                            />
                        </button>
                    }
                    position="bottom center" closeOnDocumentClick arrow={false}
                    keepTooltipInside=".tooltipBoundary">
                    <div className="flex flex-col gap-8 bg-custom-brown border border-white rounded-md p-16 w-210">
                        <button className="flex justify-between items-center g-10 bg-none border-none cursor-pointer text-[1rem] text-left
                        py-8 px-10 rounded-xl duration-300 ease-in-out text-white hover:bg-dark-slate" onClick={() => { navigate("/profileVigilant") }}>

                            <p style={{color: "white"}}>Ver Perfil </p><img className="h-20 w-20" src={assets.girar} alt="Ver Perfil" />
                        </button>
                        <button className="flex justify-between items-center g-10 bg-none border-none cursor-pointer text-[1rem] text-left
                        py-8 px-10 rounded-xl duration-300 ease-in-out text-white hover:bg-dark-slate" onClick={() => { logout() }} >
                            <p style={{color: "white"}}>Cerrar sesión</p>
                            <img className="h-20 w-20" src={assets.cerrarSesion} alt="Cerrar sesión" />
                        </button>
                    </div>
                </Popup>

            </div>
        </nav>

    );
}
