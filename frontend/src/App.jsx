// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useAuth, AuthProvider } from "./context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./pages/Login";
import Signup from "./pages/Signup"; // Usamos el componente real

function Home() {
  return (
    <div className="container text-center mt-5">
      <div className="card shadow-lg p-4 mx-auto" style={{ maxWidth: "500px" }}>
        <h1 className="mb-3">🏠 Bienvenido a la Aplicación</h1>
        <p>Selecciona una opción:</p>
        <Link className="btn btn-primary m-2" to="/login">
          Iniciar Sesión
        </Link>
        <Link className="btn btn-success m-2" to="/signup">
          Registrarse
        </Link>
      </div>
    </div>
  );
}

function Dashboard({ role }) {
  const { user, logout } = useAuth();

  const roleNames = {
    ROLE_USER: "Usuario",
    ROLE_MODERATOR: "Moderador",
    ROLE_ADMIN: "Administrador",
  };

  return (
    <div className="container mt-5 d-flex justify-content-center">
      <div className="card shadow-lg p-4 rounded-4" style={{ maxWidth: "450px", width: "100%" }}>
        <h2 className="text-center mb-3">
          {role === "ROLE_USER" && "👤 Panel de Usuario"}
          {role === "ROLE_MODERATOR" && "🛠 Panel de Moderador"}
          {role === "ROLE_ADMIN" && "🧑‍💼 Panel de Administrador"}
        </h2>
        <p className="text-center mb-1">
          Bienvenido, <strong>{user?.username}</strong>
        </p>
        <p className="text-center text-muted">
          Has iniciado sesión como <b>{roleNames[role]}</b>.
        </p>
        <div className="text-center mt-3">
          <button
            className="btn btn-danger btn-lg px-4 shadow-sm"
            onClick={() => {
              logout();
              window.location.href = "/login";
            }}
          >
            🔒 Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/">
              🌐 Mi App
            </Link>
            <div>
              <Link className="btn btn-outline-light me-2" to="/">
                Inicio
              </Link>
              <Link className="btn btn-outline-light me-2" to="/login">
                Login
              </Link>
              <Link className="btn btn-outline-light" to="/signup">
                Registro
              </Link>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} /> {/* Aquí usamos el componente real */}
          <Route path="/user" element={<Dashboard role="ROLE_USER" />} />
          <Route path="/moderator" element={<Dashboard role="ROLE_MODERATOR" />} />
          <Route path="/admin" element={<Dashboard role="ROLE_ADMIN" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
