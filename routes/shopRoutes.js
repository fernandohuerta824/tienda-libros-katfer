import { Router } from "express";
import { index, addToCart } from "../controllers/shopControllers.js";

const router = Router();

router.get("/", index)
router.post("/add-to-cart", addToCart)

export default router;