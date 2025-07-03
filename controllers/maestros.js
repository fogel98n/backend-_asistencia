const connection = require("../models/db");


module.exports.maestros = (req, res) => {
    const consult = `
        SELECT m.*, g.nombre_grado
        FROM maestros m
        LEFT JOIN grados g ON m.id_grado = g.id_grado
    `;

    connection.query(consult, (err, results) => {
        if (err) {
            console.error('Error al obtener maestros:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        res.json(results);
    });
};

module.exports.eliminarMaestro = (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ error: "ID de maestro requerido" });
    }

    const query = "DELETE FROM maestros WHERE id_maestro = ?";
    connection.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error al eliminar maestro:", err);
            return res.status(500).json({ error: "Error al eliminar maestro" });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Maestro no encontrado" });
        }

        res.json({ message: "Maestro eliminado correctamente" });
    });
};
