const pool = require("../models/db");

module.exports.register = async (req, res) => {
  const { nombre, email, password, telefono, id_grado } = req.body;

  if (!nombre || !email || !password || !telefono || !id_grado || id_grado === "") {
    return res.status(400).send({ message: "Faltan datos requeridos." });
  }

  const idGradoNum = Number(id_grado);
  if (isNaN(idGradoNum)) {
    return res.status(400).send({ message: "El grado no es válido." });
  }

  try {
    const [result] = await pool.query("SELECT * FROM maestros WHERE email = ?", [email]);

    if (result.length > 0) {
      return res.status(400).send({ message: "El usuario ya existe." });
    }

    await pool.query(
      "INSERT INTO maestros (nombre, email, password, telefono, id_grado) VALUES (?, ?, ?, ?, ?)",
      [nombre, email, password, telefono, idGradoNum]
    );

    return res.status(201).send({ message: "Usuario registrado correctamente." });
  } catch (err) {
    console.error("Error en la base de datos:", err);
    return res.status(500).send({ message: "Error en la base de datos." });
  }
};
