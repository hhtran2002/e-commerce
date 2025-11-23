import { AppDataSource } from "../config/data_source";
import { Product } from "../entity/Product";

export class ProductService {
  private productRepository = AppDataSource.getRepository(Product);

  /**
   *
   * @param
   * @returns
   */
  async getProductsByCategory(categoryName: string) {
    // Tối ưu: chỉ lấy các trường cần thiết, sử dụng lazy loading nếu có thể
    const products = await this.productRepository.find({
      where: {
        category: {
          name: categoryName,
        },
      },
      select: {
        id: true,
        name: true,
        description: true,
        price: true,
        // Thêm các trường khác của Product mà bạn cần
        category: {
          id: true,
          name: true,
        },
        images: {
          id: true,
          url: true,
          // chỉ lấy url của ảnh
        },
      },
      relations: [
        "category", // eager load category vì có thể cần dùng luôn
        "productItems",
        "productItems.size",
        "productItems.color",
      ],
    });

    return products;
  }
}
