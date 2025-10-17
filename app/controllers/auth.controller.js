// app/controllers/auth.controller.js

import db from "../models/index.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import authConfig from "../config/auth.config.js";
import { generateRefreshTokenString } from "../utils/token.util.js";

const { user: User, role: Role, refreshToken: RefreshToken } = db;

const ACCESS_TOKEN_EXPIRES = 15 * 60; // 15 minutos
const REFRESH_TOKEN_EXPIRES_DAYS = 7; // 7 días

// --- Registro de usuario ---
export const signUp = async (req, res) => {
  try {
    const { username, email, password, roles } = req.body;

    // Crear usuario
    const user = await User.create({
      username,
      email,
      password: bcrypt.hashSync(password, 8),
    });

    // Asignar roles
    if (roles && roles.length > 0) {
      const foundRoles = await Role.findAll({
        where: { name: roles },
      });
      await user.setRoles(foundRoles);
    } else {
      // Por defecto, asignar rol "user"
      const defaultRole = await Role.findOne({ where: { name: "user" } });
      await user.setRoles([defaultRole]);
    }

    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// --- Inicio de sesión ---
export const signIn = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { username: req.body.username },
      include: [{ model: Role, as: "roles" }],
    });

    if (!user) {
      return res.status(404).json({ message: "User Not Found." });
    }

    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).json({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    const token = jwt.sign({ id: user.id }, authConfig.secret, {
      expiresIn: ACCESS_TOKEN_EXPIRES,
    });

    const refreshTokenString = generateRefreshTokenString();
    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + REFRESH_TOKEN_EXPIRES_DAYS);

    await RefreshToken.create({
      token: refreshTokenString,
      userId: user.id,
      expiryDate,
    });

    const authorities = user.roles.map((role) => "ROLE_" + role.name.toUpperCase());

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      roles: authorities,
      accessToken: token,
      refreshToken: refreshTokenString,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Refrescar Access Token ---
export const refreshToken = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  if (!requestToken) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    const stored = await RefreshToken.findOne({ where: { token: requestToken } });

    if (!stored) {
      return res.status(403).json({ message: "Refresh token not found. Please sign in again." });
    }

    if (stored.expiryDate.getTime() < new Date().getTime()) {
      await RefreshToken.destroy({ where: { id: stored.id } });
      return res.status(403).json({
        message: "Refresh token was expired. Please sign in again.",
      });
    }

    const userId = stored.userId;
    const newAccessToken = jwt.sign({ id: userId }, authConfig.secret, {
      expiresIn: ACCESS_TOKEN_EXPIRES,
    });

    return res.status(200).json({
      accessToken: newAccessToken,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

// --- Cerrar sesión ---
export const signOut = async (req, res) => {
  const { refreshToken: requestToken } = req.body;

  try {
    if (requestToken) {
      await RefreshToken.destroy({ where: { token: requestToken } });
    } else if (req.body.userId) {
      await RefreshToken.destroy({ where: { userId: req.body.userId } });
    }
    res.status(200).json({ message: "You have been signed out." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
