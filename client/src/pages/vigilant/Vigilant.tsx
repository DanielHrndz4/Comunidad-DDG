import { useNavigate } from "react-router";

import assets from "../../assets";
import HomeCardContainer from "../../components/HomeCardContainer";

interface MenuCardItem {
  text: string;
  image: string;
  callback: () => void;
}

function Vigilant() {
  const navigate = useNavigate();

  const menuCards: MenuCardItem[] = [
    {
      text: "Registro de visitas",
      image: assets.tarjetaDeIdentificacion,
      callback: () => navigate("/visits"),
    },
    {
      text: "Horarios",
      image: assets.calendario,
    },
  ];

  return (
    <div className="flex grow-1 flex-col justify-center items-center p-29 w-full box-border">
      <HomeCardContainer 
        cards={menuCards}
        title="Panel de Vigilancia"
        subtitle="Registra visitas y gestiona los horarios de ingreso de forma segura."
      />
    </div>
  );
}

export default Vigilant;
