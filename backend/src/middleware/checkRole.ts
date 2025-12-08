import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

// Middleware 1: Kiểm tra xem User đã đăng nhập chưa (có Token hợp lệ không?)
export const checkJwt = (req: Request, res: Response, next: NextFunction) => {
    // Lấy token từ header "Authorization". Format chuẩn: "Bearer <token>"
    const token = req.headers["authorization"]?.split(" ")[1];

    if (!token) {
        res.status(401).json({ message: "Chưa đăng nhập! (Token missing)" });
        return;
    }

    try {
        // Giải mã token
        // QUAN TRỌNG: Secret key phải khớp với bên AuthService.ts
        const jwtPayload = jwt.verify(token, process.env.JWT_SECRET || "default_secret_key");

        // Lưu thông tin giải mã được vào biến locals để dùng ở các bước sau
        res.locals.jwtPayload = jwtPayload;

        // Token hợp lệ -> Cho đi tiếp
        next();
    } catch (error) {
        // Nếu token hết hạn hoặc sai
        res.status(401).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
        return;
    }
};

// Middleware 2: Kiểm tra User có đúng quyền (Role) yêu cầu không?
export const checkRole = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        // Lấy thông tin role từ payload đã giải mã ở bước checkJwt
        const userRole = res.locals.jwtPayload.role;

        // Kiểm tra role của user có nằm trong danh sách cho phép không
        // Ví dụ: API yêu cầu ["ADMIN"], user là "USER" => False
        if (roles.includes(userRole)) {
            next(); // Đúng quyền -> Cho đi tiếp
        } else {
            res.status(403).json({ message: "Bạn không có quyền truy cập chức năng này (Forbidden)!" });
        }
    };
};