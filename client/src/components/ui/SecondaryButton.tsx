import { ButtonHTMLAttributes, useState } from "react";

export default function SecondaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  const [hover, setHover] = useState(false);
  const [active, setActive] = useState(false);

  return (
    <button
      {...props}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => { setHover(false); setActive(false); }}
      onMouseDown={() => setActive(true)}
      onMouseUp={() => setActive(false)}
      style={{
        padding: "12px 24px",
        borderRadius: "8px",
        backgroundColor: hover ? "rgba(255, 255, 255, 0.05)" : "#1c1c1c",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        color: "white",
        fontWeight: "500",
        fontSize: "15px",
        cursor: "pointer",
        transition: "all 0.2s ease",
        transform: active ? "scale(0.97)" : "scale(1)",
      }}
    />
  );
}