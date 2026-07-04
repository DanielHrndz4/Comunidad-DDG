import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtpEmail = async (email: string, otpCode: string): Promise<boolean> => {
  const mailOptions = {
    from: `"Comunidad DDG" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Código de Verificación OTP - Comunidad DDG",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e7e4; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 2px solid #2dbda1; padding-bottom: 15px; margin-bottom: 25px;">
          <h2 style="color: #2dbda1; margin: 0; font-size: 24px;">Comunidad DDG</h2>
        </div>
        <p style="color: #333333; font-size: 16px; line-height: 1.6;">
          ¡Hola! Gracias por registrarte en la <strong>Comunidad DDG</strong>. Para activar tu cuenta, por favor ingresa el siguiente código de verificación de 6 dígitos en la aplicación:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: bold; color: #2dbda1; letter-spacing: 5px; background-color: #f4f7f6; padding: 15px 30px; border-radius: 8px; border: 1px dashed #2dbda1;">
            ${otpCode}
          </span>
        </div>
        <p style="color: #666666; font-size: 14px; line-height: 1.5;">
          Este código es válido por 10 minutos. Si no solicitaste este registro, puedes ignorar este correo de forma segura.
        </p>
        <div style="text-align: center; border-top: 1px solid #f4f7f6; padding-top: 15px; margin-top: 25px; color: #8fa09b; font-size: 12px;">
          © ${new Date().getFullYear()} Comunidad DDG. Todos los derechos reservados.
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email] OTP ${otpCode} enviado exitosamente a ${email}`);
    return true;
  } catch (error) {
    console.error(`[Email Error] Fallo al enviar OTP a ${email}:`, error);
    return false;
  }
};

export const sendResetOtpEmail = async (email: string, otpCode: string): Promise<boolean> => {
  const mailOptions = {
    from: `"Comunidad DDG" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Recuperación de Contraseña - Comunidad DDG",
    html: `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e7e4; border-radius: 12px; background-color: #ffffff;">
        <div style="text-align: center; border-bottom: 2px solid #e54a55; padding-bottom: 15px; margin-bottom: 25px;">
          <h2 style="color: #e54a55; margin: 0; font-size: 24px;">Restablecer Contraseña</h2>
        </div>
        <p style="color: #333333; font-size: 16px; line-height: 1.6;">
          Has solicitado restablecer la contraseña de tu cuenta en la <strong>Comunidad DDG</strong>. Por favor, utiliza el siguiente código de verificación de 6 dígitos para completar el proceso:
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; font-size: 32px; font-weight: bold; color: #e54a55; letter-spacing: 5px; background-color: #fff5f5; padding: 15px 30px; border-radius: 8px; border: 1px dashed #e54a55;">
            ${otpCode}
          </span>
        </div>
        <p style="color: #666666; font-size: 14px; line-height: 1.5;">
          Este código es válido por 10 minutos. Si no solicitaste este restablecimiento, por favor ignora este mensaje y asegúrate de cambiar tu contraseña si crees que tu cuenta está en peligro.
        </p>
        <div style="text-align: center; border-top: 1px solid #f4f7f6; padding-top: 15px; margin-top: 25px; color: #8fa09b; font-size: 12px;">
          © ${new Date().getFullYear()} Comunidad DDG. Todos los derechos reservados.
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email] Reset OTP ${otpCode} enviado exitosamente a ${email}`);
    return true;
  } catch (error) {
    console.error(`[Email Error] Fallo al enviar Reset OTP a ${email}:`, error);
    return false;
  }
};

