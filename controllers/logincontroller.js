const jwt = require("jsonwebtoken");
const pool = require("../models/db");

module.exports.login = async (req, res) => {
  console.log("Petición recibida en /login_asistencia");

  const { email, password } = req.body;

  if (!email || !password) {
    console.log("Faltan email o password en la petición");
    return res.status(400).json({ message: "Email y password son requeridos" });
  }

  try {
    const queryCoordinador = `
      SELECT id_coordinador AS id, nombre, email 
      FROM coordinadores 
      WHERE email = ? AND password = ?
    `;

    const [coordResult] = await pool.query(queryCoordinador, [email, password]);

    if (coordResult.length > 0) {
      const user = coordResult[0];
      const token = jwt.sign(
        { email: user.email, rol: "coordinador" },
        "Stack",
        { expiresIn: "365d" }
      );

      console.log("Coordinador autenticado:", user.email);

      return res.status(200).json({
        token,
        nombre: user.nombre,
        email: user.email,
        id: user.id,
        rol: "coordinador",
      });
    }

    const queryMaestro = `
      SELECT m.id_maestro AS id, m.nombre, m.email, m.id_grado, g.id_nivel
      FROM maestros m
      JOIN grados g ON m.id_grado = g.id_grado
      WHERE m.email = ? AND m.password = ?
    `;

    const [maestroResult] = await pool.query(queryMaestro, [email, password]);

    if (maestroResult.length > 0) {
      const user = maestroResult[0];

      const payload = {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: "maestro",
        id_grado: user.id_grado,
        id_nivel: user.id_nivel,
      };

      const token = jwt.sign(payload, "Stack", { expiresIn: "365d" });

      console.log("Maestro autenticado:", user.email);

      return res.status(200).json({
        token,
        ...payload,
      });
    }

    console.log("Usuario no encontrado:", email);
    return res.status(401).json({ message: "Usuario no encontrado" });
  } catch (err) {
    console.error("Error en la autenticación:", err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
