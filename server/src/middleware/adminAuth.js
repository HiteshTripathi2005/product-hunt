import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";

const adminAuth = async (req, res, next) => {
  try {
    let token = null;

    // Get token from cookie or Authorization header
    if (req.cookies.adminToken) {
      token = req.cookies.adminToken;
    } else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No admin token provided.",
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get admin from database
      const admin = await Admin.findById(decoded.id).select("-password");

      if (!admin) {
        return res.status(401).json({
          success: false,
          message: "Admin not found. Access denied.",
        });
      }

      // Add admin to request object
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
