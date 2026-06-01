import assets from "../assets";

interface CreateButtonProps {
  text: string;
}

export default function CreateButton({
  text,
}: CreateButtonProps) {
  return (
    <div className="add-schedule">
      <span>{text}</span>

      <img
        src={assets.agregar}
        alt="Agregar horario"
        className="add-icon"
      />
    </div>
  );
}