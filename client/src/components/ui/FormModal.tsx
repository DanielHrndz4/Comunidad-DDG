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
            className="
                w-full
                max-w-[95vw]
                sm:max-w-2xl

                bg-white/85
                backdrop-blur-2xl

                border
                border-[#E5E5E7]

                rounded-[38px]

                overflow-hidden

                px-6
                sm:px-10

                py-8

                shadow-[0_10px_40px_rgba(0,0,0,0.08)]

                animate-[modalIn_.35s_cubic-bezier(0.16,1,0.3,1)]
            "
        >

            <style>{`
                @keyframes modalIn {
                    from {
                        opacity: 0;
                        transform: scale(0.96) translateY(12px);
                    }

                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `}</style>

            <h2
                className="
                    text-center
                    text-[2.2rem]
                    font-semibold
                    tracking-[-0.04em]
                    text-[#1D1D1F]
                    mb-8
                "
            >
                {title}
            </h2>

            {children}

        </div>
    );
}