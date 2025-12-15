import { Request, Response } from "express";
import { AuthService } from "../service/AuthService";
import { error } from "console";

const authService = new AuthService();

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      // Nhận dữ liệu từ request body
      const newUser = await authService.register(req.body);
      res.status(201).json({
        message: "Đăng ký thành công",
        data: newUser,
      });
    } catch (error: any) {
      console.error("❌ Error in register:", error);
      res.status(400).json({ message: error.message });
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);
      res.json(result);
    } catch (error: any) {
      console.error("❌ Error in login:", error);
      res.status(400).json({ message: error.message });
    }
  }

  // --- 3. Quên mật khẩu (Yêu cầu token) ---
  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) {
        return res.status(400).json({ message: "Vui lòng cung cấp email!" });
      }

      const token = await authService.forgotPassword(email);

      // Vì hiện tại bạn đang log token ra console để test
      // nên API này sẽ trả về token luôn để bạn tiện copy paste vào Postman.
      // (Thực tế thì chỉ cần báo "Vui lòng kiểm tra email")
      res.status(200).json({
        message:
          "Yêu cầu thành công. Vui lòng kiểm tra email (hoặc console log) để lấy token.",
        debugToken: token,
      });
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // --- 4. Đặt lại mật khẩu (Dùng token để đổi pass) ---
  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        return res
          .status(400)
          .json({ message: "Vui lòng cung cấp token và mật khẩu mới!" });
      }

      const result = await authService.requestResetPassword(token, newPassword);

      res.status(200).json(result);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // --- 5. Cập nhật thông tin user ---
  static async updateUserInfo(req: Request, res: Response) {
    try {
      const userId = req.params.id;
      const { username, email, phone, password, newPassword } = req.body;

      if (!userId) {
        return res
          .status(400)
          .json({ message: "User ID không được cung cấp!" });
      }

      const result = await authService.updateUserInfo(userId, {
        username,
        email,
        phone,
        password,
        newPassword,
      });

      res.status(200).json(result);
    } catch (error: any) {
      console.error("❌ Error in updateUserInfo:", error);
      res.status(400).json({ message: error.message });
    }
  }
}
