interface HomeCardItem {
  text: string;
  image: string;
  callback: () => void;
}

interface HomeCardProps {
  card: HomeCardItem;
  isWide?: boolean;
}

function HomeCard({
  card: { text, image, callback },
  isWide
}: HomeCardProps) {
  return (
    <div
      className={`bento-item ${isWide ? 'bento-wide' : ''}`}
      onClick={callback}
    >
      <img
        className="bento-image"
        src={image}
        alt={text}
      />
      <div className="bento-content">
        <p className="bento-title">
          {text}
        </p>
        <span className="bento-arrow">→</span>
      </div>
    </div>
  );
}

export default HomeCard;