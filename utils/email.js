const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "forellanabarrios@gmail.com",
    pass: "nlsnsrttpelbusoz", // sin espacios
  },
});

async function enviarCodigoRecuperacion(email, codigo) {
  await transporter.sendMail({
    from: '"Soporte" <forellanabarrios@gmail.com>',
    to: email,
    subject: "Recuperación de contraseña",
    html: `<p>Tu código de recuperación es: <b>${codigo}</b></p>`,
  });

  console.log(`Correo enviado a ${email} con el código ${codigo}`);
}

module.exports = { enviarCodigoRecuperacion };
