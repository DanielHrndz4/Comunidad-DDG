import HomeCard from "./HomeCard";

interface HomeCardItem {
  text: string;
  image: string;
  callback: () => void;
}

interface HomeCardContainerProps {
  cards: HomeCardItem[];
}

function HomeCardContainer({
  cards,
}: HomeCardContainerProps) {
  return (
    <div className="flex justify-center items-center gap-60 flex-wrap w-full max-w-900 mt-40">
      {cards.map((i, index) => (
        <HomeCard key={index} card={i} />
      ))}
    </div>
  );
}

export default HomeCardContainer;