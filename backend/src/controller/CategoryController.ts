import { Request, Response } from "express";
import { CategoryService } from "../service/CategoryService";

const categoryService = new CategoryService();

export class CategoryController {
  // GET /api/categories
  async getAll(req: Request, res: Response) {
    try {
      const cats = await categoryService.getAll();
      return res.json(cats);
    } catch (err) {
      console.error("Error getAll categories:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET /api/categories/:id
  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "id must be a number" });
    }

    try {
      const cat = await categoryService.getById(id);
      if (!cat) return res.status(404).json({ message: "Category not found" });
      return res.json(cat);
    } catch (err) {
      console.error("Error getById category:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // POST /api/categories
  async create(req: Request, res: Response) {
    const { name, description, parentId } = req.body;

    if (!name) {
      return res.status(400).json({ message: "name is required" });
    }

    try {
      const cat = await categoryService.create({ name, description, parentId });
      return res.status(201).json(cat);
    } catch (err) {
      console.error("Error create category:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // PUT /api/categories/:id
  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "id must be a number" });
    }

    const { name, description, parentId } = req.body;

    try {
      const cat = await categoryService.update(id, { name, description, parentId });
      if (!cat) return res.status(404).json({ message: "Category not found" });
      return res.json(cat);
    } catch (err) {
      console.error("Error update category:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // DELETE /api/categories/:id
  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "id must be a number" });
    }

    try {
      await categoryService.delete(id);
      return res.status(204).send();
    } catch (err) {
      console.error("Error delete category:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
