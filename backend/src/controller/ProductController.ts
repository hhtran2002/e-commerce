import { Request, Response } from "express";
import { ProductService } from "../service/ProductService";

const productService = new ProductService();

export class ProductController {
  // GET /api/products
  async getAllProducts(req: Request, res: Response) {
    try {
      const products = await productService.getAllProducts();
      return res.json(products);
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET /api/products/category/:categoryId  (1 category)
  async getByCategory(req: Request, res: Response) {
    const categoryId = Number(req.params.categoryId);
    if (isNaN(categoryId)) {
      return res.status(400).json({ message: "categoryId must be a number" });
    }

    try {
      const products = await productService.getProductsByCategory(categoryId);
      return res.json(products);
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // GET /api/products/categories?ids=1,5,6  (nhiều category)
  async getByCategories(req: Request, res: Response) {
    const raw = (req.query.ids as string) || "";

    const ids = raw
      .split(",")
      .map((v) => Number(v.trim()))
      .filter((v) => !isNaN(v));

    if (ids.length === 0) {
      return res.json([]);
    }

    try {
      const products = await productService.getProductsByCategories(ids);
      return res.json(products);
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
