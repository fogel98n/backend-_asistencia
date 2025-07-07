const express = require("express");
const cors = require("cors");
const routes = require("./api/endpoints");

const app = express();
const port = 3000;

const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
  "http://127.0.0.1:5501",
  "http://localhost:5501",
  "https://fogel98n.github.io",                     
  "https://fogel98n.github.io/asistencia-2025/",    
];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Origen no permitido por CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use("/", routes);

app.listen(port, () => {
  console.log(`Servidor API corriendo en el puerto ${port}`);
});
