import { v2 as cloudinary } from "cloudinary";
import { config as dotenvConfig } from "dotenv";

dotenvConfig();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// cloudinary.api
//   .ping()
//   .then(() => console.log("✅ Cloudinary connected"))
//   .catch((err) => console.error("❌ Cloudinary error:", err));

export default cloudinary;
