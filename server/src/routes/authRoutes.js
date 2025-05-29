import express from "express";
import {
  register,
  login,
  getMe,
  updateProfile,
  logout,
} from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

router.post("/register", upload.single("avatar"), register);

router.post("/login", login);

router.get("/me", auth, getMe);

router.put("/profile", auth, updateProfile);

router.post("/logout", logout);

export default router;
