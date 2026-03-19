// Importa hook de autenticación para acceder a la información del usuario.
import { useAuth } from "../../context/AuthContext";

// Importa recursos de imágenes locales.
import assets from "../../../src/assets";

// Importa formulario para actualizar la información del administrador.
import UpdateAdminForm from "../../components/forms/UpdateAdminForm";

// Importa Popup para mostrar formularios modales.
import Popup from "reactjs-popup";

// Componente de la página de perfil del administrador.
export default function AdminProfile() {

    // Obtiene los datos del usuario autenticado desde el contexto AuthContext.
    const { user } = useAuth();

    return (
        // Contenedor principal del perfil con flexbox centrado y padding.
        <main className="flex grow-1 justify-center items-center p-16">

            {/* Contenedor horizontal para la imagen y datos del perfil */}
            <div className="flex flex-row gap-32 w-9/10 max-w-1200 items-start">

                {/* Sección izquierda: imagen, título y botón de editar */}
                <div className="flex grow-1 text-center flex-col items-center gap-24">
                    
                    {/* Imagen de perfil del administrador */}
                    <img src={assets.usuario1} alt="Usuario" className="profile-pic" />

                    {/* Título y descripción */}
                    <h2 className="text-[2rem] my-8 mx-0 text-dark-slate">Administrador</h2>
                    <p className="text-[1.2rem] my-8 ml-0 text-light-gray">Administrador general de ésta organización</p>

                    {/* Botón que abre un popup para editar perfil */}
                    <Popup 
                        trigger={
                            <button className="bg-light-slate text-white py-12 px-24 rounded-md text-[1rem]
                            duration-300 ease-in-out shadow-md hover:bg-dark-slate">Editar Perfil</button>
                        } 
                        lockScroll={true}
                        position="top center" 
                        closeOnDocumentClick={false} 
                        modal={true} 
                        overlayStyle={{ background: 'rgba(0,0,0,0.5)' }}
                        contentStyle={{ maxHeight: '95%', overflow: 'auto' }}
                    >
                        {/* Formulario de actualización del administrador, recibe función para cerrar popup */}
                        {close => <UpdateAdminForm user={user} close={close} />}
                    </Popup>
                </div>

                {/* Sección derecha: información detallada del administrador */}
                <div className="flex grow-1 text-center flex-col items-center gap-24">
                    <div className="bg-bright-gary p-24 rounded-lg shadow-lg w-full text-left text-[1rem]">
                        
                        {/* Nombre */}
                        <h3 className="mb-16 text-dark-slate text-[1.2rem]">Nombre:</h3>
                        <p className="my-8 text-dark-gray">{user.name}</p>

                        {/* Email */}
                        <h3 className="mb-16 text-dark-slate text-[1.2rem]">Email:</h3>
                        <p className="my-8 text-dark-gray">{user.email}</p>

                        {/* Edad */}
                        <h3 className="mb-16 text-dark-slate text-[1.2rem]">Edad:</h3>
                        <p className="my-8 text-dark-gray">{user.age}</p>

                        {/* Contacto */}
                        <h3 className="mb-16 text-dark-slate text-[1.2rem]">Contacto</h3>
                        <p className="my-8 text-dark-gray">{user.telephone}</p>
                    </div>
                </div>
            </div>
        </main>
    )
};
