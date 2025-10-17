// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Recuperar refreshToken del LocalStorage al cargar la app
  useEffect(() => {
    const storedRefresh = localStorage.getItem("refreshToken");
    if (storedRefresh) refreshAccessToken(storedRefresh);
  }, []);

  // Login (guardar tokens)
  const login = async (username, password) => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/signin", {
        username,
        password,
      });

      setUser(res.data);
      setAccessToken(res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      return res.data;
    } catch (error) {
      console.error("Error al iniciar sesión", error);
      throw error;
    }
  };

  // Cerrar sesión
  const logout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      await axios.post("http://localhost:8080/api/auth/signout", { refreshToken });
      localStorage.removeItem("refreshToken");
    }
    setUser(null);
    setAccessToken(null);
  };

  // Refrescar token cuando expire
  const refreshAccessToken = async (refreshToken) => {
    try {
      const res = await axios.post("http://localhost:3001/api/auth/refreshtoken", { refreshToken });
      setAccessToken(res.data.accessToken);
      return res.data.accessToken;
    } catch (error) {
      console.error("No se pudo refrescar el token:", error);
      logout(); // si falla, cerrar sesión
    }
  };

  // Axios interceptor para renovar token automáticamente
  useEffect(() => {
    const interceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          const refreshToken = localStorage.getItem("refreshToken");
          if (refreshToken) {
            const newAccessToken = await refreshAccessToken(refreshToken);
            if (newAccessToken) {
              originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
              return axios(originalRequest);
            }
          }
        }
        return Promise.reject(error);
      }
    );
    return () => axios.interceptors.response.eject(interceptor);
  }, []);

  return (
    <AuthContext.Provider value={{ user, accessToken, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
