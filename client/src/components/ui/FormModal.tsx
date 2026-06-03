import React from "react";

interface Props {
    title: string;
    children: React.ReactNode;
}

export default function FormModal({
    title,
    children,
}: Props) {

    return (
        <div
            style={{
                width: "100%",
                maxWidth: "600px",
                margin: "0 auto",
                backgroundColor: "#1c1c1c",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                overflow: "hidden",
                padding: "32px 40px",
                boxShadow: "0 10px 40px rgba(0, 0, 0, 0.5)",
                boxSizing: "border-box"
            }}
        >
            <h2
                style={{
                    textAlign: "center",
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "white",
                    margin: "0 0 24px 0",
                    letterSpacing: "-0.5px"
                }}
            >
                {title}
            </h2>

            {children}

        </div>
    );
}