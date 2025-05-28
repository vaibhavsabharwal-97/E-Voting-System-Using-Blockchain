import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Middleware to verify JWT token
export const verifyToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ message: "No authentication token, access denied" });
    }
    
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    
    if (!verified) {
      return res.status(401).json({ message: "Token verification failed, authorization denied" });
    }
    
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token, access denied" });
  }
}; 