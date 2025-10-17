import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div className="p-5 rounded-4 shadow-lg bg-white text-center" style={{ maxWidth: "420px", width: "90%" }}>
        <h1 className="mb-3 text-primary fw-bold">🏠 Bienvenido</h1>
        <p className="text-muted mb-4">
          Accede con tu cuenta o crea una nueva para comenzar a explorar la aplicación.
        </p>
        <div className="d-flex justify-content-center gap-3">
          <Link to="/login" className="btn btn-primary px-4">
            Iniciar sesión
          </Link>
          <Link to="/signup" className="btn btn-outline-success px-4">
            Registrarse
          </Link>
        </div>
      </div>
      <footer className="mt-4 text-muted small">
        © {new Date().getFullYear()} Tu Aplicación — Todos los derechos reservados
      </footer>
    </div>
  );
}
