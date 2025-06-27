const connection = require("../models/db");

// Obtener todos los grados
module.exports.grados = (req, res) => {
  const query = "SELECT * FROM grados";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Error al obtener grados:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(results);
  });
};

// Obtener grados filtrados por id_nivel
module.exports.gradosPorNivel = (req, res) => {
  const idNivel = req.params.idNivel;
  const query = "SELECT * FROM grados WHERE id_nivel = ?";
  connection.query(query, [idNivel], (err, results) => {
    if (err) {
      console.error("Error al obtener grados por nivel:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(results);
  });
};
