import Admin from "../models/Admin.js";
import { verifyToken } from "../utils/jwt.js";

const adminAuth = async (req, res, next) => {
  try {
    let token = null;
    token =
      req.header("Authorization")?.replace("Bearer ", "") ||
      req.cookies.adminToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No admin token provided.",
      });
    }

    try {
      const decoded = verifyToken(token);

      const admin = await Admin.findById(decoded.id).select("-password");

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: "Admin not found. Access denied.",
        });
      }

      req.user = admin;
      next();
    } catch (jwtError) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin token.",
      });
    }
  } catch (error) {
    console.error("Admin auth middleware error:", error);
    res.status(500).json({
      success: false,
      message: "Server error in admin authentication",
    });
  }
};

export default adminAuth;
