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

export default function HomeCardContainer({
  cards,
  title = "Bienvenido al Panel",
  subtitle = "Selecciona una de las opciones a continuación para comenzar a gestionar tu comunidad.",
}: HomeCardContainerProps) {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-display font-bold text-white sm:text-5xl">{title}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-sm text-slate-400 sm:text-base">{subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, index) => {
          const isWide = index === 0 || index === 3 || index === 4;
          return <HomeCard key={index} card={card} isWide={isWide} />;
        })}
      </div>
    </section>
  );
}
