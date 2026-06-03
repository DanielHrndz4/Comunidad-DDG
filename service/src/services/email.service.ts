import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

export const sendEmail = async ({
    to,
    subject,
    html,
}: SendEmailParams): Promise<void> => {
    await transporter.sendMail({
        from: `"Comunidad DDG" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
};