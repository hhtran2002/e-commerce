import "reflect-metadata";
import { AppDataSource } from "../backend/src/config/data_source";
import "./src/config/cloudinary";

AppDataSource.initialize()
  .then(async () => {
    console.log("✅ DB connected");
  })
  .catch((err) => console.error("❌ DB error:", err));
