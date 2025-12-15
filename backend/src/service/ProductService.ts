import { AppDataSource } from "../config/data_source";
import { Product } from "../entity/Product";
import { ProductItem } from "../entity/ProductItem";
import { Image } from "../entity/Image";

export class ProductService {
  private productRepo = AppDataSource.getRepository(Product);
  private productItemRepo = AppDataSource.getRepository(ProductItem);
  private imageRepo = AppDataSource.getRepository(Image);

  // Lấy tất cả sản phẩm
  async getAllProducts() {
    return this.productRepo.find({
      relations: ["category", "items.images", "items.size", "items.color"],
    });
  }

  // Lấy sản phẩm theo 1 id category
  async getProductsByCategory(categoryId: number) {
    return this.productRepo.find({
      where: { category: { id: categoryId } },
      relations: ["category", "items.images", "items.size", "items.color"],
    });
  }

  // Lấy sản phẩm theo nhiều id category
  async getProductsByCategories(ids: number[]) {
    if (!ids || ids.length === 0) {
      return [];
    }

    return this.productRepo.find({
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

  // =============== CREATE PRODUCT + ẢNH ===============
  async createProduct(data: {
    name: string;
    price: number | string;
    categoryId: number;
    stockQuantity: number;
    description?: string | null;
    imageUrls?: string[];
  }) {
    // 1. Tạo product
    const product = new Product();
    product.name = data.name;
    product.price = data.price.toString();
    // chỉ cần gán id cho category
    product.category = { id: data.categoryId } as any;
    product.stockQuantity = data.stockQuantity;
    product.description = (data.description ?? null) as any;

    const savedProduct = await this.productRepo.save(product);

    // 2. Tạo 1 ProductItem "default" để gắn ảnh
    const item = new ProductItem();
    item.product = savedProduct;
    // chưa dùng size / color => để null
    const savedItem = await this.productItemRepo.save(item);

    // 3. Tạo các Image nếu có imageUrls
    const urls = data.imageUrls ?? [];
    if (urls.length > 0) {
      const imagesEntities = urls.map((url) => {
        const img = new Image();
        img.imageUrl = url;
        img.productItem = savedItem;
        return img;
      });
      await this.imageRepo.save(imagesEntities);
    }

    // 4. Trả về product đầy đủ relations
    return this.getProductById(savedProduct.id);
  }

  // =============== UPDATE PRODUCT + ẢNH ===============
  async updateProduct(
    id: number,
    data: {
      name?: string;
      price?: number | string;
      categoryId?: number;
      stockQuantity?: number;
      description?: string | null;
      imageUrls?: string[];
    }
  ) {
    // load kèm items & images để xử lý ảnh
    const product = await this.productRepo.findOne({
      where: { id },
      relations: ["items.images"],
    });

    if (!product) return null;

    // cập nhật field cơ bản
    if (data.name !== undefined) product.name = data.name;
    if (data.price !== undefined) product.price = data.price.toString();
    if (data.categoryId !== undefined) {
      product.category = { id: data.categoryId } as any;
    }
    if (data.stockQuantity !== undefined) {
      product.stockQuantity = data.stockQuantity;
    }
    if ("description" in data) {
      product.description = (data.description ?? null) as any;
    }

    const savedProduct = await this.productRepo.save(product);

    // xử lý ảnh nếu truyền imageUrls
    if (data.imageUrls) {
      const urls = data.imageUrls;

      // lấy item đầu tiên, nếu chưa có thì tạo
      let item = product.items?.[0];
      if (!item) {
        const newItem = new ProductItem();
        newItem.product = savedProduct;
        item = await this.productItemRepo.save(newItem);
      }

      // xóa toàn bộ ảnh cũ của item này
      await this.imageRepo.delete({ productItem: { id: item.id } as any });

      // thêm ảnh mới
      if (urls.length > 0) {
        const imgEntities = urls.map((url) => {
          const img = new Image();
          img.imageUrl = url;
          img.productItem = item!;
          return img;
        });
        await this.imageRepo.save(imgEntities);
      }
    }

    // trả về product đã cập nhật đầy đủ
    return this.getProductById(savedProduct.id);
  }

  async deleteProduct(id: number) {
    await this.productRepo.delete(id);
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
