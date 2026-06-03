export const welcomeTemplate = (
    username: string
): string => {
    return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; padding:20px;">
        <h1>Bienvenido a Comunidad DDG</h1>

        <p>Hola <strong>${username}</strong>,</p>

        <p>
            Tu cuenta ha sido creada correctamente.
        </p>

        <p>
            Gracias por formar parte de nuestra comunidad.
        </p>
    </body>
    </html>
    `;
};