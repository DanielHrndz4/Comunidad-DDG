import { useState } from "react";
import { useNavigate } from "react-router";
import Popup from "reactjs-popup";

import assets from "../../assets";
import HomeCardContainer from "../../components/HomeCardContainer";
import PayVigilanceForUserNormal from "../../components/forms/PayVigilanceFormUserNormal";

interface MenuCardItem {
  text: string;
  image: string;
  callback: () => void;
}

function UserHome() {
  const navigate = useNavigate();

  const [paying, openPay] =
    useState<boolean>(false);

  const closePopup = (): void => openPay(false);

  const menuCards: MenuCardItem[] = [
    {
      text: "Reportes",
      image: assets.formularioDeLlenado,
      callback: () => navigate("/userReport"),
    },
    {
      text: "Anuncios",
      image: assets.nota,
      callback: () => navigate("/userAnuncios"),
    },
    {
      text: "Gestión de pagos",
      image: assets.dinero,
      callback: () => openPay(true),
    },
    {
      text: "Lista de usuarios",
      image: assets.tarjetaDeIdentificacion,
      callback: () => navigate("/allUsers"),
    },
  ];

  return (
    <div className="flex grow-1 flex-col justify-center items-center p-29 w-full box-border">
      <HomeCardContainer cards={menuCards} />

      <Popup
        open={paying}
        onClose={closePopup}
        lockScroll={true}
        position="top center"
        closeOnDocumentClick={false}
        modal={true}
        overlayStyle={{ background: "rgba(0,0,0,0.5)" }}
        contentStyle={{ maxHeight: "95%", overflow: "auto" }}
      >
        <PayVigilanceForUserNormal close={closePopup} />
      </Popup>
    </div>
  );
}

export default UserHome;