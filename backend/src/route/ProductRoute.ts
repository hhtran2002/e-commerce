import { Router } from "express";
import { ProductController } from "../controller/ProductController";

const router = Router();
const productController = new ProductController();

// GET /api/products
router.get("/", (req, res) => productController.getAllProducts(req, res));

// GET /api/products/category/:categoryId  (1 category)
router.get("/category/:categoryId", (req, res) =>
  productController.getByCategory(req, res)
);

// GET /api/products/categories?ids=1,5,6  (nhiều category)
router.get("/categories", (req, res) =>
  productController.getByCategories(req, res)
);

export default router;
