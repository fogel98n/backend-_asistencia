const connection = require("../models/db");

// Registrar o actualizar asistencias
module.exports.registrarAsistencia = (req, res) => {
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

  const promises = asistencias.map(({ id_alumno, fecha, estado }) => {
    return new Promise((resolve, reject) => {
      const consultaExistencia = "SELECT id_asistencia FROM asistencias WHERE id_alumno = ? AND fecha = ?";
      connection.query(consultaExistencia, [id_alumno, fecha], (err, results) => {
        if (err) return reject(err);

        if (results.length > 0) {
          const consultaUpdate = "UPDATE asistencias SET estado = ? WHERE id_alumno = ? AND fecha = ?";
          connection.query(consultaUpdate, [estado, id_alumno, fecha], (err2) => {
            if (err2) return reject(err2);
            resolve();
          });
        } else {
          const consultaInsert = "INSERT INTO asistencias (id_alumno, fecha, estado) VALUES (?, ?, ?)";
          connection.query(consultaInsert, [id_alumno, fecha, estado], (err3) => {
            if (err3) return reject(err3);
            resolve();
          });
        }
      });
    });
  });

  Promise.all(promises)
    .then(() => res.json({ message: "Asistencias registradas/actualizadas correctamente" }))
    .catch((error) => {
      console.error("Error al procesar asistencias:", error);
      res.status(500).json({ error: "Error en el servidor al procesar asistencias" });
    });
};

// Obtener asistencias por grado o por rango de fechas
module.exports.obtenerAsistencias = (req, res) => {
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

  connection.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error al obtener asistencias:", err);
      return res.status(500).json({ error: "Error al obtener asistencias" });
    }

    res.json(results);
  });
};
