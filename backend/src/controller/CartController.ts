import { Request, Response } from "express";
import { CartService } from "../service/CartService";

const cartService = new CartService();

export class CartController {
  // POST /api/cart/add
  async addToCart(req: Request, res: Response) {
    try {
      const userId = Number(req.body.userId);
      const productItemId = Number(req.body.productItemId);
      const quantity = Number(req.body.quantity ?? 1);

      if (!userId || !productItemId) {
        return res.status(400).json({ message: "userId và productItemId là bắt buộc" });
      }

      const cart = await cartService.addToCart(userId, productItemId, quantity);
      return res.json(cart);
    } catch (err: any) {
      console.error("Error addToCart:", err);
      return res.status(500).json({ message: err.message || "Internal server error" });
    }
  }

  // GET /api/cart/my
  async getMyCart(req: Request, res: Response) {
    try {
      const userId = Number(req.query.userId || req.params.userId);
      if (!userId) {
        return res.status(400).json({ message: "userId is required" });
      }

      const cart = await cartService.getCartByUser(userId);
      return res.json(cart || { items: [] });
    } catch (err: any) {
      console.error("Error getMyCart:", err);
      return res.status(500).json({ message: err.message || "Internal server error" });
    }
  }
}
