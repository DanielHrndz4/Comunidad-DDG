import { ButtonHTMLAttributes } from "react";

export default function SecondaryButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
    const { style, children, ...rest } = props;
    return (
        <button
            {...rest}
            style={{
                background: "#f5f5f7",
                color: "#142B36",
                border: "1.5px solid #e8e8ed",
                borderRadius: "12px",
                padding: "12px 24px",
                fontSize: "14px",
                fontWeight: 600,
                fontFamily: "'Montserrat','Inter',sans-serif",
                cursor: "pointer",
                transition: "all .2s ease",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                ...style,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "#ebebed"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "#f5f5f7"; }}
        >
            {children}
        </button>
    );
}