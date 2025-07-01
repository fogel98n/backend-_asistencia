const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "in-v3.mailjet.com",
  port: 587,
  auth: {
    user: "f495c116689bc2932c06123a99efea1b", 
    pass: "a9b1d79a5a0023201b28ce5357fae9b9", 
  }
});

async function enviarCodigoRecuperacion(destinatario, codigo) {
  const mailOptions = {
    from: '"Asistencia Educativa" <no-reply@asistencia.com>',
    to: destinatario,
    subject: "Código de Recuperación",
    text: `Tu código de recuperación es: ${codigo}`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado a:", destinatario);
  } catch (error) {
    console.error("Error enviando correo:", error);
    throw new Error("No se pudo enviar el correo");
  }
}

module.exports = { enviarCodigoRecuperacion };

