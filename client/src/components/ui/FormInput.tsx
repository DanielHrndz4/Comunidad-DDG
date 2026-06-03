import { InputHTMLAttributes, useState } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  success?: boolean;
}

export default function FormInput({
  label,
  error,
  success,
  onFocus,
  onBlur,
  ...props
}: Props) {
  const [focused, setFocused] = useState(false);

  const borderColor = error ? "#ef4444" : success ? "#3ecf8e" : focused ? "#3ecf8e" : "rgba(255, 255, 255, 0.1)";
  const bgColor = error ? "rgba(239, 68, 68, 0.05)" : success ? "rgba(62, 207, 142, 0.05)" : "#2a2a2a";
  const labelColor = error ? "#ef4444" : success ? "#3ecf8e" : focused ? "#3ecf8e" : "#9ca3af";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "14px", fontWeight: "500", marginLeft: "4px", color: labelColor, transition: "color 0.2s" }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        <input
          {...props}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          style={{
            width: "100%",
            backgroundColor: bgColor,
            border: `1px solid ${borderColor}`,
            borderRadius: "8px",
            padding: "12px 16px",
            fontSize: "15px",
            color: "white",
            outline: "none",
            transition: "all 0.2s",
            boxSizing: "border-box",
            boxShadow: focused ? `0 0 0 2px rgba(62,207,142,0.1)` : "none"
          }}
        />
        {error && <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "#ef4444" }}>✕</span>}
        {success && !error && <span style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", color: "#3ecf8e" }}>✓</span>}
      </div>
      {error && <p style={{ fontSize: "12px", color: "#ef4444", margin: "0 0 0 4px" }}>{error}</p>}
    </div>
  );
}