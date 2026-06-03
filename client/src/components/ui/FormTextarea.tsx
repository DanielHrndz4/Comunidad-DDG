import { TextareaHTMLAttributes, useState } from "react";

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  success?: boolean;
  maxLength?: number;
}

export default function FormTextarea({ label, error, success, maxLength, onFocus, onBlur, onChange, ...props }: Props) {
  const [focused, setFocused] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const borderColor = error ? "#ef4444" : success ? "#3ecf8e" : focused ? "#3ecf8e" : "rgba(255, 255, 255, 0.1)";
  const bgColor = error ? "rgba(239, 68, 68, 0.05)" : success ? "rgba(62, 207, 142, 0.05)" : "#2a2a2a";
  const labelColor = error ? "#ef4444" : success ? "#3ecf8e" : focused ? "#3ecf8e" : "#9ca3af";
  
  const charCountColor = maxLength
    ? charCount >= maxLength ? "#ef4444" : charCount >= maxLength * 0.85 ? "#fbbf24" : "#9ca3af"
    : "#9ca3af";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
      <label style={{ fontSize: "14px", fontWeight: "500", marginLeft: "4px", color: labelColor, transition: "color 0.2s" }}>
        {label}
      </label>

      <div style={{ position: "relative" }}>
        <textarea
          {...props}
          maxLength={maxLength}
          onFocus={(e) => { setFocused(true); onFocus?.(e); }}
          onBlur={(e) => { setFocused(false); onBlur?.(e); }}
          onChange={(e) => { setCharCount(e.target.value.length); onChange?.(e); }}
          style={{
            width: "100%",
            minHeight: "120px",
            backgroundColor: bgColor,
            border: `1px solid ${borderColor}`,
            borderRadius: "8px",
            padding: "12px 16px",
            fontSize: "15px",
            color: "white",
            outline: "none",
            resize: "none",
            transition: "all 0.2s",
            boxSizing: "border-box",
            boxShadow: focused ? `0 0 0 2px rgba(62,207,142,0.1)` : "none"
          }}
        />

        {error && <span style={{ position: "absolute", right: "16px", top: "16px", color: "#ef4444" }}>✕</span>}
        {success && !error && <span style={{ position: "absolute", right: "16px", top: "16px", color: "#3ecf8e" }}>✓</span>}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {error ? (
          <p style={{ fontSize: "12px", color: "#ef4444", margin: "0 0 0 4px" }}>{error}</p>
        ) : success ? (
          <p style={{ fontSize: "12px", color: "#3ecf8e", margin: "0 0 0 4px" }}>Perfecto</p>
        ) : <span />}
        
        {maxLength && (
          <span style={{ fontSize: "12px", marginRight: "4px", color: charCountColor }}>
            {charCount} / {maxLength}
          </span>
        )}
      </div>
    </div>
  );
}