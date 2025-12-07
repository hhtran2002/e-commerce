import { AppDataSource } from "../config/data_source";
import { Cart } from "../entity/Cart";
import { CartItem } from "../entity/CartItem";
import { User } from "../entity/User";
import { ProductItem } from "../entity/ProductItem";

export class CartService {
  private cartRepo = AppDataSource.getRepository(Cart);
  private cartItemRepo = AppDataSource.getRepository(CartItem);
  private userRepo = AppDataSource.getRepository(User);
  private productItemRepo = AppDataSource.getRepository(ProductItem);

  // Lấy hoặc tạo cart cho user
  private async getOrCreateCart(userId: number): Promise<Cart> {
    let cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ["user", "items", "items.product", "items.productItem"],
    });

    if (!cart) {
      const user = await this.userRepo.findOneBy({ id: userId });
      if (!user) {
        throw new Error("User not found");
      }

      cart = this.cartRepo.create({ user });
      await this.cartRepo.save(cart);
      cart.items = [];
    }

    return cart;
  }

  // Thêm sản phẩm vào giỏ
  async addToCart(userId: number, productItemId: number, quantity: number = 1) {
    if (quantity <= 0) {
      quantity = 1;
    }

    const cart = await this.getOrCreateCart(userId);

    // Lấy ProductItem kèm Product
    const productItem = await this.productItemRepo.findOne({
      where: { id: productItemId },
      relations: ["product"],
    });

    if (!productItem) {
      throw new Error("ProductItem not found");
    }

    // Lấy giá từ ProductItem (hoặc Product nếu bạn đang để ở đó)
    // Giả sử có field productItem.price là decimal
    const priceAt = String((productItem as any).price ?? 0); // sửa lại tên field cho đúng

    // Kiểm tra xem item đã có trong giỏ chưa
    let existingItem = cart.items?.find(
      (ci) => ci.productItem.id === productItemId
    );

    if (existingItem) {
      // update quantity
      existingItem.quantity += quantity;
      await this.cartItemRepo.save(existingItem);
    } else {
      // tạo mới cart item
      const newItem = this.cartItemRepo.create({
        cart,
        product: productItem.product,
        productItem,
        quantity,
        priceAt,
      });

      await this.cartItemRepo.save(newItem);
    }

    // trả về cart mới nhất
    const updatedCart = await this.cartRepo.findOne({
      where: { id: cart.id },
      relations: ["items", "items.product", "items.productItem"],
    });

    return updatedCart;
  }

  // Lấy giỏ hàng theo user
  async getCartByUser(userId: number) {
    const cart = await this.cartRepo.findOne({
      where: { user: { id: userId } },
      relations: ["items", "items.product", "items.productItem"],
    });
    return cart;
  }
}
