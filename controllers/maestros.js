const pool = require("../models/db");

module.exports.maestros = async (req, res) => {
  const consult = `
    SELECT m.*, g.nombre_grado
    FROM maestros m
    LEFT JOIN grados g ON m.id_grado = g.id_grado
  `;

  try {
    const [results] = await pool.query(consult);
    res.json(results);
  } catch (err) {
    console.error("Error al obtener maestros:", err);
    res.status(500).json({ error: "Error en el servidor" });
  }
};

module.exports.eliminarMaestro = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: "ID de maestro requerido" });
  }

  try {
    const query = "DELETE FROM maestros WHERE id_maestro = ?";
    const [result] = await pool.query(query, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Maestro no encontrado" });
    }

    res.json({ message: "Maestro eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar maestro:", err);
    res.status(500).json({ error: "Error al eliminar maestro" });
  }
};
