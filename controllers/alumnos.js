const connection = require("../models/db");

module.exports.alumnos = (req, res) => {
    const consult = "SELECT * FROM alumnos";
    connection.query(consult, (err, results) => {
        if (err) {
            console.error('Error al obtener los alumnos:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }
        res.json(results);
    });  
};

module.exports.agregarAlumno = (req, res) => {
    console.log("Datos recibidos en POST /alumnos:", req.body);
    const { nombre, email, telefono, id_grado } = req.body;

    if (!nombre || !email || !telefono || !id_grado) {
        return res.status(400).json({ error: "Todos los campos son obligatorios" });
    }

    const sql = `
        INSERT INTO alumnos (nombre, email, telefono, id_grado)
        VALUES (?, ?, ?, ?)
    `;

    connection.query(sql, [nombre, email, telefono, id_grado], (err, result) => {
        if (err) {
            console.error("Error al insertar alumno:", err);
            if (err.code === "ER_DUP_ENTRY") {
                return res.status(400).json({ error: "El email ya está registrado" });
            }
            return res.status(500).json({ error: "Error al guardar el alumno" });
        }

        res.json({ message: "Alumno agregado correctamente", id_alumno: result.insertId });
    });
};

module.exports.eliminarAlumno = (req, res) => {
    const { id } = req.params;

    const eliminarAsistencias = "DELETE FROM asistencias WHERE id_alumno = ?";
    connection.query(eliminarAsistencias, [id], (err) => {
        if (err) {
            console.error("Error al eliminar asistencias del alumno:", err);
            return res.status(500).json({ error: "Error al eliminar asistencias del alumno" });
        }

        const eliminarAlumno = "DELETE FROM alumnos WHERE id_alumno = ?";
        connection.query(eliminarAlumno, [id], (err, result) => {
            if (err) {
                console.error("Error al eliminar alumno:", err);
                return res.status(500).json({ error: "Error al eliminar alumno" });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ error: "Alumno no encontrado" });
            }

            res.json({ message: "Alumno eliminado correctamente" });
        });
    });
};
