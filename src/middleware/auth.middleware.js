import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const auth = (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token)
      return res
        .status(401)
        .json({ message: "No token, autorización denegada." });

    jwt.verify(token, TOKEN_SECRET, (error, user) => {
      if (error) {
        return res.status(401).json({ message: "Token no valido." });
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};



export const verifyUpdateAccess = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json({ message: "Token no encontrado." });

    const decoded = await new Promise((resolve, reject) => {
      jwt.verify(token, TOKEN_SECRET, (err, decoded) => {
        if (err) reject(err);
        else resolve(decoded);
      });
    });

    if (decoded.id !== req.params.id) {
      return res.status(403).json({ message: "No tienes permiso para modificar este usuario." });
    }
    next();
  } catch (err) {
    console.error("Error de autenticación:", err);
    return res.status(401).json({ message: "Token inválido o expirado." });
  }
};
