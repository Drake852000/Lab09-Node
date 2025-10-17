import React from "react";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

export default function UserDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      <div
        className="card shadow-lg border-0 text-center p-5"
        style={{ maxWidth: "420px", width: "90%", borderRadius: "20px" }}
      >
        <div className="mb-3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="User Icon"
            width="90"
            className="mb-3"
          />
          <h2 className="fw-bold text-success mb-1">Panel de Usuario</h2>
          <p className="text-muted mb-4">
            Bienvenido, <strong>{user?.username}</strong>
          </p>
        </div>

        <div className="mb-4">
          <span className="badge bg-primary fs-6 px-3 py-2">Rol: Usuario</span>
        </div>

        <button
          onClick={logout}
          className="btn btn-danger btn-lg px-4 shadow-sm"
        >
          🔒 Cerrar Sesión
        </button>
      </div>

      <footer className="mt-4 text-muted small">
        © {new Date().getFullYear()} Tu Aplicación — Sesión Activa
      </footer>
    </div>
  );
}
