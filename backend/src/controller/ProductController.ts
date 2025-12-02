// src/controller/ProductController.ts
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

  // GET /api/products/category/:categoryId
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

  // GET /api/products/categories?ids=1,5,6
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

  // GET /api/products/:id
  async getById(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "id must be a number" });
    }

    try {
      const product = await productService.getProductById(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      return res.json(product);
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // POST /api/products
  async create(req: Request, res: Response) {
    try {
      const {
        name,
        price,
        stockQuantity,
        categoryId,
        description,
        images,
      } = req.body;

      // đảm bảo imageUrls luôn là string[]
      const imageUrls: string[] = Array.isArray(images)
        ? (images as string[])
        : [];

      const product = await productService.createProduct({
        name,
        price,
        stockQuantity,
        categoryId,
        description,
        imageUrls,
      });

      return res.status(201).json(product);
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // PUT /api/products/:id
  async update(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "id must be a number" });
    }

    // Chuẩn hóa imageUrls: hoặc là string[], hoặc bỏ luôn field
    let imageUrls: string[] | undefined = undefined;

    if (Array.isArray(req.body.images)) {
      imageUrls = req.body.images as string[];
    }

    try {
      const updated = await productService.updateProduct(id, {
        name: req.body.name,
        price: req.body.price,
        stockQuantity: req.body.stockQuantity,
        categoryId: req.body.categoryId,
        description: req.body.description ?? null,
        ...(imageUrls ? { imageUrls } : {}),
      });

      if (!updated) {
        return res.status(404).json({ message: "Product not found" });
      }

      return res.json(updated);
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  // DELETE /api/products/:id
  async delete(req: Request, res: Response) {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "id must be a number" });
    }

    try {
      await productService.deleteProduct(id);
      return res.status(204).send();
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
