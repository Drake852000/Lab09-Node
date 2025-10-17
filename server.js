// server.js

// ===============================
// 📦 Importaciones
// ===============================
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import db from "./app/models/index.js";
import authRoutes from "./app/routes/auth.routes.js";
import userRoutes from "./app/routes/user.routes.js";

// ===============================
// ⚙️ Configuración base
// ===============================
const app = express();

const corsOptions = {
  origin: "http://localhost:3001", // solo para desarrollo local
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// 🧩 Rutas del backend
// ===============================
app.get("/api", (req, res) => {
  res.json({ message: "Welcome to the Node.js JWT Authentication API." });
});

app.use("/api/auth", authRoutes);
app.use("/api/test", userRoutes);

// ===============================
// 🗄️ Base de datos
// ===============================
db.sequelize
  .sync({ force: false })
  .then(() => console.log("✅ Database synchronized"))
  .catch((err) => console.error("❌ Error syncing database:", err));

// ===============================
// 🌐 Servir frontend (React)
// ===============================
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Servir archivos estáticos del build de React
app.use(express.static(path.join(__dirname, "frontend", "build")));

// Cualquier ruta no manejada por el backend devuelve index.html
app.use((req, res) => {
  res.sendFile(path.join(__dirname, "frontend", "build", "index.html"));
});

// ===============================
// 🚀 Iniciar servidor
// ===============================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}.`);
});
