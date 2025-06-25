const connection = require("../models/db");
module.exports.grados=(req,res)=>{
    const consult = "SELECT * FROM grados";
    connection.query(consult, (err, results) => {
        if (err) {
            console.error('Error al obtener grados:', err);
            return res.status(500).json({ error: 'Error en el servidor' });
        }

        res.json(results);
    });
}