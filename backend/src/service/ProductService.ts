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

  async getProductById(id: number) {
    return this.productRepo.findOne({
      where: { id },
      relations: ["category", "items.images", "items.size", "items.color"],
    });
  }
  

  // Phần code liên quan đến chatbot và embedding
  // tinh toan do tuong dong giua vector
  private cosineSimilarity(vecA: number[], vecB: number[]) {
    const dotProduct = vecA.reduce((acc, val, i) => acc + val * (vecB[i] ?? 0), 0);
    // Giả sử vector từ Gemini đã được normalized nên không cần chia độ dài
    return dotProduct;
  }

  async searchHybrid(criteria: {
    categoryName?: string;
    colorName?: string;
    sizeName?: string;
    keyword?: string;
    userQueryEmbedding?: number[];
  }) {
    const query = this.productRepo.createQueryBuilder("product");

    // Join bảng
    query
      .leftJoinAndSelect("product.category", "category")
      .leftJoinAndSelect("product.items", "item")
      .leftJoinAndSelect("item.color", "color")
      .leftJoinAndSelect("item.size", "size")
      .addSelect("product.embedding"); // Cần lấy field này để so sánh

    // Filter SQL (Lọc cứng)
    if (criteria.categoryName) query.andWhere("category.name LIKE :cat", { cat: `%${criteria.categoryName}%` });
    if (criteria.colorName) query.andWhere("color.name LIKE :col", { col: `%${criteria.colorName}%` });
    if (criteria.sizeName) query.andWhere("size.name = :size", { size: criteria.sizeName });
    if (criteria.keyword) query.andWhere("product.name LIKE :kw", { kw: `%${criteria.keyword}%` });

    query.andWhere("product.stockQuantity > 0");

    // Lấy danh sách (Lấy dư ra 20 cái để sort lại bằng AI)
    let products = await query.take(20).getMany();

    // Sắp xếp lại bằng Vector (Semantic Search)
    if (criteria.userQueryEmbedding && products.length > 0) {
      const ranked = products.map(p => {
        const score = p.embedding ? this.cosineSimilarity(p.embedding, criteria.userQueryEmbedding!) : -1;
        return { product: p, score };
      });

      // Sort điểm cao xuống thấp
      ranked.sort((a, b) => b.score - a.score);
      products = ranked.map(x => x.product);
    }

    // Trả về top 5, xóa field embedding cho nhẹ response
    return products.slice(0, 5).map(p => { delete p.embedding; return p; });
  }
}
