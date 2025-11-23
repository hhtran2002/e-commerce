import { Request, Response } from "express";
import { ProductService } from "../services/ProductService";

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();

    this.getProductsByCategory = this.getProductsByCategory.bind(this);
  }

  async getProductsByCategory(req: Request, res: Response) {
    try {
      const categoryName = req.params.categoryName;

      // Validate: kiểm tra xem categoryName có hợp lệ không (ví dụ: không chứa ký tự đặc biệt)
      if (!/^[a-zA-Z0-9-]+$/.test(categoryName)) {
        return res.status(400).json({ message: "Tên danh mục không hợp lệ" });
      }

      if (!categoryName) {
        return res.status(400).json({ message: "Tên danh mục là bắt buộc" });
      }

      const products = await this.productService.getProductsByCategory(
        categoryName
      );

      return res.status(200).json(products);
    } catch (error) {
      console.error("Lỗi khi lấy sản phẩm theo danh mục:", error);
      return res.status(500).json({ message: "Đã xảy ra lỗi server" });
    }
  }
}
