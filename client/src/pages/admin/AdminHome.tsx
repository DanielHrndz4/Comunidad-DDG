import { useState } from "react";
import { useNavigate } from "react-router";
import Popup from "reactjs-popup";

import assets from "../../assets";
import HomeCardContainer from "../../components/HomeCardContainer";
import PayVigilanceForm from "../../components/forms/PayVigilanceForm";

interface MenuCardItem {
  text: string;
  image: string;
  callback: () => void;
}

export default function AdminHome() {
  const navigate = useNavigate();

  const [paying, openPay] =
    useState<boolean>(false);

  const closePopup = (): void => openPay(false);

  const menuCards: MenuCardItem[] = [
    {
      text: "Reportes",
      image: assets.formularioDeLlenado,
      callback: () => navigate("/admin/reports"),
    },
    {
      text: "Anuncios",
      image: assets.nota,
      callback: () => navigate("/admin/tasks"),
    },
    {
      text: "Gestión de pagos",
      image: assets.dinero,
      callback: () => openPay(true),
    },
    {
      text: "Gestión de usuarios",
      image: assets.tarjetaDeIdentificacion,
      callback: () => navigate("/admin/users"),
    },
  ];

  return (
    <div className="flex grow-1 flex-col justify-center items-center p-29 w-full box-border">
      <HomeCardContainer 
        cards={menuCards}
        title="Panel de Administración"
        subtitle="Control total sobre los reportes, anuncios, usuarios y pagos."
      />

      <Popup
        open={paying}
        onClose={closePopup}
        lockScroll={true}
        position="top center"
        closeOnDocumentClick={false}
        modal={true}
        overlayClassName="bg-black/50"
        contentClassName="max-h-[95vh] overflow-auto"
      >
        <PayVigilanceForm close={closePopup} />
      </Popup>
    </div>
  );
}