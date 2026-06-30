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
        <div className="mx-auto w-full max-w-[min(92vw,600px)] overflow-hidden rounded-[24px] border border-white/10 bg-neutral-900 p-6 shadow-2xl box-border sm:p-8 md:p-10">
            <h2 className="mb-6 text-center font-display text-2xl font-bold tracking-tight text-white sm:text-[28px]">
                {title}
            </h2>

            {children}

        </div>
    );
}