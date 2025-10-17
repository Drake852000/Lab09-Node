// app/utils/token.util.js
import crypto from "crypto";

export const generateRefreshTokenString = () => {
  return crypto.randomBytes(64).toString("hex"); // 128 hex chars
};
