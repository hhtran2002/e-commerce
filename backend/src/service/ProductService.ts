import { AppDataSource } from "../config/data_source";
import { Product } from "../entity/Product";

export class ProductService {
  private productRepo = AppDataSource.getRepository(Product);

  // Lấy tất cả sản phẩm
  async getAllProducts() {
    return this.productRepo.find({
      relations: ["category", "items.images", "items.size", "items.color"],
    });
  }

  // Lấy sản phẩm theo 1 id category (dùng cho /products/category/:id)
  async getProductsByCategory(categoryId: number) {
    return this.productRepo.find({
      where: { category: { id: categoryId } },
      relations: ["category", "items.images", "items.size", "items.color"],
    });
  }

  // Lấy sản phẩm theo nhiều id category (dùng cho /products/categories?ids=1,5,6,...)
  async getProductsByCategories(ids: number[]) {
    if (!ids || ids.length === 0) {
      return [];
    }

    return this.productRepo.find({
      // TypeORM cho phép truyền mảng điều kiện trong where
      where: ids.map((id) => ({ category: { id } })),
      relations: ["category", "items.images", "items.size", "items.color"],
    });
  }
}
