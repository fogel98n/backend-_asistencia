const pool = require("../models/db");

module.exports.registrarAsistencia = async (req, res) => {
  const asistencias = req.body;

  console.log("Datos recibidos:", JSON.stringify(asistencias, null, 2));

  if (!Array.isArray(asistencias) || asistencias.length === 0) {
    return res.status(400).json({ error: "Se debe enviar un array no vacío" });
  }

  const estadosValidos = ["presente", "ausente", "justificado"];

  for (const asistencia of asistencias) {
    const { id_alumno, fecha, estado } = asistencia;
    if (!id_alumno || !fecha || !estado) {
      return res.status(400).json({ error: "id_alumno, fecha y estado son obligatorios en cada asistencia" });
    }
    if (!estadosValidos.includes(estado)) {
      return res.status(400).json({ error: `Estado inválido: ${estado}` });
    }
  }

  try {
    for (const { id_alumno, fecha, estado } of asistencias) {
      const [results] = await pool.query(
        "SELECT id_asistencia FROM asistencias WHERE id_alumno = ? AND fecha = ?",
        [id_alumno, fecha]
      );

      if (results.length > 0) {
        await pool.query(
          "UPDATE asistencias SET estado = ? WHERE id_alumno = ? AND fecha = ?",
          [estado, id_alumno, fecha]
        );
      } else {
        await pool.query(
          "INSERT INTO asistencias (id_alumno, fecha, estado) VALUES (?, ?, ?)",
          [id_alumno, fecha, estado]
        );
      }
    }
    res.json({ message: "Asistencias registradas/actualizadas correctamente" });
  } catch (error) {
    console.error("Error al procesar asistencias:", error);
    res.status(500).json({ error: "Error en el servidor al procesar asistencias" });
  }
};

module.exports.obtenerAsistencias = async (req, res) => {
  const { id_grado, fechaInicio, fechaFin } = req.query;

  let sql = `
    SELECT a.id_asistencia, a.id_alumno, a.fecha, a.estado, al.nombre AS nombre_alumno, al.id_grado
    FROM asistencias a
    INNER JOIN alumnos al ON a.id_alumno = al.id_alumno
    WHERE 1 = 1
  `;
  const params = [];

  if (id_grado) {
    sql += " AND al.id_grado = ?";
    params.push(id_grado);
  }

  if (fechaInicio && fechaFin) {
    sql += " AND a.fecha BETWEEN ? AND ?";
    params.push(fechaInicio, fechaFin);
  }

  try {
    const [results] = await pool.query(sql, params);
    res.json(results);
  } catch (err) {
    console.error("Error al obtener asistencias:", err);
    res.status(500).json({ error: "Error al obtener asistencias" });
  }
};
