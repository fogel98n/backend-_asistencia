const express = require("express");
const router = express.Router();

const { login } = require("../controllers/logincontroller");
const { register } = require("../controllers/registrocontroller");
const { niveles_educativos } = require("../controllers/niveles_educativoController");
const { grados } = require("../controllers/gradoscontroller");
const { alumnos, agregarAlumno } = require("../controllers/alumnos");
const { registrarAsistencia } = require("../controllers/asitencia");
const{guardarReporteUniforme}=require("../controllers/uniforme")
const{maestros}=require("../controllers/maestros")

const {
  solicitarCodigo,
  verificarCodigo,
  cambiarPassword
} = require("../controllers/recuperacion");

router.post("/login_asistencia", login);
router.post("/registro", register);
router.get("/niveles_educativos", niveles_educativos);
router.get("/grados", grados);
router.get("/alumnos", alumnos);
router.get("/maestros",maestros)

router.post("/reporte-uniforme", guardarReporteUniforme);
router.post("/asistencia", registrarAsistencia);
router.post("/recuperacion/codigo", solicitarCodigo);
router.post("/recuperacion/verificar", verificarCodigo);
router.post("/recuperacion/nueva", cambiarPassword);
router.post("/alumnosRegistro", agregarAlumno);

module.exports = router;
