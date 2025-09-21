import "reflect-metadata";
import { AppDataSource } from "../backend/config/data_source";


AppDataSource.initialize()
  .then(async () => {
    console.log("✅ DB connected");
  })
  .catch((err) => console.error("❌ DB error:", err));
