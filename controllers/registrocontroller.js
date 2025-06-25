const connection = require("../models/db");

module.exports.register = (req, res) => {
  const { nombre, email, password, telefono, id_grado } = req.body;

  if (!nombre || !email || !password || !telefono || !id_grado || id_grado === "") {
    return res.status(400).send({ message: "Faltan datos requeridos." });
  }

  const idGradoNum = Number(id_grado);
  if (isNaN(idGradoNum)) {
    return res.status(400).send({ message: "El grado no es válido." });
  }

  const checkUser = "SELECT * FROM maestros WHERE email = ?";
  connection.query(checkUser, [email], (err, result) => {
    if (err) {
      console.error("Error en la consulta checkUser:", err);
      return res.status(500).send({ message: "Error en la base de datos." });
    }

    if (result.length > 0) {
      return res.status(400).send({ message: "El usuario ya existe." });
    }

    const insertUser = "INSERT INTO maestros (nombre, email, password, telefono, id_grado) VALUES (?, ?, ?, ?, ?)";
    connection.query(insertUser, [nombre, email, password, telefono, idGradoNum], (err, result) => {
      if (err) {
        console.error("Error al registrar usuario:", err);
        return res.status(500).send({ message: "Error al registrar el usuario." });
      }
      return res.status(201).send({ message: "Usuario registrado correctamente." });
    });
  });
};
