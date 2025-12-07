import { AppDataSource } from "../config/data_source";
import { User } from "../entity/User";
import * as bcrypt from "bcryptjs";
import { getAdminToken, reseterPassword } from "../middleware/keycloakToken";
import crypto from "crypto";

export class PasswordService {
  private userRepo = AppDataSource.getRepository(User);

  async generateResetToken(email: string) {
    const user = await this.userRepo.findOneBy({ email });
    if (!user) throw new Error("Email không tồn tại");

    const token = crypto.randomBytes(32).toString("hex");
    const expiry = new Date();
    expiry.setHours(expiry.getHours() + 1);

    user.resetToken = token;
    user.resetTokenExpiry = expiry;
    await this.userRepo.save(user);

    // Debug: in token ra console để test trong môi trường dev
    console.log(`RESET TOKEN for ${email}: ${token}`);

    return token;
  }

  async resetPassword(token: string, newPassword: string) {
    const user = await this.userRepo.findOne({
      where: { resetToken: token },
    });
    if (!user) throw new Error("Token không hợp lệ");
    if (!user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
      throw new Error("Token đã hết hạn");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.hashPassword = hashedPassword;
    user.resetToken = null as any;
    user.resetTokenExpiry = null as any;
    await this.userRepo.save(user);

    // DEV: Try to sync with Keycloak, but don't fail if not available
    try {
      if (user.keycloakId) {
        const adminToken = await getAdminToken();
        await reseterPassword(adminToken, user.keycloakId, newPassword);
      }
    } catch (err: any) {
      console.warn(
        "Keycloak sync failed (continuing without it):",
        err.message
      );
    }

    return true;
  }
}
