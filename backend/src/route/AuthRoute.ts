import { Router } from "express";
import { AuthController } from "../controller/AuthController";
import { checkJwt, checkRole } from "../middleware/checkRole";

const router = Router();

// --- PUBLIC ROUTES (Ai cũng truy cập được) ---
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.post("/forgot-password", AuthController.forgotPassword);
router.post("/reset-password", AuthController.resetPassword);

// --- PROTECTED ROUTES (Phải đăng nhập mới dùng được) ---

// Cập nhật thông tin user
router.put("/users/:id", [checkJwt], AuthController.updateUserInfo);

// Ví dụ 1: API xem thông tin cá nhân (Chỉ cần đăng nhập là được)
router.get("/profile", [checkJwt], (req: any, res: any) => {
  // Lấy ID user từ token đã giải mã
  const userId = res.locals.jwtPayload.userId;
  res.json({ message: `Chào user ${userId}, bạn đã xác thực thành công!` });
});

// Ví dụ 2: API chỉ dành cho ADMIN
router.get(
  "/admin-only",
  [checkJwt, checkRole(["ADMIN"])],
  (req: any, res: any) => {
    res.json({ message: "Khu vực bí mật chỉ dành cho ADMIN!" });
  }
);

// Ví dụ 3: API dành cho cả ADMIN và STAFF (nếu bạn có role STAFF)
// router.get("/management", [checkJwt, checkRole(["ADMIN", "STAFF"])], ...);

export default router;
