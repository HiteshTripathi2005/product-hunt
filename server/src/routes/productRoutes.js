import express from "express";
import {
  getProducts,
  getProduct,
  createProduct,
  deleteProduct,
  toggleUpvote,
  getUserProducts,
  getUserUpvotedProducts,
  getCategories,
} from "../controllers/productController.js";
import auth from "../middleware/auth.js";
import { validateProduct } from "../middleware/validation.js";
import { upload } from "../utils/upload.js";

const router = express.Router();

router.get("/", getProducts);

router.get("/categories", getCategories);

router.get("/user/:userId", getUserProducts);

router.get("/user/:userId/upvoted", getUserUpvotedProducts);

router.get("/:id", getProduct);

router.post(
  "/",
  auth,
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  validateProduct,
  createProduct
);

router.delete("/:id", auth, deleteProduct);

router.post("/:id/upvote", auth, toggleUpvote);

export default router;
