import { Router } from "express";
import { ProductController } from "../controllers/ProductController";

const router = Router();
const productController = new ProductController();

router.get("/category/:categoryName", productController.getProductsByCategory);

export default router;
