import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !password) {
      setError("Por favor ingresa usuario y contraseña");
      return;
    }

    try {
      const res = await axios.post("http://localhost:3000/api/auth/signin", {
        username,
        password,
      });

      const { accessToken, refreshToken, roles } = res.data;

      // Guardamos el refreshToken en localStorage
      localStorage.setItem("refreshToken", refreshToken);

      // Guardamos el accessToken en memoria (puedes usar context si ya lo tienes)
      sessionStorage.setItem("accessToken", accessToken);

      // Redirige según el rol del usuario
      if (roles.includes("ROLE_ADMIN")) {
        navigate("/admin");
      } else if (roles.includes("ROLE_MODERATOR")) {
        navigate("/moderator");
      } else if (roles.includes("ROLE_USER")) {
        navigate("/user");
      } else {
        setError("Rol desconocido o sin permisos.");
      }
    } catch (err) {
      console.error(err);
      setError("Error al iniciar sesión. Verifica tus credenciales.");
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: "400px" }}>
      <h2 className="text-center mb-4">🔐 Iniciar Sesión</h2>
      {error && (
        <div className="alert alert-danger text-center py-2">{error}</div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Usuario</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Ingrese su usuario"
          />
        </div>
        <div className="form-group mb-3">
          <label>Contraseña</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Ingresar
        </button>
      </form>
    </div>
  );
}
