import { AppDataSource } from "../config/data_source";
import { Order } from "../entity/Order";
import { OrderItem } from "../entity/OrderItem";
import { User } from "../entity/User";

type CreateOrderItemInput = {
  quantity: number;
  price: number;
};

type CreateOrderInput = {
  userId: number;
  shippingAddress: string;
  items: CreateOrderItemInput[];
};

export class OrderService {
  private orderRepo = AppDataSource.getRepository(Order);
  private orderItemRepo = AppDataSource.getRepository(OrderItem);
  private userRepo = AppDataSource.getRepository(User);

  async createOrder(input: CreateOrderInput): Promise<Order> {
    const { userId, shippingAddress, items } = input;

    if (!items || items.length === 0) {
      throw new Error("Order items is empty");
    }

    // 1. Tìm user
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) {
      throw new Error("User not found");
    }

    // 2. Tính total
    let totalNumber = 0;
    for (const it of items) {
      const price = Number(it.price) || 0;
      const qty = Number(it.quantity) || 0;
      totalNumber += price * qty;
    }

    // 3. Tạo order
    const order = this.orderRepo.create({
      user,
      shippingAddress,
      status: "PENDING",
      total: totalNumber.toFixed(2),
    });

    await this.orderRepo.save(order);

    // 4. Tạo order items
    const orderItemsToSave: OrderItem[] = [];

    for (const it of items) {
      const priceNum = Number(it.price) || 0;
      const qtyNum = Number(it.quantity) || 0;

      const orderItem = this.orderItemRepo.create({
        order,
        quantity: qtyNum,
        price: priceNum.toFixed(2),
        totalPrice: (priceNum * qtyNum).toFixed(2),
      });

      orderItemsToSave.push(orderItem);
    }

    await this.orderItemRepo.save(orderItemsToSave);

    // 5. Load lại order kèm items
    const savedOrder = await this.orderRepo.findOne({
      where: { id: order.id },
      relations: ["user", "items"],
    });

    if (!savedOrder) {
      throw new Error("Order not found after save");
    }

    return savedOrder;
  }

  async getOrdersByUser(userId: number): Promise<Order[]> {
    return this.orderRepo.find({
      where: { user: { id: userId } },
      relations: ["user", "items"],
      order: { createdAt: "DESC" } as any,
    });
  }

  async getAllOrders(): Promise<Order[]> {
    return this.orderRepo.find({
      relations: ["user", "items"],
      order: { createdAt: "DESC" } as any,
    });
  }

  async listOrders(
    page = 1,
    limit = 10,
    search?: string
  ): Promise<{ data: Order[]; totalCount: number }> {
    const qb = this.orderRepo
      .createQueryBuilder("order")
      .leftJoinAndSelect("order.user", "user")
      .leftJoinAndSelect("order.items", "items");

    if (search) {
      const like = `%${search}%`;
      // If search is numeric, also allow searching by order id
      if (!Number.isNaN(Number(search))) {
        qb.where("order.id = :id", { id: Number(search) });
      } else {
        qb.where("user.username LIKE :like OR user.email LIKE :like", { like });
      }
    }

    const totalCount = await qb.getCount();

    const data = await qb
      .orderBy("order.createdAt", "DESC")
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return { data, totalCount };
  }

  async deleteOrder(orderId: number): Promise<void> {
    await this.orderRepo.delete({ id: orderId });
  }

  async updateOrderStatus(orderId: number, status: string): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ["user", "items"],
    });
    if (!order) throw new Error("Order not found");
    order.status = status;
    await this.orderRepo.save(order);
    return order;
  }

  async cancelOrder(orderId: number): Promise<Order> {
    const order = await this.orderRepo.findOne({
      where: { id: orderId },
      relations: ["user", "items"],
    });
    if (!order) throw new Error("Order not found");

    order.status = "CANCELLED";
    await this.orderRepo.save(order);
    return order;
  }

  async getOrderById(orderId: number): Promise<Order | null> {
  return this.orderRepo.findOne({
    where: { id: orderId },
    relations: ["user", "items"],
  });
}

}

