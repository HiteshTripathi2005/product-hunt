import express from "express";
import {
  getProductComments,
  createComment,
  getUserComments,
} from "../controllers/commentController.js";
import auth from "../middleware/auth.js";
import { validateComment } from "../middleware/validation.js";

const router = express.Router();

router.get("/product/:productId", getProductComments);

router.get("/user/:userId", getUserComments);

router.post("/", auth, validateComment, createComment);

export default router;
