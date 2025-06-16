const jwt = require("jsonwebtoken");
const connection = require("../models/db");

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  const consult = "SELECT * FROM maestros WHERE email = ? AND password = ?";

  connection.query(consult, [email, password], (err, result) => {
    if (err) {
      console.error("Error en la consulta:", err);
      return res.status(500).json({ error: "Error interno del servidor" });
    }

    if (result.length > 0) {
      const token = jwt.sign({ email }, "Stack", {
        expiresIn: "365d",
      });
      return res.status(200).json({ token }); 
    } else {
      return res.status(401).json({ message: "usuario no encontrado" });
    }
  });
};
