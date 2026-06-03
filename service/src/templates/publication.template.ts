export const publicationTemplate = (
    username: string | null | undefined,
    title: string | null | undefined
): string => {
    return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; padding:20px;">
        <h1>Publicación creada</h1>

        <p>Hola <strong>${username ?? "Usuario"}</strong>,</p>

        <p>
            Tu publicación ha sido creada exitosamente.
        </p>

        <p>
            <strong>${title ?? "Sin título"}</strong>
        </p>
    </body>
    </html>
    `;
};