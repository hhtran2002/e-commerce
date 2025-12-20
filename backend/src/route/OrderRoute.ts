import { Router } from "express";
import { OrderController } from "../controller/OrderController";

const router = Router();
const orderController = new OrderController();

router.post("/", (req, res) => orderController.create(req, res));

router.get("/user/:userId", (req, res) => orderController.getByUser(req, res));

router.put("/:orderId/cancel", (req, res) => orderController.cancel(req, res));

router.put("/:orderId/status", (req, res) =>
  orderController.updateStatus(req, res)
);

router.get("/:orderId", (req, res) => orderController.getById(req, res));

export default router;
