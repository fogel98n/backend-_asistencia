const jwt = require("jsonwebtoken");
const connection = require("../models/db");

module.exports.login = (req, res) => {
  const { email, password } = req.body;

  
  const queryCoordinador = "SELECT id_coordinador AS id, nombre, email FROM coordinadores WHERE email = ? AND password = ?";
  connection.query(queryCoordinador, [email, password], (err, result) => {
    if (err) {
      console.error("Error en consulta de coordinador:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (result.length > 0) {
      const user = result[0];
      const token = jwt.sign({ email: user.email, rol: "coordinador" }, "Stack", { expiresIn: "365d" });

      return res.status(200).json({
        token,
        nombre: user.nombre,
        email: user.email,
        id: user.id,
        rol: "coordinador"
      });
    }

    
    const queryMaestro = "SELECT id_maestro AS id, nombre, email FROM maestros WHERE email = ? AND password = ?";
    connection.query(queryMaestro, [email, password], (err, result) => {
      if (err) {
        console.error("Error en consulta de maestro:", err);
        return res.status(500).json({ error: "Error interno del servidor" });
      }

      if (result.length > 0) {
        const user = result[0];
        const token = jwt.sign({ email: user.email, rol: "maestro" }, "Stack", { expiresIn: "365d" });

        return res.status(200).json({
          token,
          nombre: user.nombre,
          email: user.email,
          id: user.id,
          rol: "maestro"
        });
      }

      return res.status(401).json({ message: "Usuario no encontrado" });
    });
  });
};

