import express from "express";
import {
  adminLogin,
  getAdminProfile,
  adminLogout,
  getAllUsers,
  getAllProducts,
  updateProductStatus,
  deleteProductAdmin,
  getDashboardStats,
} from "../controllers/adminController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// Public routes
router.post("/login", adminLogin);

// Protected routes (admin only)
router.get("/profile", adminAuth, getAdminProfile);
router.post("/logout", adminAuth, adminLogout);
router.get("/dashboard/stats", adminAuth, getDashboardStats);
router.get("/users", adminAuth, getAllUsers);
router.get("/products", adminAuth, getAllProducts);
router.put("/products/:id/status", adminAuth, updateProductStatus);
router.delete("/products/:id", adminAuth, deleteProductAdmin);

export default router;
