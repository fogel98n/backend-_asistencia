const pool = require("../models/db");

module.exports.niveles_educativos = async (req, res) => {
  const consult = "SELECT * FROM niveles_educativos";

  try {
    const [results] = await pool.query(consult);
    res.json(results);
  } catch (err) {
    console.error('Error al obtener los niveles:', err);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
