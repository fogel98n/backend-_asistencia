const express = require("express");
const router = express.Router();

const { login } = require("../controllers/logincontroller");
const { register } = require("../controllers/registrocontroller");
const { niveles_educativos } = require("../controllers/niveles_educativoController");
const { grados, gradosPorNivel, gradoPorId } = require("../controllers/gradoscontroller");
const { alumnos, agregarAlumno, eliminarAlumno } = require("../controllers/alumnos");
const {registrarAsistencia,obtenerAsistencias } = require("../controllers/asitencia");
const { guardarReporteUniforme } = require("../controllers/uniforme");
const { maestros, eliminarMaestro } = require("../controllers/maestros");
const {solicitarCodigo,verificarCodigo,cambiarPassword} = require("../controllers/recuperacion");

// Rutas de autenticación
router.post("/login_asistencia", login);
router.post("/registro", register);

// Rutas de niveles y grados
router.get("/niveles_educativos", niveles_educativos);
router.get("/grados", grados);
router.get("/grados/nivel/:idNivel", gradosPorNivel);
router.get("/grados/id/:idGrado", gradoPorId);

// Rutas de maestros
router.get("/maestros", maestros);
router.delete("/maestros/:id", eliminarMaestro);

// Rutas de alumnos
router.get("/alumnos", alumnos);
router.post("/alumnosRegistro", agregarAlumno);
router.delete("/alumnos/:id", eliminarAlumno);

//  Rutas de asistencia
router.post("/asistencia", registrarAsistencia);
router.get("/asistencia", obtenerAsistencias); 

// Rutas de reportes
router.post("/reporte-uniforme", guardarReporteUniforme);

// Rutas de recuperación de contraseña
router.post("/recuperacion/codigo", solicitarCodigo);
router.post("/recuperacion/verificar", verificarCodigo);
router.post("/recuperacion/nueva", cambiarPassword);

module.exports = router;
