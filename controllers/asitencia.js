const connection = require("../models/db");

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
      // Revisar si ya existe una asistencia para el alumno y la fecha dada
      const consultaExistencia = "SELECT id_asistencia FROM asistencias WHERE id_alumno = ? AND fecha = ?";
      connection.query(consultaExistencia, [id_alumno, fecha], (err, results) => {
        if (err) return reject(err);

        if (results.length > 0) {
          // Si existe, actualiza el estado
          const consultaUpdate = "UPDATE asistencias SET estado = ? WHERE id_alumno = ? AND fecha = ?";
          connection.query(consultaUpdate, [estado, id_alumno, fecha], (err2) => {
            if (err2) return reject(err2);
            resolve();
          });
        } else {
          // Si no existe, inserta un nuevo registro
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


