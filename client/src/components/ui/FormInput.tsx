import { InputHTMLAttributes, useState } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    success?: boolean;
    hint?: string;
}

export default function FormInput({ label, error, success, hint, onFocus, onBlur, ...props }: Props) {
    const [focused, setFocused] = useState(false);

    const borderColor = error
        ? "#e54a55"
        : success
            ? "#2dbda1"
            : focused
                ? "#2dbda1"
                : "#e8e8ed";

    const bgColor = error ? "#fff8f8" : success ? "#f5fdf9" : focused ? "#fff" : "#fafafa";
    const iconChar = error ? "✕" : success ? "✓" : null;
    const iconColor = error ? "#e54a55" : "#2dbda1";

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            <label style={{
                fontSize: "11px",
                fontWeight: 700,
                letterSpacing: ".6px",
                textTransform: "uppercase",
                color: error ? "#e54a55" : focused ? "#2dbda1" : "#8c92ac",
                transition: "color .2s",
            }}>
                {label}
            </label>

            <div style={{ position: "relative" }}>
                <input
                    {...props}
                    onFocus={(e) => { setFocused(true); onFocus?.(e); }}
                    onBlur={(e) => { setFocused(false); onBlur?.(e); }}
                    style={{
                        width: "100%",
                        padding: "11px 40px 11px 14px",
                        border: `1.5px solid ${borderColor}`,
                        borderRadius: "12px",
                        fontSize: "14px",
                        fontFamily: "'Montserrat','Inter',sans-serif",
                        fontWeight: 500,
                        color: "#142B36",
                        background: bgColor,
                        outline: "none",
                        transition: "all .2s",
                        boxSizing: "border-box",
                        boxShadow: focused ? `0 0 0 3px ${borderColor}20` : "none",
                    }}
                />
                {iconChar && (
                    <span style={{
                        position: "absolute", right: "13px", top: "50%",
                        transform: "translateY(-50%)", color: iconColor,
                        fontSize: "14px", fontWeight: 700, pointerEvents: "none",
                    }}>
                        {iconChar}
                    </span>
                )}
            </div>

            {error && (
                <p style={{ fontSize: "11px", color: "#e54a55", fontWeight: 600, margin: "2px 0 0" }}>{error}</p>
            )}
            {!error && hint && (
                <p style={{ fontSize: "11px", color: "#8c92ac", margin: "2px 0 0" }}>{hint}</p>
            )}
        </div>
    );
}