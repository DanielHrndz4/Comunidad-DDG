export const otpTemplate = (
    code: string
): string => {
    return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial, sans-serif; padding:20px;">
        <h1>Recuperación de contraseña</h1>

        <p>
            Utiliza el siguiente código OTP:
        </p>

        <h2>${code}</h2>

        <p>
            Este código expirará en 10 minutos.
        </p>
    </body>
    </html>
    `;
};