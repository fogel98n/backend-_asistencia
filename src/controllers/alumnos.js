const connection= require("../models/db");

module.exports.alumnos = (req, res) => {
    const consult = "SELECT * FROM alumnos";
    connection.query(consult, (err, results) => {
        if (err) {
            console.error('Error al obtener los alumnos:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        res.json(results);
    });  
}