const pool = require("../models/db");

exports.guardarReporteUniforme = async (req, res) => {
  const { id_alumno, fecha, descripcion } = req.body;

  if (!id_alumno || !fecha) {
    return res.status(400).json({ error: "id_alumno y fecha son obligatorios." });
  }

  try {
    await pool.query(
      "INSERT INTO reporte_uniforme (id_alumno, fecha, descripcion) VALUES (?, ?, ?)",
      [id_alumno, fecha, descripcion || null]
    );
    res.status(200).json({ mensaje: "Reporte de uniforme guardado correctamente." });
  } catch (error) {
    console.error("Error al guardar el reporte:", error);
    res.status(500).json({ error: "Error al guardar el reporte de uniforme." });
  }
};
