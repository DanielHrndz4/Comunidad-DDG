import React from "react";
import { MdClose } from "react-icons/md";

interface Props {
    title: string;
    subtitle?: string;
    accentColor?: string;
    onClose?: () => void;
    children: React.ReactNode;
}

export default function FormModal({ title, subtitle, accentColor = "#2dbda1", onClose, children }: Props) {
    return (
        <div style={{
            width: "100%",
            maxWidth: "520px",
            background: "#fff",
            borderRadius: "24px",
            overflow: "hidden",
            boxShadow: "0 20px 60px rgba(20,43,54,.2)",
            fontFamily: "'Montserrat','Inter',sans-serif",
            animation: "fmIn .3s cubic-bezier(0.16,1,0.3,1)",
        }}>
            <style>{`
                @keyframes fmIn {
                    from { opacity:0; transform:scale(.96) translateY(10px); }
                    to   { opacity:1; transform:scale(1)  translateY(0);    }
                }
            `}</style>

            {/* Header */}
            <div style={{
                background: `linear-gradient(135deg, ${accentColor}, ${accentColor}cc)`,
                padding: "22px 28px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
            }}>
                <div>
                    <h2 style={{ color: "#fff", fontSize: "18px", fontWeight: 700, margin: 0 }}>{title}</h2>
                    {subtitle && <p style={{ color: "rgba(255,255,255,.75)", fontSize: "12px", margin: "4px 0 0" }}>{subtitle}</p>}
                </div>
                {onClose && (
                    <button onClick={onClose} style={{
                        background: "rgba(255,255,255,.2)", border: "none", borderRadius: "8px",
                        color: "#fff", cursor: "pointer", display: "flex", alignItems: "center",
                        padding: "7px", transition: "background .2s",
                    }}>
                        <MdClose size={18} />
                    </button>
                )}
            </div>

            {/* Body */}
            <div style={{ padding: "28px" }}>
                {children}
            </div>
        </div>
    );
}