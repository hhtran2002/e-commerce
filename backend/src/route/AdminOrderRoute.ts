import { Router } from "express";
import { OrderController } from "../controller/OrderController";

const router = Router();
const orderController = new OrderController();

// GET /admin/api/orders?page=&limit=&search=
router.get("/", (req, res) => orderController.adminList(req, res));

// DELETE /admin/api/orders/:id
router.delete("/:id", (req, res) => orderController.adminDelete(req, res));

export default router;
