import React from "react";
import { useAuth } from "../context/AuthContext";
import "bootstrap/dist/css/bootstrap.min.css";

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <h2 className="text-center text-primary">Panel de Administrador</h2>
        <p className="text-center">Bienvenido, <strong>{user?.username}</strong></p>
        <p className="text-center">Has iniciado sesión como <b>Administrador</b>.</p>
        <div className="text-center">
          <button className="btn btn-danger" onClick={logout}>
            Cerrar Sesión
          </button>
        </div>
      </div>
    </div>
  );
}
