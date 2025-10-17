import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav style={{ background: "#1e1e1e", padding: "10px", color: "white" }}>
      <Link to="/" style={{ marginRight: 10, color: "white" }}>Inicio</Link>
      {!user && (
        <>
          <Link to="/login" style={{ marginRight: 10, color: "white" }}>Login</Link>
          <Link to="/signup" style={{ color: "white" }}>Registro</Link>
        </>
      )}
      {user && (
        <>
          {user.roles.includes("ROLE_USER") && <Link to="/user" style={{ marginRight: 10, color: "white" }}>Zona Usuario</Link>}
          {user.roles.includes("ROLE_MODERATOR") && <Link to="/mod" style={{ marginRight: 10, color: "white" }}>Zona Moderador</Link>}
          {user.roles.includes("ROLE_ADMIN") && <Link to="/admin" style={{ marginRight: 10, color: "white" }}>Zona Admin</Link>}
          <button onClick={logout} style={{ marginLeft: 10 }}>Cerrar sesión</button>
        </>
      )}
    </nav>
  );
}
