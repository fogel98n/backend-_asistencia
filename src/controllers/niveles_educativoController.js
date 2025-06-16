const connection = require("../models/db");

module.exports.niveles_educativos = (req, res) => {
    const consult = "SELECT * FROM niveles_educativos";
    connection.query(consult, (err, results) => {
        if (err) {
            console.error('Error al obtener los niveles:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        res.json(results);
    });
};
