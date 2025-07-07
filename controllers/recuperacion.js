const pool = require("../models/db");
const { enviarCodigoRecuperacion } = require("../utils/email");
const crypto = require("crypto");

const codigos = new Map();

function generarCodigo() {
  return crypto.randomInt(100000, 999999).toString();
}

async function solicitarCodigo(req, res) {
  let email = req.body.email;
  if (!email) return res.status(400).json({ message: "Email es requerido" });

  email = email.trim().toLowerCase();

  try {
    const [coordResults] = await pool.query(
      "SELECT * FROM coordinadores WHERE LOWER(email) = ?",
      [email]
    );

    if (coordResults.length > 0) {
      return await enviarYCodificar(email, res);
    }

    const [maestroResults] = await pool.query(
      "SELECT * FROM maestros WHERE LOWER(email) = ?",
      [email]
    );

    if (maestroResults.length > 0) {
      return await enviarYCodificar(email, res);
    }

    return res.status(404).json({ message: "Usuario no encontrado" });
  } catch (err) {
    console.error("Error interno:", err);
    return res.status(500).json({ message: "Error interno" });
  }
}

async function enviarYCodificar(email, res) {
  try {
    const codigo = generarCodigo();
    codigos.set(email, codigo);
    await enviarCodigoRecuperacion(email, codigo);
    return res.json({ message: "Código enviado al correo" });
  } catch (error) {
    console.error("Error al enviar el código:", error);
    return res.status(500).json({ message: "Error al enviar el código" });
  }
}

async function verificarCodigo(req, res) {
  let email = req.body.email;
  let codigo = req.body.codigo;
  if (!email || !codigo) {
    return res.status(400).json({ message: "Email y código son requeridos" });
  }
  email = email.trim().toLowerCase();

  if (codigos.get(email) !== codigo) {
    return res.status(400).json({ message: "Código incorrecto" });
  }

  res.json({ message: "Código verificado" });
}

async function cambiarPassword(req, res) {
  let { email, codigo, nuevaPassword } = req.body;
  if (!email || !codigo || !nuevaPassword) {
    return res.status(400).json({ message: "Email, código y nueva contraseña son requeridos" });
  }
  email = email.trim().toLowerCase();

  if (codigos.get(email) !== codigo) {
    return res.status(400).json({ message: "Código incorrecto" });
  }

  try {
    const [result] = await pool.query(
      "UPDATE maestros SET password = ? WHERE LOWER(email) = ?",
      [nuevaPassword, email]
    );

    codigos.delete(email);
    return res.json({ message: "Contraseña actualizada correctamente" });
  } catch (err) {
    console.error("Error al actualizar contraseña:", err);
    return res.status(500).json({ message: "Error al actualizar contraseña" });
  }
}

module.exports = {
  solicitarCodigo,
  verificarCodigo,
  cambiarPassword,
};

