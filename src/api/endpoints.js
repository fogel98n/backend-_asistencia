const express = require("express");
const router = express.Router();

const { login } = require("../controllers/logincontroller");
const { register } = require("../controllers/registrocontroller");
const { niveles_educativos } = require("../controllers/niveles_educativoController");
const { grados } = require("../controllers/gradoscontroller");
const { alumnos } = require("../controllers/alumnos");

// Asegúrate de importar correctamente los handlers desde recuperacion.js
const {
  solicitarCodigo,
  verificarCodigo,
  cambiarPassword
} = require("../controllers/recuperacion");

// Rutas normales
router.post("/login_asistencia", login);
router.post("/registro", register);
router.get("/niveles_educativos", niveles_educativos);
router.get("/grados", grados);
router.get("/alumnos", alumnos);

// Rutas de recuperación de contraseña
router.post("/recuperacion/codigo", solicitarCodigo);
router.post("/recuperacion/verificar", verificarCodigo);
router.post("/recuperacion/nueva", cambiarPassword);

module.exports = router;
