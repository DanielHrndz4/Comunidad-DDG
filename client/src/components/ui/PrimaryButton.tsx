import { ButtonHTMLAttributes, useState } from "react";

export default function PrimaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
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
        backgroundColor: props.disabled ? "rgba(62, 207, 142, 0.4)" : "#3ecf8e",
        color: "#050505",
        fontWeight: "600",
        fontSize: "15px",
        border: "none",
        cursor: props.disabled ? "not-allowed" : "pointer",
        transition: "all 0.2s ease",
        transform: active && !props.disabled ? "scale(0.97)" : "scale(1)",
        boxShadow: hover && !props.disabled ? "0 0 15px rgba(62,207,142,0.4)" : "none",
      }}
    />
  );
}