import { Router } from "express";
import { AddressController } from "../controller/AddressController";
import { checkJwt } from "../middleware/checkRole";

const router = Router();

// -- Thêm địa chỉ mới (Phải đăng nhập) --
router.post("/", [checkJwt], AddressController.addAddress);

// -- Lấy tất cả địa chỉ của user --
router.get("/user/:userId", [checkJwt], AddressController.getUserAddresses);

// -- Cập nhật địa chỉ (Phải đăng nhập) --
router.put("/:id", [checkJwt], AddressController.updateAddress);

// -- Xóa địa chỉ (Phải đăng nhập) --
router.delete("/:id", [checkJwt], AddressController.deleteAddress);

export default router;
