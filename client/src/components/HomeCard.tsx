interface HomeCardItem {
  text: string;
  image: string;
  callback: () => void;
}

interface HomeCardProps {
  card: HomeCardItem;
}

function HomeCard({
  card: { text, image, callback },
}: HomeCardProps) {
  return (
    <div
      className="bg-custom-gray p-20 rounded-[10px] w-240 h-240 flex flex-col justify-center
      items-center text-center duration-300 ease-in-out cursor-pointer shadow-md
      hover:-translate-y-10 hover:bg-hover-gray hover:shadow-lg"
      onClick={callback}
    >
      <img
        className="h-120 mb-10"
        src={image}
        alt={text}
      />

      <p className="text-custom-slate font-bold m-0">
        {text}
      </p>
    </div>
  );
}

export default HomeCard;