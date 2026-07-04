import nodemailer from "nodemailer";
import "dotenv/config";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export const sendOTP = async (email: string, otp: string) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Verificación de Cuenta - TodoVisa",
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Verifica tu cuenta</h2>
                <p>Tu código de verificación (OTP) es: <strong>${otp}</strong></p>
                <p>Este código expirará en 15 minutos.</p>
            </div>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("OTP sent to:", email);
    } catch (error) {
        console.error("Error sending OTP email:", error);
        throw new Error("Error al enviar el correo de verificación");
    }
};
