// ESM auth middleware
import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  try {
    const bearer = req.headers.authorization?.split(" ")[1];
    const token = req.cookies?.token || bearer;
    if (!token) return res.status(401).json({ message: "Access token missing" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role }
    next();
  } catch {
    res.status(403).json({ message: "Invalid or expired token" });
  }
}

export const authenticateToken = (req, res, next) => {
  try {
    const bearer = req.headers.authorization?.split(" ")[1];
    const token = req.cookies?.token || bearer;
    if (!token) return res.status(401).json({ error: "Access token missing" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { id, role }
    next();
  } catch {
    res.status(403).json({ error: "Invalid or expired token" });
  }
};

export const authorizeRoles = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "User not authenticated" });
  }
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: "User does not have permission to access this resource" });
  }
  next();
};
