import { Router } from "express";
import { CategoryController } from "../controller/CategoryController";

const router = Router();
const categoryController = new CategoryController();

// GET /api/categories
router.get("/", (req, res) => categoryController.getAll(req, res));

// GET /api/categories/:id
router.get("/:id", (req, res) => categoryController.getById(req, res));

// POST /api/categories
router.post("/", (req, res) => categoryController.create(req, res));

// PUT /api/categories/:id
router.put("/:id", (req, res) => categoryController.update(req, res));

// DELETE /api/categories/:id
router.delete("/:id", (req, res) => categoryController.delete(req, res));

export default router;
