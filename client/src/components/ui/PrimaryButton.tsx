import { ButtonHTMLAttributes } from "react";

export default function PrimaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
    const { style, children, ...rest } = props;
    return (
        <button
            {...rest}
            style={{
                background: "linear-gradient(135deg, #2dbda1, #1a9e86)",
                color: "#fff",
                border: "none",
                borderRadius: "12px",
                padding: "12px 28px",
                fontSize: "14px",
                fontWeight: 700,
                fontFamily: "'Montserrat','Inter',sans-serif",
                cursor: "pointer",
                transition: "all .25s ease",
                boxShadow: "0 4px 14px rgba(45,189,161,.3)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                ...style,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 6px 20px rgba(45,189,161,.45)"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = ""; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 14px rgba(45,189,161,.3)"; }}
        >
            {children}
        </button>
    );
}