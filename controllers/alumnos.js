const pool = require("../models/db");

module.exports.alumnos = async (req, res) => {
  try {
    const [results] = await pool.query("SELECT * FROM alumnos");
    res.json(results);
  } catch (err) {
    console.error('Error al obtener los alumnos:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports.agregarAlumno = async (req, res) => {
  console.log("Datos recibidos en POST /alumnos:", req.body);
  const { nombre, email, telefono, id_grado } = req.body;

  if (!nombre || !email || !telefono || !id_grado) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  const sql = `
    INSERT INTO alumnos (nombre, email, telefono, id_grado)
    VALUES (?, ?, ?, ?)
  `;

  try {
    const [result] = await pool.query(sql, [nombre, email, telefono, id_grado]);
    res.json({ message: "Alumno agregado correctamente", id_alumno: result.insertId });
  } catch (err) {
    console.error("Error al insertar alumno:", err);
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(400).json({ error: "El email ya está registrado" });
    }
    res.status(500).json({ error: "Error al guardar el alumno" });
  }
};

module.exports.eliminarAlumno = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("DELETE FROM asistencias WHERE id_alumno = ?", [id]);
    
    const [result] = await pool.query("DELETE FROM alumnos WHERE id_alumno = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Alumno no encontrado" });
    }

    res.json({ message: "Alumno eliminado correctamente" });
  } catch (err) {
    console.error("Error al eliminar alumno o asistencias:", err);
    res.status(500).json({ error: "Error al eliminar alumno" });
  }
};
