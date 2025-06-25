const connection = require("../models/db");
module.exports.maestros=(req,res)=>{
    const consult = "SELECT * FROM maestros";
    connection.query(consult, (err, results) => {
        if (err) {
            console.error('Error al obtener maestros', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        res.json(results);
    });
}