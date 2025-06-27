const connection = require("../models/db");

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

module.exports.gradosPorNivel = (req, res) => {
  const { idNivel } = req.params;
  const query = "SELECT * FROM grados WHERE id_nivel = ?";
  connection.query(query, [idNivel], (err, results) => {
    if (err) {
      console.error("Error al obtener grados por nivel:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(results);
  });
};

module.exports.gradoPorId = (req, res) => {
  const { idGrado } = req.params;
  const query = "SELECT * FROM grados WHERE id_grado = ?";
  connection.query(query, [idGrado], (err, results) => {
    if (err) {
      console.error("Error al obtener grado por id:", err);
      return res.status(500).json({ error: "Error en el servidor" });
    }
    res.json(results);
  });
};
