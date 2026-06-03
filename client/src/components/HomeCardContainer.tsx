import HomeCard from "./HomeCard";

interface HomeCardItem {
  text: string;
  image: string;
  callback: () => void;
}

interface HomeCardContainerProps {
  cards: HomeCardItem[];
  title?: string;
  subtitle?: string;
}

function HomeCardContainer({
  cards,
  title = "Bienvenido al Panel",
  subtitle = "Selecciona una de las opciones a continuación para comenzar a gestionar tu comunidad."
}: HomeCardContainerProps) {
  return (
    <div className="bento-wrapper">
      <div className="bento-header">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
      <div className="bento-container">
        {cards.map((i, index) => {
          // Bento logic: make the first item wide, or every 3rd item
          const isWide = index === 0 || index === 3 || index === 4;
          return <HomeCard key={index} card={i} isWide={isWide} />;
        })}
      </div>
    </div>
  );
}

export default HomeCardContainer;