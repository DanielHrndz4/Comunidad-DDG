import { useState } from "react";
import Popup from "reactjs-popup";

import { useAuth } from "../../context/AuthContext";
import assets from "../../assets";
import UpdateVigilantForm from "../../components/forms/UpdateVigilantForm";

export default function ProfileVigilant() {
  const { user } = useAuth();

  const [isOpen, setIsOpen] =
    useState<boolean>(false);

  const openPopup = (): void => setIsOpen(true);
  const closePopup = (): void => setIsOpen(false);

  if (!user) {
    return (
      <main className="flex grow-1 justify-center items-center p-16">
        <p>Cargando perfil...</p>
      </main>
    );
  }

  return (
    <main className="flex grow-1 justify-center items-center p-16">
      <div className="flex flex-row gap-32 w-9/10 max-w-1200 items-start">
        <div className="flex grow-1 text-center flex-col items-center gap-24">
          <img
            src={assets.usuario1}
            alt="Usuario"
            className="profile-pic"
          />

          <h2 className="text-[2rem] my-8 mx-0 text-dark-slate">
            Vigilante
          </h2>

          <p className="text-[1.2rem] my-8 ml-0 text-light-gray">
            Perfil del usuario vigilante
          </p>

          <button
            className="bg-light-slate text-white py-12 px-24 rounded-md text-[1rem]
            duration-300 ease-in-out shadow-md hover:bg-dark-slate"
            onClick={openPopup}
          >
            Editar Perfil
          </button>

          <Popup
            open={isOpen}
            onClose={closePopup}
            lockScroll={true}
            position="top center"
            closeOnDocumentClick={false}
            modal={true}
            overlayStyle={{
              background: "rgba(0,0,0,0.5)",
            }}
            contentStyle={{
              maxHeight: "95%",
              overflow: "auto",
            }}
          >
            <UpdateVigilantForm
              user={user}
              close={closePopup}
            />
          </Popup>
        </div>

        <div className="flex grow-1 text-center flex-col items-center gap-24">
          <div className="bg-bright-gary p-24 rounded-lg shadow-lg w-full text-left text-[1rem]">
            <h3 className="mb-16 text-dark-slate text-[1.2rem]">
              Nombre:
            </h3>
            <p className="my-8 text-dark-gray">
              {user.name}
            </p>

            <h3 className="mb-16 text-dark-slate text-[1.2rem]">
              Email:
            </h3>
            <p className="my-8 text-dark-gray">
              {user.email}
            </p>

            <h3 className="mb-16 text-dark-slate text-[1.2rem]">
              Edad:
            </h3>
            <p className="my-8 text-dark-gray">
              {user.age}
            </p>

            <h3 className="mb-16 text-dark-slate text-[1.2rem]">
              Contacto
            </h3>
            <p className="my-8 text-dark-gray">
              {user.telephone}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}