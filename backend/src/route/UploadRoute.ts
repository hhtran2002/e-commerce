import { Router, Request, Response } from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary";

const router = Router();

// lưu file trên RAM, không lưu ra ổ cứng
const upload = multer({ storage: multer.memoryStorage() });

router.post(
  "/",
  upload.single("image"),
  async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      // buffer -> base64 data URI
      const b64 = Buffer.from(req.file.buffer).toString("base64");
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;

      const result = await cloudinary.uploader.upload(dataURI, {
        folder: "ecommerce-products", // muốn đổi tên folder thì đổi ở đây
      });

      return res.json({
        url: result.secure_url,
        publicId: result.public_id,
      });
    } catch (err) {
      console.error("Upload error:", err);
      return res.status(500).json({ message: "Upload failed" });
    }
  }
);

export default router;
