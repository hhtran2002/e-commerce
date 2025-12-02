import { Router } from "express";
import { ProductController } from "../controller/ProductController";

const router = Router();
const productController = new ProductController();

router.get("/", (req, res) => productController.getAllProducts(req, res));
router.get("/category/:categoryId", (req, res) =>
  productController.getByCategory(req, res)
);
router.get("/categories", (req, res) =>
  productController.getByCategories(req, res)
);
router.get("/:id", (req, res) => productController.getById(req, res));

router.post("/", (req, res) => productController.create(req, res));
router.put("/:id", (req, res) => productController.update(req, res));
router.delete("/:id", (req, res) => productController.delete(req, res));

export default router;
