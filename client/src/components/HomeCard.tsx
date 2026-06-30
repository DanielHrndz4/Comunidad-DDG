interface HomeCardItem {
  text: string;
  image: string;
  callback: () => void;
}

interface HomeCardProps {
  card: HomeCardItem;
  isWide?: boolean;
}

export default function HomeCard({ card: { text, image, callback }, isWide }: HomeCardProps) {
  return (
    <button
      type="button"
      onClick={callback}
      className={`group relative flex h-full flex-col justify-between rounded-[32px] border border-white/10 bg-white/5 p-8 text-left transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-slate-500/20 ${isWide ? 'md:col-span-2' : ''}`}
    >
      <img
        src={image}
        alt={text}
        className="mb-8 h-24 w-auto object-contain transition-transform duration-300 group-hover:-translate-y-1"
      />
      <div className="flex items-end justify-between gap-4">
        <p className="text-xl font-semibold text-white">{text}</p>
        <span className="text-3xl text-slate-300 opacity-0 transition duration-300 group-hover:opacity-100">→</span>
      </div>
    </button>
  );
}
