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

  // GET /api/orders/user/:userId
  async getByUser(req: Request, res: Response) {
    try {
      const userId = Number(req.params.userId);
      if (Number.isNaN(userId)) {
        return res.status(400).json({ message: "Invalid userId" });
      }

      const orders = await orderService.getOrdersByUser(userId);

      // Map backend order shape to frontend expected shape
      const mapped = orders.map((o) => ({
        id: o.id,
        guest_name: o.user?.userName || "",
        guest_phone: (o.user && (o.user as any).phone) || "",
        guest_email: (o.user && (o.user as any).email) || "",
        user: o.user
          ? {
              id: (o.user as any).id,
              username: (o.user as any).username,
              phone: (o.user as any).phone,
              email: (o.user as any).email,
            }
          : null,
        shippingAddress: {
          // frontend expects object with city/street_name; provide best-effort mapping
          city: "",
          street_name: o.shippingAddress || "",
        },
        order_total: o.total,
        orderStatus: { id: 1, status: o.status } as any,
        orderDate: o.createdAt,
        items: o.items || [],
      }));

      return res.json(mapped);
    } catch (err: any) {
      console.error("Error fetching orders by user:", err);
      return res
        .status(500)
        .json({ message: err.message || "Internal server error" });
    }
  }

  // PUT /api/orders/:orderId/cancel
  async cancel(req: Request, res: Response) {
    try {
      const orderId = Number(req.params.orderId);
      if (Number.isNaN(orderId)) {
        return res.status(400).json({ message: "Invalid orderId" });
      }

      const updated = await orderService.cancelOrder(orderId);

      return res.json({ order: updated });
    } catch (err: any) {
      console.error("Error cancelling order:", err);
      return res
        .status(500)
        .json({ message: err.message || "Internal server error" });
    }
  }

  // PUT /api/orders/:orderId/status
  async updateStatus(req: Request, res: Response) {
    try {
      const orderId = Number(req.params.orderId);
      const { status } = req.body;
      if (Number.isNaN(orderId))
        return res.status(400).json({ message: "Invalid orderId" });
      if (!status || typeof status !== "string")
        return res.status(400).json({ message: "Invalid status" });

      const updated = await orderService.updateOrderStatus(orderId, status);

      // respond with order and orderStatus shape expected by frontend
      const resp = {
        order: {
          id: updated.id,
          orderStatus: { id: 1, status: updated.status },
        },
      };
      return res.json(resp);
    } catch (err: any) {
      console.error("Error updating order status:", err);
      return res
        .status(500)
        .json({ message: err.message || "Internal server error" });
    }
  }

  // ADMIN: list orders with pagination
  async adminList(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search =
        typeof req.query.search === "string" ? req.query.search : undefined;

      const { data, totalCount } = await orderService.listOrders(
        page,
        limit,
        search
      );

      // map to frontend-friendly shape
      const mapped = data.map((o) => ({
        id: o.id,
        user: o.user
          ? {
              id: (o.user as any).id,
              fullName: (o.user as any).username,
              username: (o.user as any).username,
              phone: (o.user as any).phone,
              email: (o.user as any).email,
            }
          : null,
        guest_name: (o.user as any)?.username || "",
        guest_email: (o.user as any)?.email || "",
        guest_phone: (o.user as any)?.phone || "",
        order_total: o.total,
        orderStatus: { id: 1, status: o.status } as any,
        orderDate: o.createdAt,
      }));

      return res.json({ data: mapped, totalCount });
    } catch (err: any) {
      console.error("Error admin listing orders:", err);
      return res
        .status(500)
        .json({ message: err.message || "Internal server error" });
    }
  }

  // ADMIN: delete order
  async adminDelete(req: Request, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id))
        return res.status(400).json({ message: "Invalid id" });
      await orderService.deleteOrder(id);
      return res.status(204).send();
    } catch (err: any) {
      console.error("Error deleting order:", err);
      return res
        .status(500)
        .json({ message: err.message || "Internal server error" });
    }
  }
  // GET /api/orders/:orderId
async getById(req: Request, res: Response) {
  try {
    const orderId = Number(req.params.orderId);
    if (Number.isNaN(orderId)) {
      return res.status(400).json({ message: "Invalid orderId" });
    }

    const order = await orderService.getOrderById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    return res.json(order);
  } catch (err: any) {
    console.error("Error fetching order by id:", err);
    return res.status(500).json({ message: err.message || "Internal server error" });
  }
}

}
