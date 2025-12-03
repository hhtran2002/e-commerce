import Router from "express";
import { PasswordController } from "../controller/PasswordController";
import { AppDataSource } from "../config/data_source";
import { User } from "../entity/User";
import { Role } from "../entity/Role";
import * as bcrypt from "bcryptjs";

const router = Router();

router.post("/forgot-password", PasswordController.forgotPassword);
router.post("/reset-password", PasswordController.resetPassword);

// DEV helper: tạo user test nhanh (chỉ dùng trong dev)
router.post("/create-test-user", async (req, res) => {
  try {
    const { email, username, password, phone } = req.body;
    if (!email || !username)
      return res.status(400).json({ message: "email and username required" });

    const userRepo = AppDataSource.getRepository(User);
    const roleRepo = AppDataSource.getRepository(Role);

    let role = await roleRepo.findOneBy({ name: "user" });
    if (!role) {
      role = roleRepo.create({ name: "user" });
      await roleRepo.save(role);
    }

    const existing = await userRepo.findOneBy({ email });
    if (existing) return res.status(200).json({ message: "user exists" });

    const hashed = await bcrypt.hash(password || "Test1234!", 10);
    const user = userRepo.create({
      userName: username,
      email,
      hashPassword: hashed,
      phone: phone || "0000000000",
      fullName: username,
      role,
    } as any);

    await userRepo.save(user);
    return res.json({ message: "user created", userId: (user as any).id });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

export default router;
