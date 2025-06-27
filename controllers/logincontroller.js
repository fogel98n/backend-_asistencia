const jwt = require("jsonwebtoken");
const connection = require("../models/db");

module.exports.login = (req, res) => {
  console.log("Petición recibida en /login_asistencia");

  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Faltan email o password en la petición");
    return res.status(400).json({ message: "Email y password son requeridos" });
  }

  const queryCoordinador = `
    SELECT id_coordinador AS id, nombre, email 
    FROM coordinadores 
    WHERE email = ? AND password = ?
  `;

  connection.query(queryCoordinador, [email, password], (err, result) => {
    if (err) {
      console.error("Error en consulta de coordinador:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (result.length > 0) {
      const user = result[0];
      const token = jwt.sign(
        { email: user.email, rol: "coordinador" },
        "Stack",
        { expiresIn: "365d" }
      );

      console.log("Coordinador autenticado:", user.email);

      return res.status(200).json({
        token,
        nombre: user.nombre,
        email: user.email,
        id: user.id,
        rol: "coordinador",
      });
    }

    const queryMaestro = `
      SELECT m.id_maestro AS id, m.nombre, m.email, m.id_grado, g.id_nivel
      FROM maestros m
      JOIN grados g ON m.id_grado = g.id_grado
      WHERE m.email = ? AND m.password = ?
    `;

    connection.query(queryMaestro, [email, password], (err, result) => {
      if (err) {
        console.error("Error en consulta de maestro:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }

      if (result.length > 0) {
        const user = result[0];

        const payload = {
          id: user.id,
          nombre: user.nombre,
          email: user.email,
          rol: "maestro",
          id_grado: user.id_grado,
          id_nivel: user.id_nivel, 
        };

        const token = jwt.sign(payload, "Stack", { expiresIn: "365d" });

        console.log("Maestro autenticado:", user.email);

        return res.status(200).json({
          token,
          ...payload,
        });
      }

      console.log("Usuario no encontrado:", email);
      return res.status(401).json({ message: "Usuario no encontrado" });
    });
  });
};
