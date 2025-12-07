import { Router } from "express";
import { CartController } from "../controller/CartController";

const router = Router();
const cartController = new CartController();

router.post("/add", (req, res) => cartController.addToCart(req, res));
router.get("/my", (req, res) => cartController.getMyCart(req, res));

export default router;
