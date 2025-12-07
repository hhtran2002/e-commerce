import { Request, Response } from "express";
import { OrderService } from "../service/OrderService";

const orderService = new OrderService();

export class OrderController {
  // POST /api/orders
  async create(req: Request, res: Response) {
    try {
      const { userId, shippingAddress, items } = req.body;

      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }
      if (!shippingAddress) {
        return res.status(400).json({ message: "shippingAddress is required" });
      }
      if (!items || !Array.isArray(items) || items.length === 0) {
        return res.status(400).json({ message: "items is required" });
      }

      const order = await orderService.createOrder({
        userId,
        shippingAddress,
        items,
      });

      return res.status(201).json(order);
    } catch (err: any) {
      console.error("Error creating order:", err);
      return res
        .status(500)
        .json({ message: err.message || "Internal server error" });
    }
  }
}
