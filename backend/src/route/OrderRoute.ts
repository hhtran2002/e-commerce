import { Router } from "express";
import { OrderController } from "../controller/OrderController";

const router = Router();
const orderController = new OrderController();

router.post("/", (req, res) => orderController.create(req, res));

export default router;
