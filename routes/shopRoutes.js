import { Router } from "express";
import { index, addToCart, viewBook } from "../controllers/shopControllers.js";

const router = Router();

router.get("/", index)
router.get("/book/:id", viewBook)
router.post("/add-to-cart", addToCart)

export default router;