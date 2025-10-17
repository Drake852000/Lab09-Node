// server.js

// Importa Express para crear la aplicación web
import express from "express";

// Importa CORS para permitir solicitudes desde otros dominios (por ejemplo, desde el frontend)
import cors from "cors";

// Importa los modelos y configuración de Sequelize (ORM para la base de datos)
import db from "./app/models/index.js";

// Importa las rutas de autenticación (signup, signIn)
import authRoutes from "./app/routes/auth.routes.js";

// Importa las rutas protegidas por roles de usuario
import userRoutes from "./app/routes/user.routes.js";

// Módulos adicionales para servir el frontend
import path from "path";
import { fileURLToPath } from "url";

// Configura Express
const app = express();

// Configuración de CORS (usa solo para desarrollo local)
const corsOptions = {
  origin: "http://localhost:3001",
  credentials: true,
};
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas del backend
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the Node.js JWT Authentication API." });
});

app.use("/api/auth", authRoutes);
app.use("/api/test", userRoutes);

// Sincroniza la base de datos
db.sequelize.sync({ force: false }).then(() => {
  console.log("Database synchronized");
});

// ===============================
// 🧩 CONFIGURAR FRONTEND (React)
// ===============================

// Variables necesarias para rutas
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos del frontend (React build)
app.use(express.static(path.join(__dirname, "frontend", "build")));

// Cualquier ruta que no sea API responderá con el index.html del frontend
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

// ===============================
// 🚀 Iniciar el servidor
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}.`);
});
