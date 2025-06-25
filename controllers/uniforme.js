const connection = require("../models/db");

exports.guardarReporteUniforme = (req, res) => {
  const { id_alumno, fecha, descripcion } = req.body;

  if (!id_alumno || !fecha) {
    return res.status(400).json({ error: "id_alumno y fecha son obligatorios." });
  }

  connection.query(
    "INSERT INTO reporte_uniforme (id_alumno, fecha, descripcion) VALUES (?, ?, ?)",
    [id_alumno, fecha, descripcion || null],
    (error, results) => {
      if (error) {
        console.error("Error al guardar el reporte:", error);
        return res.status(500).json({ error: "Error al guardar el reporte de uniforme." });
      }

      res.status(200).json({ mensaje: "Reporte de uniforme guardado correctamente." });
    }
  );
};
