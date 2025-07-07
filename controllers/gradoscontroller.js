const pool = require("../models/db");

module.exports.grados = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM grados");
    res.json(results);
  } catch (err) {
    console.error("Error al obtener grados:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports.gradosPorNivel = async (req, res) => {
  const { idNivel } = req.params;
  try {
    const [results] = await pool.query("SELECT * FROM grados WHERE id_nivel = ?", [idNivel]);
    res.json(results);
  } catch (err) {
    console.error("Error al obtener grados por nivel:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports.gradoPorId = async (req, res) => {
  const { idGrado } = req.params;
  try {
    const [results] = await pool.query("SELECT * FROM grados WHERE id_grado = ?", [idGrado]);
    if (results.length === 0) {
      return res.status(404).json({ message: "Grado no encontrado" });
    }
    res.json(results[0]);
  } catch (err) {
    console.error("Error al obtener grado por id:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};


