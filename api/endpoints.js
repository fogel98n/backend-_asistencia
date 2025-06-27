const express = require("express");
const router = express.Router();

const { login } = require("../controllers/logincontroller");
const { register } = require("../controllers/registrocontroller");
const { niveles_educativos } = require("../controllers/niveles_educativoController");
const { grados, gradosPorNivel } = require("../controllers/gradoscontroller");
const { alumnos, agregarAlumno } = require("../controllers/alumnos");
const { registrarAsistencia } = require("../controllers/asitencia");
const { guardarReporteUniforme } = require("../controllers/uniforme");
const { maestros } = require("../controllers/maestros");

const {
  solicitarCodigo,
  verificarCodigo,
  cambiarPassword
} = require("../controllers/recuperacion");

// Auth
router.post("/login_asistencia", login);
router.post("/registro", register);

// Datos académicos
router.get("/niveles_educativos", niveles_educativos);
router.get("/grados", grados);
router.get("/grados/nivel/:idNivel", gradosPorNivel); 
router.get("/maestros", maestros);
router.get("/alumnos", alumnos);
router.post("/alumnosRegistro", agregarAlumno);

// Asistencia y reportes
router.post("/asistencia", registrarAsistencia);
router.post("/reporte-uniforme", guardarReporteUniforme);

// Recuperación de contraseña
router.post("/recuperacion/codigo", solicitarCodigo);
router.post("/recuperacion/verificar", verificarCodigo);
router.post("/recuperacion/nueva", cambiarPassword);

module.exports = router;
