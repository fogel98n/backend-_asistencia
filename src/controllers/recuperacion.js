const connection = require("../models/db");
const { enviarCodigoRecuperacion } = require("../utils/email");
const crypto = require("crypto");

const codigos = new Map();

function generarCodigo() {
  return crypto.randomInt(100000, 999999).toString();
}

async function solicitarCodigo(req, res) {
  const { email } = req.body;

  connection.query("SELECT * FROM usuarios WHERE email = ?", [email], async (err, results) => {
    if (err || results.length === 0) return res.status(404).json({ message: "Usuario no encontrado" });

    const codigo = generarCodigo();
    codigos.set(email, codigo);

    try {
      await enviarCodigoRecuperacion(email, codigo);
      res.json({ message: "Código enviado al correo" });
    } catch {
      res.status(500).json({ message: "Error al enviar el código" });
    }
  });
}

async function verificarCodigo(req, res) {
  const { email, codigo } = req.body;

  if (codigos.get(email) !== codigo) return res.status(400).json({ message: "Código incorrecto" });

  res.json({ message: "Código verificado" });
}

async function cambiarPassword(req, res) {
  const { email, codigo, nuevaPassword } = req.body;

  if (codigos.get(email) !== codigo) return res.status(400).json({ message: "Código incorrecto" });

  connection.query(
    "UPDATE usuarios SET password = ? WHERE email = ?",
    [nuevaPassword, email],
    (err) => {
      if (err) return res.status(500).json({ message: "Error al actualizar contraseña" });

      codigos.delete(email);
      res.json({ message: "Contraseña actualizada correctamente" });
    }
  );
}

module.exports = {
  solicitarCodigo,
  verificarCodigo,
  cambiarPassword
};
       

