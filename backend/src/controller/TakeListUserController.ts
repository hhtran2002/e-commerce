import { Request, Response } from "express";
import { TakeListUserService } from "../service/TakeListUserService";

const takeListUserService = new TakeListUserService();

export class TakeListUserController {
    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await takeListUserService.getAllUsers();

            res.status(200).json({
                message: "Lấy danh sách người dùng thành công",
                data: users,
                // Frontend sẽ nhận mảng này và tự loop để tạo cột STT
            });
        } catch (error: any) {
            console.error("❌ Error in getUsers:", error);
            res.status(500).json({ message: "Lỗi server khi lấy danh sách user." });
        }
    }
}