import { Request, Response } from "express";
import { PasswordService } from "../service/PasswordService";
import * as nodemailer from "nodemailer";

const passwordService = new PasswordService();

export class PasswordController {
  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      if (!email) return res.status(400).json({ message: "Email required" });

      const token = await passwordService.generateResetToken(email);

      // DEV: Skip email sending if SMTP not configured
      if (
        process.env.SMTP_USER &&
        process.env.SMTP_USER !== "your_email@example.com"
      ) {
        const transporter = nodemailer.createTransport({
          host: "smtp.example.com",
          port: 587,
          secure: false,
          auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
        });

        const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

        await transporter.sendMail({
          from: `"Support" <${process.env.SMTP_USER}>`,
          to: email,
          subject: "Reset your password",
          html: `<p>Click <a href="${resetLink}">here</a> to reset your password. Link valid for 1 hour.</p>`,
        });
      }

      res.json({
        message: "Reset password email sent (or would be in production)",
      });
    } catch (error: any) {
      console.error(error);
      res.status(500).json({ message: error.message });
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, newPassword } = req.body;
      if (!token || !newPassword)
        return res
          .status(400)
          .json({ message: "Token and newPassword required" });

      await passwordService.resetPassword(token, newPassword);
      res.json({ message: "Password has been reset successfully" });
    } catch (error: any) {
      console.error(error);
      res.status(400).json({ message: error.message });
    }
  }
}
